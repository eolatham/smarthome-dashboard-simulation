# STL
from random import randint
from typing import List, TypedDict, Literal, Union

# LOCAL
from public.constants import (
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
StateKey = Union[IntegerStateKey, BooleanStateKey]


class IntegerEvent(TypedDict):
    """
    An event changing an integer value in smart home state.
    """

    time: int
    stateType: IntegerStateType
    stateKey: IntegerStateKey
    newValue: int
    message: str


class BooleanEvent(TypedDict):
    """
    An event changing a boolean value in smart home state.
    """

    time: int
    stateType: BooleanStateType
    stateKey: BooleanStateKey
    newValue: bool
    message: str


Event = Union[IntegerEvent, BooleanEvent]


def isIntegerEvent(event: Event) -> bool:
    return isinstance(event["newValue"], int)


def isBooleanEvent(event: Event) -> bool:
    return isinstance(event["newValue"], bool)


# TODO: implement this with real events from the database
def queryEvents() -> List[Event]:
    """
    Returns all pre-generated events from the database.
    """
    query = "SELECT * FROM PreGeneratedEvent"

    randomTestEvents: List[Event] = [
        {
            "time": MIN_APP_TIME,
            "stateType": "door",
            "stateKey": "frontDoor",
            "newValue": False,
            "message": "initial value",
        },
        {
            "time": MIN_APP_TIME,
            "stateType": "window",
            "stateKey": "kitchenWindow1",
            "newValue": False,
            "message": "initial value",
        },
        {
            "time": MIN_APP_TIME,
            "stateType": "temp",
            "stateKey": "outdoorTemp",
            "newValue": 80,
            "message": "initial value",
        },
        {
            "time": MIN_APP_TIME,
            "stateType": "temp",
            "stateKey": "thermostatTemp",
            "newValue": 70,
            "message": "initial value",
        },
    ]
    for i in range(10000):  # Door events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME + 1, MAX_APP_TIME),
                "stateType": "door",
                "stateKey": "frontDoor",
                "newValue": i % 2 == 0,
                "message": "opened" if i % 2 == 0 else "closed",
            }
        )
    for i in range(10000):  # Window events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME + 1, MAX_APP_TIME),
                "stateType": "window",
                "stateKey": "kitchenWindow1",
                "newValue": i % 2 == 0,
                "message": "opened" if i % 2 == 0 else "closed",
            }
        )
    for _ in range(20000):  # Outdoor temp events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME + 1, MAX_APP_TIME),
                "stateType": "temp",
                "stateKey": "outdoorTemp",
                "newValue": randint(30, 100),
                "message": "changed",
            }
        )
    for _ in range(20000):  # Thermostat events
        randomTestEvents.append(
            {
                "time": randint(MIN_APP_TIME + 1, MAX_APP_TIME),
                "stateType": "temp",
                "stateKey": "thermostatTemp",
                "newValue": randint(MIN_THERMOSTAT_TEMP, MAX_THERMOSTAT_TEMP),
                "message": "changed",
            }
        )
    return randomTestEvents
