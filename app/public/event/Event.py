# STL
from typing import TypedDict, List


class Event(TypedDict):
    time: float  # Seconds since the start of app time


SortedEventList = List[Event]  # List of events sorted in order of increasing time
