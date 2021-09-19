# STL
from logging import Logger

# PDM
from flask import Flask
from typeguard import typechecked
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.time.AppClock import AppClock
from public.events.Event import SortedEventList
from public.events.EventQueue import EventQueue
from public.sse.SSEPublisher import SSEPublisher, TimeType


class EventPublisher(SSEPublisher):
    """
    See `design.md`.
    """

    eventTypeString: str = "event"
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
        jobIntervalType: TimeType,
    ) -> None:
        self.eventQueue = eventQueue
        super().__init__(
            logger, app, clock, scheduler, jobIntervalSeconds, jobIntervalType
        )

    def getObjectsToPublish(self) -> SortedEventList:
        """
        Returns all unprocessed past events from the event queue.
        """
        return self.eventQueue.getNewEvents()
