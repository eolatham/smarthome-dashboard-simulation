# STL
from typing import Set, Dict, Literal

# LOCAL
from public.events.Event import Event
from public.events.EventStore import EventStore

OpeningType = Literal["door", "window"]


class OpeningTracker:
    """
    Class for tracking the openings of a door or window
    during event-based calculations.
    """

    stateKey: str
    isOpen: bool
    lastOpenTime: int
    totalOpenTime: int

    def __init__(self, firstEvent: Event) -> None:
        self.stateKey = firstEvent["stateKey"]
        self.isOpen = firstEvent["newValue"]
        self.lastOpenTime = firstEvent["time"]
        self.totalOpenTime = 0


class OpeningTrackerMap:
    """
    Class for tracking the openings of many doors or windows
    during event-based calculations.
    """

    map: Dict[str, OpeningTracker]

    def __init__(self, eventStore: EventStore, stateKeys: Set[str]) -> None:
        self.map = {}
        for key in stateKeys:
            self.map[key] = OpeningTracker(eventStore.getFirstEvent(key))

    def getTracker(self, stateKey: str) -> OpeningTracker:
        return self.map[stateKey]

    def getTotalOpenTime(self) -> int:
        return sum(tracker.totalOpenTime for tracker in self.map.values())

    def resetTotalOpenTime(self) -> None:
        for tracker in self.map.values():
            tracker.totalOpenTime = 0
