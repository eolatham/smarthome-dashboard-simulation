# STL
from random import randint
from typing import List, TypedDict, Literal, Union

# PDM
import psycopg2
from psycopg2.extras import RealDictCursor

# LOCAL
from public.constants import (
    POSTGRES_URL,
    MIN_APP_TIME,
    MAX_APP_TIME,
    MIN_THERMOSTAT_TEMP,
    MAX_THERMOSTAT_TEMP,
)

IntegerStateType = Literal["temp"]
BooleanStateType = Literal[
    "door",
    "window",
    "light",
    "bedRoomTv",
    "livingRoomTv",
    "stove",
    "oven",
    "microwave",
    "refrigerator",
    "dishWasher",
    "shower",
    "bath",
    "bathExhaustFan",
    "clothesWasher",
    "clothesDryer",
]
UserGeneratedBooleanStateType = Literal["door", "window", "light"]
StateType = Union[IntegerStateType, BooleanStateType]

IntegerStateKey = Literal["outdoorTemp", "thermostatTemp"]
BooleanStateKey = Literal[
    "bedRoom1OverheadLight",
    "bedRoom1Lamp1",
    "bedRoom1Lamp2",
    "bedRoom1Window1",
    "bedRoom1Window2",
    "bedRoom1Tv",
    "bedRoom2OverheadLight",
    "bedRoom2Lamp1",
    "bedRoom2Lamp2",
    "bedRoom2Window1",
    "bedRoom2Window2",
    "bedRoom3OverheadLight",
    "bedRoom3Lamp1",
    "bedRoom3Lamp2",
    "bedRoom3Window1",
    "bedRoom3Window2",
    "bathRoom1OverheadLight",
    "bathRoom1ExhaustFan",
    "bathRoom1Window",
    "bathRoom1Faucet",
    "bathRoom2OverheadLight",
    "bathRoom2ExhaustFan",
    "bathRoom2Window",
    "bathRoom2Faucet",
    "clothesWasher",
    "clothesDryer",
    "frontDoor",
    "backDoor",
    "garageHouseDoor",
    "garageCarDoor1",
    "garageCarDoor2",
    "livingRoomOverheadLight",
    "livingRoomLamp1",
    "livingRoomLamp2",
    "livingRoomTv",
    "livingRoomWindow1",
    "livingRoomWindow2",
    "livingRoomWindow3",
    "kitchenOverheadLight",
    "kitchenStove",
    "kitchenOven",
    "kitchenMicrowave",
    "kitchenRefrigerator",
    "kitchenDishWasher",
    "kitchenWindow1",
    "kitchenWindow2",
]
UserGeneratedBooleanStateKey = Literal[
    "bedRoom1OverheadLight",
    "bedRoom1Lamp1",
    "bedRoom1Lamp2",
    "bedRoom1Window1",
    "bedRoom1Window2",
    "bedRoom2OverheadLight",
    "bedRoom2Lamp1",
    "bedRoom2Lamp2",
    "bedRoom2Window1",
    "bedRoom2Window2",
    "bedRoom3OverheadLight",
    "bedRoom3Lamp1",
    "bedRoom3Lamp2",
    "bedRoom3Window1",
    "bedRoom3Window2",
    "bathRoom1OverheadLight",
    "bathRoom1Window",
    "bathRoom2OverheadLight",
    "bathRoom2Window",
    "frontDoor",
    "backDoor",
    "garageHouseDoor",
    "garageCarDoor1",
    "garageCarDoor2",
    "livingRoomOverheadLight",
    "livingRoomLamp1",
    "livingRoomLamp2",
    "livingRoomWindow1",
    "livingRoomWindow2",
    "livingRoomWindow3",
    "kitchenOverheadLight",
    "kitchenWindow1",
    "kitchenWindow2",
]
StateKey = Union[IntegerStateKey, BooleanStateKey]


