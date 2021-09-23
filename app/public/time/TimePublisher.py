# PDM
from typing import TypedDict

# LOCAL
from public.sse.SSEPublisher import SSEPublisher


class TimeInfo(TypedDict):
    time: float  # The current app time in seconds
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
        timeInfo = TimeInfo(time=self.clock.time(), speed=self.clock.getSpeedupFactor())
        self.publish(timeInfo)
