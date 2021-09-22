# STL
from random import randint
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


# TODO: implement this with real events from the database
def queryEvents() -> List[Event]:
    """
    Returns all pre-generated events from the database.
    """
    query = "SELECT * FROM PreGeneratedEvent"

    randomTestEvents: List[Event] = [
        {
            "time": MIN_APP_TIME,
            "stateKey": "door",
            "newValue": False,
            "message": "initial value",
        },
        {
            "time": MIN_APP_TIME,
            "stateKey": "window",
            "newValue": False,
            "message": "initial value",
        },
        {
            "time": MIN_APP_TIME,
            "stateKey": "outdoorTemp",
            "newValue": 80,
            "message": "initial value",
        },
        {
            "time": MIN_APP_TIME,
            "stateKey": "thermostatTemp",
            "newValue": 70,
            "message": "initial value",
        },
    ]
    for i in range(10000):  # Door events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME, MAX_APP_TIME),
                "stateKey": "door",
                "newValue": i % 2 == 0,
                "message": "opened" if i % 2 == 0 else "closed",
            }
        )
    for i in range(10000):  # Window events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME, MAX_APP_TIME),
                "stateKey": "window",
                "newValue": i % 2 == 0,
                "message": "opened" if i % 2 == 0 else "closed",
            }
        )
    for _ in range(20000):  # Outdoor temp events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME, MAX_APP_TIME),
                "stateKey": OUTDOOR_TEMP_STATE_KEY,
                "newValue": randint(30, 100),
                "message": "changed",
            }
        )
    for _ in range(20000):  # Thermostat events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME, MAX_APP_TIME),
                "stateKey": THERMOSTAT_TEMP_STATE_KEY,
                "newValue": randint(MIN_THERMOSTAT_TEMP, MAX_THERMOSTAT_TEMP),
                "message": "changed",
            }
        )
    return randomTestEvents
