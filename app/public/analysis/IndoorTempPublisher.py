# STL
from logging import Logger
from typing import Set

# PDM
from flask import Flask
from typeguard import typechecked
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.time.AppClock import AppClock
from public.events.Event import Event
from public.events.EventStore import EventStore
from public.sse.SSEPublisher import SSEPublisher, TimeType
from public.analysis.IndoorTempFormulas import IndoorTempFormulas
from public.analysis.OpeningTracker import OpeningType, OpeningTrackerMap


class IndoorTempPublisher(SSEPublisher):
    """
    See `design.md`.
    """

    sseType: str = "indoor-temp"
    lastPublishTime: int
    eventStore: EventStore
    indoorTemp: int
    lastCalculationTime: int
    outdoorTemp: int
    outdoorTempStateKey: str
    thermostatTemp: int
    thermostatTempStateKey: str
    doorStateKeys: Set[str]
    doorOpeningTrackerMap: OpeningTrackerMap
    windowStateKeys: Set[str]
    windowOpeningTrackerMap: OpeningTrackerMap
    relevantStateKeys: Set[str]

    # Override
    @typechecked
    def __init__(
        self,
        logger: Logger,
        app: Flask,
        clock: AppClock,
        eventStore: EventStore,
        outdoorTempStateKey: str,
        thermostatTempStateKey: str,
        doorStateKeys: Set[str],
        windowStateKeys: Set[str],
        scheduler: BackgroundScheduler,
        jobIntervalSeconds: float,
        jobIntervalType: TimeType,
    ) -> None:
        self.eventStore = eventStore
        self.lastPublishTime = eventStore.minTime
        self.indoorTemp = self.thermostatTemp = eventStore.getFirstEventValue(
            thermostatTempStateKey
        )
        self.outdoorTempStateKey = outdoorTempStateKey
        self.thermostatTempStateKey = thermostatTempStateKey
        self.doorStateKeys = doorStateKeys
        self.doorOpeningTrackerMap = OpeningTrackerMap(eventStore, doorStateKeys)
        self.windowStateKeys = windowStateKeys
        self.windowOpeningTrackerMap = OpeningTrackerMap(eventStore, windowStateKeys)
        self.relevantStateKeys = (
            {outdoorTempStateKey, thermostatTempStateKey}
            | doorStateKeys
            | windowStateKeys
        )
        super().__init__(
            logger, app, clock, scheduler, jobIntervalSeconds, jobIntervalType
        )

    # Override
    def start(self) -> None:
        self.lastPublishTime = self.eventStore.minTime
        super().start()

    def processOpeningEvent(self, event: Event, openingType: OpeningType) -> None:
        """
        `event` is a door or window event.
        """
        trackerMap = (
            self.doorOpeningTrackerMap
            if openingType == "door"
            else self.windowOpeningTrackerMap
        )
        tracker = trackerMap.getTracker(event["stateKey"])
        if tracker.isOpen and not event["newValue"]:  # Closed
            tracker.totalOpenTime += event["time"] - tracker.lastOpenTime
            tracker.isOpen = event["newValue"]
        elif not tracker.isOpen and event["newValue"]:  # Opened
            tracker.lastOpenTime = event["time"]
            tracker.isOpen = event["newValue"]

    def processDoorEvent(self, event: Event) -> None:
        """
        `event` is a door event.
        """
        self.processOpeningEvent(event, "door")

    def processWindowEvent(self, event: Event) -> None:
        """
        `event` is a window event.
        """
        self.processOpeningEvent(event, "window")

    def calculateIndoorTemp(self, event: Event) -> None:
        """
        `event` is the first event since the last calculation that
        changed either the outdoor temp or the thermostat temp.
        """
        # Save the new outdoor temp or thermostat temp
        if event["stateKey"] == "outdoorTemp":
            self.outdoorTemp = event["newValue"]
        elif event["stateKey"] == "thermostatTemp":
            self.thermostatTemp = event["newValue"]
        else:
            raise ValueError(
                '`event` should be an "outdoorTemp" or "thermostatTemp" event!'
            )
        # Calculate the new indoor temp
        self.indoorTemp = int(
            IndoorTempFormulas.indoorTemp(
                self.indoorTemp,
                self.outdoorTemp,
                self.thermostatTemp,
                event["time"] - self.lastCalculationTime,
                self.doorOpeningTrackerMap.getTotalOpenTime(),
                self.windowOpeningTrackerMap.getTotalOpenTime(),
            )
        )
        # Begin a new calculation timeframe
        self.lastCalculationTime = event["time"]
        self.doorOpeningTrackerMap.resetTotalOpenTime()
        self.windowOpeningTrackerMap.resetTotalOpenTime()

    # Override
    def job(self) -> None:
        """
        Publishes the current indoor temp of the smart home as a SSE.
        """
        start = self.lastPublishTime
        end = self.lastPublishTime = int(self.clock.time())
        for event in self.eventStore.yieldEvents(start, end, self.relevantStateKeys):
            if event["stateKey"] in self.doorStateKeys:
                self.processDoorEvent(event)
            elif event["stateKey"] in self.windowStateKeys:
                self.processWindowEvent(event)
            elif event["stateKey"] in {
                self.outdoorTempStateKey,
                self.thermostatTempStateKey,
            }:
                self.calculateIndoorTemp(event)
        self.publish(self.indoorTemp)
