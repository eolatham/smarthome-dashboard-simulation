# STL
from logging import Logger

# PDM
from flask import Flask
from flask_sse import sse
from typeguard import typechecked
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.time.AppClock import AppClock
from public.events.EventQueue import EventQueue
from public.sse.SSEPublisher import SSEPublisher, JobIntervalType


class EventPublisher(SSEPublisher):
    """
    See `design.md`.
    """

    eventQueue: EventQueue

    @typechecked
    def __init__(
        self,
        logger: Logger,
        app: Flask,
        clock: AppClock,
        eventQueue: EventQueue,
        scheduler: BackgroundScheduler,
        jobIntervalSeconds: float,
        jobIntervalType: JobIntervalType,
    ) -> None:
        self.eventQueue = eventQueue
        super().__init__(
            logger, app, clock, scheduler, jobIntervalSeconds, jobIntervalType
        )

    def publish(self) -> None:
        """
        Publishes all unprocessed past events from the event queue as SSEs.
        """
        with self.app.app_context():
            for event in self.eventQueue.getNewEvents():
                self.logger.info("Sending SSE with smart home event data: %s...", event)
                sse.publish(event, type="event")
