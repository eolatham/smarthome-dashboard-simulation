# STL
from typing import List

# LOCAL
from public.sse.SSEPublisher import SSEPublisher


class MeasurementsPublisher(SSEPublisher):
    """
    See `design.md`.
    """

    eventTypeString: str = "measurements"

    # TODO: implement this
    def getObjectsToPublish(self) -> List:
        return []
