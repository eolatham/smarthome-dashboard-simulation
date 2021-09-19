# STL
from typing import Literal, TypedDict


HVACStatus = Literal["heating", "cooling", "off"]


class DerivedState(TypedDict):
    """
    See `design.md`.
    """

    indoorTempFahrenheit: float
    hvacStatus: HVACStatus
