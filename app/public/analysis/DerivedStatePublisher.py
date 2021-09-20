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
    lastPublishTime: int = 0
    eventStore: EventStore

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
        super().__init__(
            logger, app, clock, scheduler, jobIntervalSeconds, jobIntervalType
        )

    # Override
    def start(self) -> None:
        self.lastPublishTime = 0
        super().start()

    # Override
    def job(self) -> None:
        """
        Publishes a `DerivedState` object as a SSE.
        """
        derivedState: DerivedState = {"indoorTempFahrenheit": 0, "hvacStatus": "off"}

        # - Calculate total time doors and windows have been open since last call
        # - Calculate average outdoor temperature since last call
        # - Apply variables to formulas to derive indoor temperature and HVAC status

        start = self.lastPublishTime
        end = self.lastPublishTime = int(self.clock.time())
        for event in self.eventStore.yieldEvents(start, end, {"x", "y", "z"}):
            if event["stateKey"] == "x":
                ...
            elif event["stateKey"] == "y":
                ...
            elif event["stateKey"] == "z":
                ...

        # TODO: finish this

        self.publish(derivedState)
