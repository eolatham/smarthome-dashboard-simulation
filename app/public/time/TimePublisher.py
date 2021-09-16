# STL
from logging import Logger

# PDM
from flask import Flask
from flask_sse import sse
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.time.AppClock import AppClock


class TimePublisher:
    """
    See `design.md`.
    """

    logger: Logger
    app: Flask
    clock: AppClock
    scheduler: BackgroundScheduler
    jobInterval: float
    jobID: int

    def __init__(
        self,
        logger: Logger,
        app: Flask,
        clock: AppClock,
        scheduler: BackgroundScheduler,
        jobInterval: float,
    ) -> None:
        """
        `jobInterval` is in real seconds.
        """
        self.logger = logger
        self.app = app
        self.clock = clock
        self.scheduler = scheduler
        self.jobInterval = jobInterval
        self.jobID = self.scheduler.add_job(
            self.publish,
            trigger="interval",
            seconds=self.jobInterval,
        ).id

    def setJobInterval(self, jobInterval: float) -> None:
        """
        `jobInterval` is in real seconds.
        """
        self.jobInterval = jobInterval
        self.scheduler.modify_job(self.jobID, seconds=self.jobInterval)

    def publish(self) -> None:
        """
        Publishes the current time and speedup factor of the app clock as an SSE:
        ```
        {
            "time": "<the current app time in seconds>",
            "speed": "<the current speedup factor of the app clock>"
        }
        ```
        """
        with self.app.app_context():
            data = {"time": self.clock.time(), "speed": self.clock.getSpeedupFactor()}
            self.logger.info("Sending SSE with current app time data: %s", data)
            sse.publish(data, type="time")

    def start(self) -> None:
        """
        Starts the background scheduler if it is not already running.
        """
        if not self.scheduler.running:
            self.scheduler.start()
