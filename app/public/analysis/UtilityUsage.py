# STL
from typing import TypedDict

# LOCAL
from public.events.EventStore import EventStore


class WaterUsage(TypedDict):
    gallons: float
    dollars: float


class ElectricityUsage(TypedDict):
    kilowattHours: float
    dollars: float


class UtilityUsage(TypedDict):
    water: WaterUsage
    electricity: ElectricityUsage
    totalDollars: float


class UtilityUsageResponse(TypedDict):
    previousMonth: UtilityUsage
    currentMonth: UtilityUsage


# TODO: implement this
def calculateUtilityUsage(eventStore: EventStore) -> UtilityUsageResponse:
    pass
