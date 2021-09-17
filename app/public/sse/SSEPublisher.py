# STL
from logging import Logger
from typing import Literal
from abc import ABC, abstractmethod

# PDM
from flask import Flask
from flask_sse import sse
from typeguard import typechecked
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.constants import *
from public.time.AppClock import AppClock

JobIntervalType = Literal[REAL_TIME, APP_TIME]


class SSEPublisher(ABC):
    """
    An abstract base class providing common functionality
    for the Flask-Redis SSE publishers used in the app.
    """

    logger: Logger
    app: Flask
    clock: AppClock
    scheduler: BackgroundScheduler
    jobIntervalSeconds: float
    jobIntervalType: JobIntervalType
    jobID: int

    @typechecked
    def __init__(
        self,
        logger: Logger,
        app: Flask,
        clock: AppClock,
        scheduler: BackgroundScheduler,
        jobIntervalSeconds: float,
        jobIntervalType: JobIntervalType,
    ) -> None:
        """
        Schedules a job (the `publish` method) to run on the given interval
        within the given background scheduler.
        """
        self.logger = logger
        self.app = app
        self.clock = clock
        self.scheduler = scheduler
        self.jobIntervalSeconds = jobIntervalSeconds
        self.jobIntervalType = jobIntervalType
        self.__createJob()

    def __createJob(self) -> None:
        self.jobID = self.scheduler.add_job(
            self.publish,
            trigger="interval",
            seconds=self.jobIntervalSeconds / self.clock.getSpeedupFactor()
            if self.jobIntervalType == APP_TIME
            else self.jobIntervalSeconds,
        ).id

    def setJobInterval(self, jobIntervalSeconds: float) -> None:
        """
        Sets the job interval to the given value (interpreted
        according to the provided job interval type).
        """
        self.jobIntervalSeconds = jobIntervalSeconds
        self.scheduler.remove_job(self.jobID)
        self.__createJob()

    def refreshJobInterval(self) -> None:
        """
        If running on an app time interval, refreshes the interval based on
        the current speed of the app clock. Otherwise, does nothing.
        """
        if self.jobIntervalType == APP_TIME:
            self.setJobInterval(self.jobIntervalSeconds)

    def start(self) -> None:
        """
        Starts the background scheduler if it is not already running.
        """
        if not self.scheduler.running:
            self.scheduler.start()

    @abstractmethod
    def publish(self) -> None:
        """
        Publishes one or more SSEs from the provided app.
        """
        with self.app.app_context():
            sse.publish({"message": "Hello, world!"}, type="message")
