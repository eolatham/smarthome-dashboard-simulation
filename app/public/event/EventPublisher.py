# STL
import logging

# PDM
from flask_sse import sse
from flask import current_app
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.event.EventQueue import EventQueue

LOG = logging.getLogger()


class EventPublisher:
    eventQueue: EventQueue
    scheduler: BackgroundScheduler
    publishIntervalSeconds: float
    publishJobID: int

    def __init__(self, eventQueue: EventQueue, publishIntervalSeconds: float) -> None:
        """
        `publishIntervalSeconds` is in real time.
        """
        self.eventQueue = eventQueue
        self.scheduler = BackgroundScheduler()
        self.publishIntervalSeconds = publishIntervalSeconds
        self.publishJobID = self.scheduler.add_job(
            self.__publishNewEvents, "interval", seconds=publishIntervalSeconds
        ).id

    def __publishNewEvents(self) -> None:
        """
        Sends server-sent events for each new event on the event queue.
        """
        with current_app.app_context():
            for event in self.eventQueue.getNewEvents():
                LOG.info("Publishing new event: %s", event)
                sse.publish(event)

    def setPublishIntervalSeconds(self, publishIntervalSeconds: float) -> None:
        self.publishIntervalSeconds = publishIntervalSeconds
        self.scheduler.modify_job(self.publishJobID, seconds=publishIntervalSeconds)

    def start(self):
        self.scheduler.start()

    def stop(self):
        self.scheduler.shutdown()
