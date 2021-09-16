# STL
from random import randint
from typing import TypedDict, List, Any

# LOCAL
from public.constants import *


class Event(TypedDict):
    """
    See `design.md`.
    """

    id: int
    time: int
    stateKey: str
    newValue: Any
    message: str


SortedEventList = List[Event]  # List of events sorted in order of increasing time


def queryAllEvents() -> SortedEventList:
    """
    Returns a list of all events from the database
    sorted in order of increasing time.
    """
    # TODO: implement this
    query = "SELECT * FROM event ORDER BY time ASC;"
    return sorted(
        [
            {
                "id": i,
                "time": randint(MIN_APP_TIME, MAX_APP_TIME),
                "stateKey": "",
                "newValue": "",
                "message": "",
            }
            for i in range(50000)
        ],
        key=lambda e: e["time"],
    )
