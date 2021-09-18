# STL
from logging import Logger
from typing import Literal, List
from abc import ABC, abstractmethod

# PDM
from flask import Flask
from flask_sse import sse
from typeguard import typechecked
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.constants import *
from public.time.AppClock import AppClock

TimeType = Literal[REAL_TIME, APP_TIME]


class SSEPublisher(ABC):
    """
    See `design.md`.
    """

    eventTypeString: str = "CHANGE_ME"  # The "type" to publish SSEs under

    logger: Logger
    app: Flask
    clock: AppClock
    scheduler: BackgroundScheduler
    jobIntervalSeconds: float
    jobIntervalTimeType: TimeType
    jobID: int

    @typechecked
    def __init__(
        self,
        logger: Logger,
        app: Flask,
        clock: AppClock,
        scheduler: BackgroundScheduler,
        jobIntervalSeconds: float,
        jobIntervalTimeType: TimeType,
    ) -> None:
        """
        Schedules a SSE-publishing job (the `__publish` method) to run on an interval.

        - `logger`: `Logger` object to be used for internal logging
        - `app`: `Flask` app to be used as the server for SSEs
        - `clock`: `AppClock` to be used for keeping track of app time
        - `scheduler`: `BackgroundScheduler` to run the SSE-publishing job on an interval
        - `jobIntervalSeconds`: the SSE-publishing job interval in seconds
        - `jobIntervalTimeType`: the type of time that the job interval uses (real time or app time)
        """
        self.logger = logger
        self.app = app
        self.clock = clock
        self.scheduler = scheduler
        self.jobIntervalSeconds = jobIntervalSeconds
        self.jobIntervalTimeType = jobIntervalTimeType
        self.__createJob()

    def __createJob(self) -> None:
        """
        Creates or replaces the SSE-publishing job.
        """
        if hasattr(self, "jobID"):
            self.scheduler.remove_job(self.jobID)
        self.jobID = self.scheduler.add_job(
            self.__publish,
            trigger="interval",
            seconds=self.jobIntervalSeconds / self.clock.getSpeedupFactor()
            if self.jobIntervalTimeType == APP_TIME
            else self.jobIntervalSeconds,
        ).id

    def setJobInterval(self, jobIntervalSeconds: float) -> None:
        """
        Sets the job interval (interpreted according
        to the provided job interval type).
        """
        self.jobIntervalSeconds = jobIntervalSeconds
        self.__createJob()

    def refreshJobInterval(self) -> None:
        """
        If running on an app time interval, refreshes the interval based on
        the current speed of the app clock. Otherwise, does nothing.
        """
        if self.jobIntervalTimeType == APP_TIME:
            self.setJobInterval(self.jobIntervalSeconds)

    def start(self) -> None:
        """
        Starts the background scheduler if it is not already running.
        """
        if not self.scheduler.running:
            self.scheduler.start()

    def __publish(self) -> None:
        """
        Publishes each object returned by `getObjectsToPublish` as
        a SSE with the provided event type from the provided app.
        """
        with self.app.app_context():
            for x in self.getObjectsToPublish():
                sse.publish(x, type=self.eventTypeString)

    @abstractmethod
    def getObjectsToPublish(self) -> List:
        """
        Returns a list of objects to be published by the SSE-publishing job.
        NOTE: implementing classes need to implement this method!
        """
