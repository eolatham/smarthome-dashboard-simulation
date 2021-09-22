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
    lastCalculationTime: int
    indoorTemp: int
    outdoorTemp: int
    thermostatTemp: int
    eventStore: EventStore
    outdoorTempStateKey: str
    thermostatTempStateKey: str
    doorStateKeys: Set[str]
    windowStateKeys: Set[str]
    relevantStateKeys: Set[str]
    doorOpeningTrackerMap: OpeningTrackerMap
    windowOpeningTrackerMap: OpeningTrackerMap

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
        """
        Schedules a SSE-publishing job (the `job` method) to run on an interval.

        - `logger`: `Logger` object to be used for internal logging
        - `app`: `Flask` app to be used as the server for SSEs
        - `clock`: `AppClock` to be used for keeping track of app time
        - `eventStore`: `EventStore` initialized with all pre-generated events for the simulation
        - `outdoorTempStateKey`: outdoor temperature state key for filtering events
        - `thermostatTempStateKey`: thermostat temperature state key for filtering events
        - `doorStateKeys`: door state keys for filtering events
        - `windowStateKeys`: window state keys for filtering events
        - `scheduler`: `BackgroundScheduler` to run the SSE-publishing job on an interval
        - `jobIntervalSeconds`: the SSE-publishing job interval in seconds
        - `jobIntervalTimeType`: the type of time that the job interval uses (real time or app time)
        """
        if eventStore.isEmpty():
            raise ValueError("`eventStore` should contain all pre-generated events!")
        self.eventStore = eventStore
        self.lastPublishTime = self.lastCalculationTime = eventStore.minTime
        self.outdoorTempStateKey = outdoorTempStateKey
        self.thermostatTempStateKey = thermostatTempStateKey
        self.doorStateKeys = doorStateKeys
        self.windowStateKeys = windowStateKeys
        self.relevantStateKeys = (
            {outdoorTempStateKey, thermostatTempStateKey}
            | doorStateKeys
            | windowStateKeys
        )
        self.outdoorTemp = eventStore.getFirstEventValue(outdoorTempStateKey)
        self.indoorTemp = self.thermostatTemp = eventStore.getFirstEventValue(
            thermostatTempStateKey
        )
        self.doorOpeningTrackerMap = OpeningTrackerMap(eventStore, doorStateKeys)
        self.windowOpeningTrackerMap = OpeningTrackerMap(eventStore, windowStateKeys)
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
