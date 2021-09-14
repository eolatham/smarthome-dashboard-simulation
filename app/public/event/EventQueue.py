# STL
from logging import Logger

# LOCAL
from public.event.Event import SortedEventList
from public.clock.AppClock import AppClock


class EventQueue:
    logger: Logger
    clock: AppClock
    events: SortedEventList
    numEvents: int
    pointer: int  # Index of `events` where all preceding elements have been processed

    def __init__(
        self, logger: Logger, clock: AppClock, events: SortedEventList
    ) -> None:
        self.logger = logger
        self.clock = clock
        self.events = events
        self.numEvents = len(events)
        self.pointer = 0

    def getNewEvents(self) -> SortedEventList:
        """
        Returns all past events (according to app time)
        in the queue that have not yet been processed.
        """
        currentAppTime = self.clock.time()
        self.logger.info(
            "Getting unprocessed events older than the current application time of %s...",
            currentAppTime,
        )
        start = end = self.pointer
        while end < self.numEvents and self.events[end]["time"] < currentAppTime:
            end += 1
        self.pointer = end
        return self.events[start:end]

    def getOldEvents(self) -> SortedEventList:
        """
        Returns all past events (according to app time)
        in the queue that have already been processed.
        """
        return self.events[: self.pointer]
