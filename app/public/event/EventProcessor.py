# STL
from logging import Logger
from public.clock.AppClock import AppClock

# PDM
from flask import Flask
from flask_sse import sse
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.event.EventQueue import EventQueue


class EventProcessor:
    """
    The event processor uses a background scheduler to continuously
    poll and process occurring events from an event queue.

    At every half-minute of app time, the event processor retrieves all unprocessed
    past events from the event queue and does the following with each one:
    - applies its changes to the smart home state
    - sends it as an SSE to the frontend to be displayed
    """

    logger: Logger
    app: Flask
    clock: AppClock
    eventQueue: EventQueue
    scheduler: BackgroundScheduler
    jobInterval: float  # One half-minute of app time represented in real seconds
    jobID: int

    def __init__(
        self,
        logger: Logger,
        app: Flask,
        clock: AppClock,
        eventQueue: EventQueue,
    ) -> None:
        self.logger = logger
        self.app = app
        self.clock = clock
        self.eventQueue = eventQueue
        self.scheduler = BackgroundScheduler()

    def initJobInterval(self) -> None:
        """
        Sets `self.jobInterval` to the value of one half-minute
        of app time represented in real seconds.
        """
        self.jobInterval = 30 / self.clock.getSpeedupFactor()

    def updateJobInterval(self) -> None:
        """
        Updates the job interval based on the current speed of the app clock
        to keep processing events at every half-minute of app time.
        """
        self.initJobInterval()
        self.scheduler.modify_job(self.jobID, seconds=self.jobInterval)

    def __processNewEvents(self) -> None:
        """
        Retrieves all unprocessed past events from the event queue
        and does the following with each one:
        - applies its changes to the smart home state
        - sends it as an SSE to the frontend to be displayed
        """
        with self.app.app_context():
            for event in self.eventQueue.getNewEvents():
                self.logger.info("Retrieved new event to process: %s", event)

                self.logger.info("Applying event changes to the smart home state")
                # TODO: apply event changes to the smart home state

                self.logger.info("Sending event as an SSE to the frontend")
                sse.publish(event, type="event")

    def start(self) -> None:
        """
        Starts the app clock and event processor if they are not already running.
        """
        if not self.clock.running:
            self.clock.start()
        if not self.scheduler.running:
            self.initJobInterval()
            self.jobID = self.scheduler.add_job(
                self.__processNewEvents,
                trigger="interval",
                seconds=self.jobInterval,
            ).id
            self.scheduler.start()
