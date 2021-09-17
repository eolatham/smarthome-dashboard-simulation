# PDM
from flask_sse import sse

# LOCAL
from public.sse.SSEPublisher import SSEPublisher


class TimePublisher(SSEPublisher):
    """
    See `design.md`.
    """

    def publish(self) -> None:
        """
        Publishes the current time and speedup factor of the app clock as a SSE:
        ```
        {
            "time": "<the current app time in seconds>",
            "speed": "<the current speedup factor of the app clock>"
        }
        ```
        """
        with self.app.app_context():
            data = {"time": self.clock.time(), "speed": self.clock.getSpeedupFactor()}
            self.logger.info("Sending SSE with current app time data: %s", data)
            sse.publish(data, type="time")
