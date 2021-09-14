# STL
from time import time


class AppClock:
    """
    The app clock represents time in the app's simulation of smart home events.

    It allows running the smart home simulation at different speeds and
    changing speeds at runtime without losing the current place in time.
    """

    appTimeZero: float
    realTimeZero: float
    speedupFactor: float

    def __init__(self, speedupFactor: float) -> None:
        """
        `speedupFactor` is how many times faster app time moves compared to real time.
        """
        self.appTimeZero = 0
        self.realTimeZero = time()
        self.speedupFactor = speedupFactor

    def getSpeedupFactor(self) -> float:
        return self.speedupFactor

    def setSpeedupFactor(self, speedupFactor: float) -> None:
        self.appTimeZero = self.time()
        self.realTimeZero = time()
        self.speedupFactor = speedupFactor

    def time(self) -> float:
        return self.appTimeZero + (time() - self.realTimeZero) * self.speedupFactor
