# STL
from typing import TypedDict, List


class Event(TypedDict):
    """
    An object representing an event that affects smart home state at a certain point in app time.

    `id` is the unique identifier of the event (a serial assigned by Postgres)
    `time` is the number of seconds after the start app time at which the event occurred.
    """

    id: int
    time: float
    # TODO: add to this


SortedEventList = List[Event]  # List of events sorted in order of increasing time


def queryAllEvents() -> SortedEventList:
    """
    Returns a list of all events from the database
    sorted in order of increasing time.
    """
    # TODO: implement this
    query = "SELECT * FROM event ORDER BY time ASC;"
    return [{"id": 0, "time": 35}, {"id": 1, "time": 65}, {"id": 2, "time": 95}]
