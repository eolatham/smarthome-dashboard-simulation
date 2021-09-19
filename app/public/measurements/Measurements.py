# STL
from typing import Literal, TypedDict


HVACStatus = Literal["heating", "cooling", "off"]


class WaterUsage(TypedDict):
    gallons: float
    dollars: float


class ElectricityUsage(TypedDict):
    kilowattHours: float
    dollars: float


class UtilityUsage(TypedDict):
    """
    Smart home utility usage measurements in the following form:
    ```
    {
        "water": {"gallons": 0, "dollars": 0},
        "electricity": {"kilowattHours": 0, "dollars": 0}
    }
    ```
    """

    water: WaterUsage
    electricity: ElectricityUsage


class DerivedMeasurements(TypedDict):
    """
    See `design.md`.
    """

    indoorTempFahrenheit: float
    hvacStatus: HVACStatus
    utilityUsagePreviousMonth: UtilityUsage
    utilityUsageCurrentMonth: UtilityUsage
