# PDM
from typing import List

# LOCAL
from public.sse.SSEPublisher import SSEPublisher


class TimePublisher(SSEPublisher):
    """
    See `design.md`.
    """

    eventTypeString = "time"

    def getObjectsToPublish(self) -> List:
        """
        Returns a singleton list containing an object with
        the current time and speedup factor of the app clock:
        ```
        {
            "time": "<the current app time in seconds>",
            "speed": "<the current speedup factor of the app clock>"
        }
        ```
        """
        return [{"time": self.clock.time(), "speed": self.clock.getSpeedupFactor()}]
