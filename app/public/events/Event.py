# STL
from random import randint, choice
from typing import Any, List, TypedDict

# LOCAL
from public.constants import *


class Event(TypedDict):
    """
    See `design.md`.
    """

    time: int
    stateKey: str
    newValue: Any
    message: str


# TODO: implement this
def queryEvents() -> List[Event]:
    """
    Returns all pre-generated events from the database.
    """
    query = "SELECT * FROM PreGeneratedEvent"
    return sorted(
        [
            {
                "time": randint(MIN_APP_TIME, MAX_APP_TIME),
                "stateKey": choice(["x", "y", "z"]),
                "newValue": "value",
                "message": "message",
            }
            for _ in range(50000)
        ],
        key=lambda e: e["time"],
    )
