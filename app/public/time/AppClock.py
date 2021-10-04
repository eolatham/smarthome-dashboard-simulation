# STL
from time import time
from datetime import datetime

# PDM
from typeguard import typechecked


class AppClock:
    """
    A class for representing app time with flexible speed in a bounded timeframe
    that can be used to keep time in a simulation of events.

    This class supports:
    - running time at different speeds
    - changing speeds at runtime without losing the current place in time
    - restarting time from the provided minimum time at any point
    - preventing time from going beyond the provided maximum time
    """

    running: bool
    minTime: float
    maxTime: float
    speedupFactor: float
    appTimeZero: float
    realTimeZero: float

    @typechecked
    def __init__(self, minTime: float, maxTime: float, speedupFactor: float) -> None:
        """
        - `minTime` and `maxTime` are in app seconds.
        - `speedupFactor` is how many times faster app time moves compared to real time.
        """
        self.running = False
        self.minTime = minTime
        self.maxTime = maxTime
        self.speedupFactor = speedupFactor

    def start(self) -> None:
        """
        Starts or restarts the app clock at the provided minimum app time value.
        """
        self.running = True
        self.appTimeZero = self.minTime
        self.realTimeZero = time()

    def time(self) -> float:
        """
        Returns the app clock's current time in app seconds, bounded
        by the provided minimum and maximum app time values.
        """
        realTimePassed = time() - self.realTimeZero
        appTimePassed = realTimePassed * self.speedupFactor
        unboundAppTime = self.appTimeZero + appTimePassed
        return min(unboundAppTime, self.maxTime)

    @staticmethod
    def absoluteTime(fromTime: float, additionalTime: float) -> str:
        """
        Returns a string representing `additionalTime` counted from `fromTime`
        in the following format:
        ```
        12:00:00 AM
        Monday
        Day 1
        ```
        """
        secondsPerDay = 86400
        dayNum = int(additionalTime / secondsPerDay + 1)
        dt = datetime.fromtimestamp(fromTime + additionalTime)
        return dt.strftime(f"%I:%M:%S %p\n%A\nDay {dayNum}")

    def getSpeedupFactor(self) -> float:
        return self.speedupFactor

    def setSpeedupFactor(self, speedupFactor: float) -> None:
        self.appTimeZero = self.time()
        self.realTimeZero = time()
        self.speedupFactor = speedupFactor
