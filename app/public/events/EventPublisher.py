# STL
from logging import Logger

# PDM
from flask import Flask
from flask_sse import sse
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.time.AppClock import AppClock
from public.events.EventQueue import EventQueue


class EventPublisher:
    """
    See `design.md`.
    """

    logger: Logger
    app: Flask
    clock: AppClock
    eventQueue: EventQueue
    scheduler: BackgroundScheduler
    jobIntervalAppTime: float
    jobIntervalRealTime: float
    jobID: int

    def __init__(
        self,
        logger: Logger,
        app: Flask,
        clock: AppClock,
        eventQueue: EventQueue,
        scheduler: BackgroundScheduler,
        jobIntervalAppTime: float,
    ) -> None:
        """
        `jobIntervalAppTime` is in app seconds.
        """
        self.logger = logger
        self.app = app
        self.clock = clock
        self.eventQueue = eventQueue
        self.scheduler = scheduler
        self.jobIntervalAppTime = jobIntervalAppTime
        self.jobIntervalRealTime = jobIntervalAppTime / self.clock.getSpeedupFactor()
        self.jobID = self.scheduler.add_job(
            self.publish,
            trigger="interval",
            seconds=self.jobIntervalRealTime,
        ).id

    def setJobInterval(self, jobIntervalAppTime: float) -> None:
        """
        `jobInterval` is in app seconds.
        """
        self.jobIntervalAppTime = jobIntervalAppTime
        self.jobIntervalRealTime = jobIntervalAppTime / self.clock.getSpeedupFactor()
        self.scheduler.modify_job(self.jobID, seconds=self.jobIntervalRealTime)

    def refreshJobInterval(self) -> None:
        """
        Updates the job interval based on the current speed of the app clock
        to keep publishing events at the provided interval of app time.
        """
        self.setJobInterval(self.jobIntervalAppTime)

    def publish(self) -> None:
        """
        Publishes all unprocessed past events from the event queue as SSEs.
        """
        with self.app.app_context():
            for event in self.eventQueue.getNewEvents():
                self.logger.info("Sending SSE with smart home event data: %s...", event)
                sse.publish(event, type="event")

    def start(self) -> None:
        """
        Starts the background scheduler if it is not already running.
        """
        if not self.scheduler.running:
            self.scheduler.start()