class IntegerEvent(TypedDict):
    """
    An event changing an integer value in smart home state.
    """

    time: int
    state_type: IntegerStateType
    state_key: IntegerStateKey
    new_value: int
    message: str


class BooleanEvent(TypedDict):
    """
    An event changing a boolean value in smart home state.
    """

    time: int
    state_type: BooleanStateType
    state_key: BooleanStateKey
    new_value: bool
    message: str


class UserGeneratedThermostatEvent(TypedDict):
    """
    A user-generated event changing the thermostat
    temperature value in smart home state.
    """

    time: int
    state_type: Literal["temp"]
    state_key: Literal["thermostatTemp"]
    new_value: int
    message: str


class UserGeneratedBooleanEvent(TypedDict):
    """
    A user-generated event changing a user-changeable
    boolean value in smart home state.
    """

    time: int
    state_type: UserGeneratedBooleanStateType
    state_key: UserGeneratedBooleanStateKey
    new_value: bool
    message: str


UserGeneratedEvent = Union[UserGeneratedThermostatEvent, UserGeneratedBooleanEvent]

Event = Union[IntegerEvent, BooleanEvent, UserGeneratedEvent]


def isIntegerEvent(event: Event) -> bool:
    return isinstance(event["new_value"], int)


def isBooleanEvent(event: Event) -> bool:
    return isinstance(event["new_value"], bool)


def isThermostatEvent(event: Event) -> bool:
    return event["state_key"] == "thermostatTemp"


def queryEvents() -> List[Event]:
    """
    Returns all pre-generated events from the database.
    """
    events: List[Event] = []
    with psycopg2.connect(dsn=POSTGRES_URL) as con:
        with con.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM pre_generated_events.integer_event")
            events.extend([IntegerEvent(**e) for e in cur.fetchall()])
            cur.execute("SELECT * FROM pre_generated_events.boolean_event")
            events.extend([BooleanEvent(**e) for e in cur.fetchall()])
    return events


def testEvents() -> List[Event]:
    """
    Returns random events to test with (in the absence of a database).
    """
    randomTestEvents: List[Event] = [
        {
            "time": MIN_APP_TIME,
            "state_type": "door",
            "state_key": "frontDoor",
            "new_value": False,
            "message": "initial value",
        },
        {
            "time": MIN_APP_TIME,
            "state_type": "window",
            "state_key": "kitchenWindow1",
            "new_value": False,
            "message": "initial value",
        },
        {
            "time": MIN_APP_TIME,
            "state_type": "temp",
            "state_key": "outdoorTemp",
            "new_value": 80,
            "message": "initial value",
        },
        {
            "time": MIN_APP_TIME,
            "state_type": "temp",
            "state_key": "thermostatTemp",
            "new_value": 70,
            "message": "initial value",
        },
    ]
    for i in range(10000):  # Door events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME + 1, MAX_APP_TIME),
                "state_type": "door",
                "state_key": "frontDoor",
                "new_value": i % 2 == 0,
                "message": "opened" if i % 2 == 0 else "closed",
            }
        )
    for i in range(10000):  # Window events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME + 1, MAX_APP_TIME),
                "state_type": "window",
                "state_key": "kitchenWindow1",
                "new_value": i % 2 == 0,
                "message": "opened" if i % 2 == 0 else "closed",
            }
        )
    for _ in range(20000):  # Outdoor temp events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME + 1, MAX_APP_TIME),
                "state_type": "temp",
                "state_key": "outdoorTemp",
                "new_value": randint(30, 100),
                "message": "changed",
            }
        )
    for _ in range(20000):  # Thermostat events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME + 1, MAX_APP_TIME),
                "state_type": "temp",
                "state_key": "thermostatTemp",
                "new_value": randint(MIN_THERMOSTAT_TEMP, MAX_THERMOSTAT_TEMP),
                "message": "changed",
            }
        )
    return randomTestEvents
