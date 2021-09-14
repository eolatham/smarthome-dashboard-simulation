# STL
from time import time


class AppClock:
    startTime: float  # Beginning of simulated app time in seconds since the Epoch
    speedupFactor: float  # How many times faster app time moves compared to real time

    def __init__(self, startTime: float, speedupFactor: float) -> None:
        self.startTime = startTime
        self.speedupFactor = speedupFactor

    def setSpeedupFactor(self, speedupFactor: float) -> None:
        self.startTime = self.time()
        self.speedupFactor = speedupFactor

    def time(self) -> float:
        return self.startTime + (time() - self.startTime) * self.speedupFactor
