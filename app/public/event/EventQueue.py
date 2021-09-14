# STL
from logging import Logger

# LOCAL
from public.clock.AppClock import AppClock
from public.event.Event import SortedEventList


class EventQueue:
    """
    The event queue is a custom queue data structure for storing and retrieving smart home events.

    It stores all events provided to it while only allowing past events to be retrieved, which
    allows the application to poll the event queue at regular time intervals to get
    only the events that have "occurred" since the last poll.

    Specifically, the event queue:
    - is instantiable with a list of event objects queried from the database
    - uses the application clock to determine if an event is a past or future event
    - hides future events
    - allows retrieving all unprocessed past events (`getNewEvents()`)
    - allows retrieving all processed past events (`getOldEvents()`)
    """

    logger: Logger
    clock: AppClock
    events: SortedEventList
    next: int  # Index of the next unprocessed event

    def __init__(
        self, logger: Logger, clock: AppClock, events: SortedEventList
    ) -> None:
        self.logger = logger
        self.clock = clock
        self.events = events
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
