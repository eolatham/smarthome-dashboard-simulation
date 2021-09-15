# STL
from time import time


class AppClock:
    """
    The app clock represents time in the app's simulation of smart home events.

    The app clock allows running the smart home simulation at different speeds
    and changing speeds at runtime without losing the current place in time.
    """

    running: bool
    startTime: float
    speedupFactor: float
    appTimeZero: float
    realTimeZero: float

    def __init__(self, startTime: float, speedupFactor: float) -> None:
        """
        - `startTime` is in app seconds.
        - `speedupFactor` is how many times faster app time moves compared to real time.
        """
        self.running = False
        self.startTime = startTime
        self.speedupFactor = speedupFactor

    def start(self) -> None:
        """
        Starts or restarts the app clock at the provided start time.
        """
        self.running = True
        self.appTimeZero = self.startTime
        self.realTimeZero = time()

    def getSpeedupFactor(self) -> float:
        return self.speedupFactor

    def setSpeedupFactor(self, speedupFactor: float) -> None:
        self.appTimeZero = self.time()
        self.realTimeZero = time()
        self.speedupFactor = speedupFactor

    def time(self) -> float:
        realTimePassed = time() - self.realTimeZero
        appTimePassed = realTimePassed * self.speedupFactor
        return self.appTimeZero + appTimePassed
