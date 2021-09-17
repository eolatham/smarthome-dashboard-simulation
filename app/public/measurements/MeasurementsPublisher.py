# PDM
from flask_sse import sse

# LOCAL
from public.sse.SSEPublisher import SSEPublisher


# TODO: implement this
class MeasurementsPublisher(SSEPublisher):
    """
    See `design.md`.
    """

    def publish(self) -> None:
        """
        Publishes a collection of derived measurements as a SSE:
        ```
        {
            TODO: write this
        }
        ```
        """
        # TODO: implement this
