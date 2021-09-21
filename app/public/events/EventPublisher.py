# STL
from logging import Logger

# PDM
from flask import Flask
from typeguard import typechecked
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.time.AppClock import AppClock
from public.events.EventStore import EventStore
from public.sse.SSEPublisher import SSEPublisher, TimeType


class EventPublisher(SSEPublisher):
    """
    See `design.md`.
    """

    sseType: str = "event"
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
        self.lastPublishTime = 0
        super().start()

    # Override
    def job(self) -> None:
        """
        Publishes all unprocessed past pre-generated events from the event map as SSEs.
        """
        start = self.lastPublishTime
        end = self.lastPublishTime = int(self.clock.time())
        for event in self.eventStore.yieldPreGeneratedEvents(start, end):
            self.publish(event)
