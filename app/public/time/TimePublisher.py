# PDM
from typing import TypedDict

# LOCAL
from public.time.AppClock import AppClock
from public.sse.SSEPublisher import SSEPublisher
from public.constants import SIMULATION_START_DATE_TIMESTAMP


class TimeInfo(TypedDict):
    relativeTime: float  # The current app time in seconds
    absoluteTime: str  # The current app time counted from `SIMULATION_START_DATE_TIMESTAMP`
    speed: float  # The current speedup factor of the app clock


class TimePublisher(SSEPublisher):
    """
    An `SSEPublisher` that publishes a `TimeInfo` object as a SSE on an interval.
    """

    sseType = "time"

    # Override
    def job(self) -> None:
        """
        Publishes a `TimeInfo` object as a SSE.
        """
        time = self.clock.time()
        timeInfo = TimeInfo(
            relativeTime=time,
            absoluteTime=AppClock.absoluteTime(SIMULATION_START_DATE_TIMESTAMP, time),
            speed=self.clock.getSpeedupFactor(),
        )
        self.publish(timeInfo)
