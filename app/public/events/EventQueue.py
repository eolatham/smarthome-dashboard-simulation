# STL
from logging import Logger

# PDM
from typeguard import typechecked

# LOCAL
from public.time.AppClock import AppClock
from public.events.Event import Event, SortedEventList


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
        """
        - `logger`: `Logger` object to be used for internal logging
        - `clock`: `AppClock` to be used for keeping track of app time
        - `events`: list of event objects in order of increasing time to be managed by the queue
        """
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

    def clear(self) -> None:
        """
        Clears all events from and resets the event queue.
        """
        self.events = []
        self.reset()

    def append(self, event: Event) -> None:
        """
        Appends the given event to the end of the event queue if
        the event happens after the queue's current last event.
        Otherwise, raises an exception.
        """
        if len(self.events) == 0:
            self.events.append(event)

        lastEvent = self.events[-1]
        if event["time"] > lastEvent["time"]:
            self.events.append(event)

        raise ValueError(
            f"Cannot append `event` to event queue because its time "
            "is not greater than the queue's current last event"
        )

    def getAllEvents(self) -> SortedEventList:
        """
        Returns all events in the queue.
        """
        return self.events

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
