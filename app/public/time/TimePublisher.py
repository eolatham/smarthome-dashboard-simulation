# PDM
from typing import TypedDict
from datetime import datetime

# LOCAL
from public.sse.SSEPublisher import SSEPublisher
from public.constants import SIMULATION_START_DATE_TIMESTAMP


class TimeInfo(TypedDict):
    """
    `time` is a string representing the absolute simulation time in the following format:
    ```
    12:00:00 AM
    Monday
    Day 1
    ```

    `speed` is the current simulation speed (the current speedup factor of the app clock).
    """

    time: str
    speed: float


class TimePublisher(SSEPublisher):
    """
    An `SSEPublisher` that publishes a `TimeInfo` object as a SSE on an interval.
    """

    sseType = "time"

    def getAbsoluteSimulationTimeString(self) -> str:
        """
        Returns a string representing the current app time
        counted from  `SIMULATION_START_DATE_TIMESTAMP`
        in the following format:
        ```
        12:00:00 AM
        Monday
        Day 1
        ```
        """
        secondsPerDay = 86400

        fromTime = SIMULATION_START_DATE_TIMESTAMP
        additionalTime = self.clock.time()

        dayNum = int(additionalTime / secondsPerDay + 1)
        dt = datetime.fromtimestamp(fromTime + additionalTime)
        return dt.strftime(f"%I:%M:%S %p\n%A\nDay {dayNum}")

    # Override
    def job(self) -> None:
        """
        Publishes a `TimeInfo` object as a SSE.
        """
        timeInfo = TimeInfo(
            time=self.getAbsoluteSimulationTimeString(),
            speed=self.clock.getSpeedupFactor(),
        )
        self.publish(timeInfo)
