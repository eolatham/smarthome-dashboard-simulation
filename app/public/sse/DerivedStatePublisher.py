# STL
from typing import List
from logging import Logger

# PDM
from flask import Flask
from typeguard import typechecked
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.time.AppClock import AppClock
from public.events.EventQueue import EventQueue
from public.analysis.DerivedState import DerivedState
from public.sse.SSEPublisher import SSEPublisher, TimeType


class DerivedStatePublisher(SSEPublisher):
    """
    See `design.md`.
    """

    eventTypeString: str = "derivedState"
    preGeneratedEventQueue: EventQueue
    userGeneratedEventQueue: EventQueue

    @typechecked
    def __init__(
        self,
        logger: Logger,
        app: Flask,
        clock: AppClock,
        preGeneratedEventQueue: EventQueue,
        userGeneratedEventQueue: EventQueue,
        scheduler: BackgroundScheduler,
        jobIntervalSeconds: float,
        jobIntervalType: TimeType,
    ) -> None:
        self.preGeneratedEventQueue = preGeneratedEventQueue
        self.userGeneratedEventQueue = userGeneratedEventQueue
        super().__init__(
            logger, app, clock, scheduler, jobIntervalSeconds, jobIntervalType
        )

    # TODO: finish this
    def getObjectsToPublish(self) -> List[DerivedState]:
        """
        Returns a singleton list containing an object with the current indoor
        temperature (in Fahrenheit) and HVAC status of the smart home.
        """
        newPreGeneratedEvents = self.preGeneratedEventQueue.getNewEvents()
        newUserGeneratedEvents = self.userGeneratedEventQueue.getNewEvents()
        newEvents = sorted(
            newPreGeneratedEvents + newUserGeneratedEvents, key=lambda e: e["time"]
        )
        indoorTemp = 0
        hvacStatus = "off"

        # - Calculate total time doors and windows have been open since last call
        # - Calculate average outdoor temperature since last call
        # - Apply variables to formulas to derive indoor temperature and HVAC status

        for event in newEvents:
            if event["stateKey"] == "door":
                ...

        return [{"indoorTempFahrenheit": indoorTemp, "hvacStatus": hvacStatus}]
