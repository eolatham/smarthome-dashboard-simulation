# STL
from logging import Logger
from typing import Literal, TypedDict

# PDM
from flask import Flask
from typeguard import typechecked
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.time.AppClock import AppClock
from public.events.EventStore import EventStore
from public.sse.SSEPublisher import SSEPublisher, TimeType


HVACStatus = Literal["heating", "cooling", "off"]


class DerivedState(TypedDict):
    """
    See `design.md`.
    """

    indoorTempFahrenheit: float
    hvacStatus: HVACStatus


class DerivedStatePublisher(SSEPublisher):
    """
    See `design.md`.
    """

    sseType: str = "derived-state"
    eventStore: EventStore
    lastPublishTime: int

    # Override
    @typechecked
    def __init__(
        self,
        logger: Logger,
        app: Flask,
        clock: AppClock,
        eventStore: EventStore,
        scheduler: BackgroundScheduler,
        jobIntervalSeconds: float,
        jobIntervalType: TimeType,
    ) -> None:
        self.eventStore = eventStore
        self.lastPublishTime = eventStore.minTime
        super().__init__(
            logger, app, clock, scheduler, jobIntervalSeconds, jobIntervalType
        )

    # Override
    def start(self) -> None:
        self.lastPublishTime = self.eventStore.minTime
        super().start()

    def calculateIndoorTemp(self) -> float:
        """
        Base case - indoor temp = thermostat setting
        House Closed – For every 10 deg F difference in external temp, interior temp will +/- 2 deg F per hour
        Open Door – For every 10 deg F difference in external temp, interior temp will +/- 2 deg F per 5 min door is open
        Open Window - For every 10 deg F difference in external temp, interior temp will +/- 1 deg F per 5 min window is open
        """

        def indoorTempChange(
            totalSeconds: int,
            openDoorSeconds: int,
            openWindowSeconds: int,
            outdoorTempFahrenheit: int,
            thermostatSettingFahrenheit: int,
        ) -> float:
            indoorDegChangePerHouseClosedSecPerOutdoorDegDiff = 2 / (3600 * 10)
            indoorDegChangePerOpenDoorSecPerOutdoorDegDiff = 2 / (60 * 5 * 10)
            indoorDegChangePerOpenWindowSecPerOutdoorDegDiff = 1 / (60 * 5 * 10)

            degDiff = abs(outdoorTempFahrenheit - thermostatSettingFahrenheit)
            degChangeDir = (
                1 if outdoorTempFahrenheit > thermostatSettingFahrenheit else -1
            )
            baseDegChange = (
                indoorDegChangePerHouseClosedSecPerOutdoorDegDiff
                * totalSeconds
                * degDiff
            )
            openDoorDegChange = (
                indoorDegChangePerOpenDoorSecPerOutdoorDegDiff
                * openDoorSeconds
                * degDiff
            )
            openWindowDegChange = (
                indoorDegChangePerOpenWindowSecPerOutdoorDegDiff
                * openWindowSeconds
                * degDiff
            )
            return degChangeDir * (
                baseDegChange + openDoorDegChange + openWindowDegChange
            )

        start = self.lastPublishTime
        end = self.lastPublishTime = int(self.clock.time())

        tempChange = 0

        lastSampleTime = 0  # TODO: make attribute

        outdoorTemp = 0  # TODO: make attribute
        thermostatSetting = 0  # TODO: make attribute

        doorOpen = False  # TODO: make attribute
        lastDoorOpenTime = 0  # TODO: make attribute
        openDoorSeconds = 0  # TODO: make attribute

        windowOpen = False  # TODO: make attribute
        lastWindowOpenTime = 0  # TODO: make attribute
        openWindowSeconds = 0  # TODO: make attribute

        for event in self.eventStore.yieldEvents(
            start,
            end,
            {  # TODO: pull out into constant (will have multiple doors and windows!)
                "doorOpen",
                "windowOpen",
                "outdoorTempFahrenheit",
                "thermostatSettingFahrenheit",
            },
        ):
            # TODO: refactor into multiple functions
            if event["stateKey"] == "doorOpen":
                if doorOpen and not event["newValue"]:  # Door closed
                    openDoorSeconds += event["time"] - lastDoorOpenTime
                    doorOpen = event["newValue"]
                elif not doorOpen and event["newValue"]:  # Door opened
                    lastDoorOpenTime = event["time"]
                    doorOpen = event["newValue"]

            elif event["stateKey"] == "windowOpen":
                if windowOpen and not event["newValue"]:  # Window closed
                    openWindowSeconds += event["time"] - lastWindowOpenTime
                    windowOpen = event["newValue"]
                elif not windowOpen and event["newValue"]:  # Window opened
                    lastWindowOpenTime = event["time"]
                    windowOpen = event["newValue"]

            elif event["stateKey"] == "outdoorTempFahrenheit":  # Take new sample
                outdoorTemp = event["newValue"]
                tempChange += indoorTempChange(
                    event["time"] - lastSampleTime,
                    openDoorSeconds,
                    openWindowSeconds,
                    outdoorTemp,
                    thermostatSetting,
                )
                lastSampleTime = event["time"]
                openDoorSeconds = 0
                openWindowSeconds = 0

            elif event["stateKey"] == "thermostatSettingFahrenheit":  # Take new sample
                thermostatSetting = event["newValue"]
                tempChange += indoorTempChange(
                    event["time"] - lastSampleTime,
                    openDoorSeconds,
                    openWindowSeconds,
                    outdoorTemp,
                    thermostatSetting,
                )
                lastSampleTime = event["time"]
                openDoorSeconds = 0
                openWindowSeconds = 0

        return thermostatSetting + tempChange

    def calculateHVACStatus(self) -> HVACStatus:
        """ """

    # Override
    def job(self) -> None:
        """
        Publishes a `DerivedState` object as a SSE.
        """
        derivedState: DerivedState = {
            "indoorTempFahrenheit": self.calculateIndoorTemp(),
            "hvacStatus": self.calculateHVACStatus(),
        }
        self.publish(derivedState)
