# STL
from time import time

# PDM
from typeguard import typechecked


class AppClock:
    """
    See `design.md`.
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

    def getSpeedupFactor(self) -> float:
        return self.speedupFactor

    def setSpeedupFactor(self, speedupFactor: float) -> None:
        self.appTimeZero = self.time()
        self.realTimeZero = time()
        self.speedupFactor = speedupFactor
