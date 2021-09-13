# LOCAL
from public.event.Event import SortedEventList
from public.clock.AppClock import AppClock


class EventQueue:
    clock: AppClock
    events: SortedEventList
    numEvents: int
    pointer: int  # Index of `events` where all preceding elements have been processed

    def __init__(self, clock: AppClock, events: SortedEventList) -> None:
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
        start = end = self.pointer
        while end < self.numEvents and self.events[end]["time"] < currentAppTime:
            end += 1
        self.pointer = end
        return self.events[start:end]
