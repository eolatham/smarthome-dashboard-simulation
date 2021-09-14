# STL
from logging import Logger

# PDM
from flask import Flask
from flask_sse import sse
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.event.EventQueue import EventQueue


class EventPublisher:
    app: Flask
    logger: Logger
    eventQueue: EventQueue
    scheduler: BackgroundScheduler
    publishIntervalSeconds: float
    publishJobID: int

    def __init__(
        self,
        app: Flask,
        logger: Logger,
        eventQueue: EventQueue,
        publishIntervalSeconds: float,
    ) -> None:
        """
        `publishIntervalSeconds` is in real time.
        """
        self.app = app
        self.logger = logger
        self.eventQueue = eventQueue
        self.scheduler = BackgroundScheduler()
        self.publishIntervalSeconds = publishIntervalSeconds
        self.publishJobID = self.scheduler.add_job(
            self.__publishNewEvents,
            trigger="interval",
            seconds=publishIntervalSeconds,
        ).id

    def __publishNewEvents(self) -> None:
        """
        Sends server-sent events for each new event on the event queue.
        """
        with self.app.app_context():
            for event in self.eventQueue.getNewEvents():
                self.logger.info("Publishing new event: %s", event)
                sse.publish(event)

    def setPublishIntervalSeconds(self, publishIntervalSeconds: float) -> None:
        """
        `publishIntervalSeconds` is in real time.
        """
        self.publishIntervalSeconds = publishIntervalSeconds
        self.scheduler.modify_job(self.publishJobID, seconds=publishIntervalSeconds)

    def start(self) -> None:
        self.scheduler.start()

    def stop(self) -> None:
        self.scheduler.shutdown()
