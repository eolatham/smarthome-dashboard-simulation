# STL
from logging import Logger

# PDM
from typeguard import typechecked

# LOCAL
from public.time.AppClock import AppClock
from public.events.Event import SortedEventList


class EventQueue:
    """
    See `design.md`.
    """

    logger: Logger
    clock: AppClock
    events: SortedEventList
    next: int  # Index of the next unprocessed event

    @typechecked
    def __init__(
        self, logger: Logger, clock: AppClock, events: SortedEventList
    ) -> None:
        self.logger = logger
        self.clock = clock
        self.events = events
        self.next = 0

    def reset(self) -> None:
        """
        Resets the event queue to continue processing from the
        beginning of the provided list of events.
        """
        self.next = 0

    def getOldEvents(self) -> SortedEventList:
        """
        Returns all past events (according to app time)
        in the queue that have already been processed.
        """
        return self.events[: self.next]

    def getNewEvents(self) -> SortedEventList:
        """
        Returns all past events (according to app time)
        in the queue that have not yet been processed.
        """
        currentAppTime = self.clock.time()
        self.logger.info(
            "Getting unprocessed events older than the current app time of %s...",
            currentAppTime,
        )
        start = end = self.next
        while end < len(self.events) and self.events[end]["time"] < currentAppTime:
            end += 1
        self.next = end
        return self.events[start:end]
