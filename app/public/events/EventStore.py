# STL
from typing import Generator, Set, Dict, Literal, Optional

# LOCAL
from public.constants import *
from public.events.Event import Event


EventType = Literal["pre-generated", "user-generated"]
EventMap = Dict[int, Dict[str, Dict[EventType, Event]]]


class EventStore:
    """
    See `design.md`.
    """

    map: EventMap = {}
    minTime: int
    maxTime: int

    def putEvents(self, eventType: EventType, *events: Event) -> None:
        for event in events:
            time, stateKey = event["time"], event["stateKey"]

            if time < getattr(self, "minTime", float("inf")):
                self.minTime = time
            if time > getattr(self, "maxTime", float("-inf")):
                self.maxTime = time

            if time not in self.map:
                self.map[time] = {}
            if stateKey not in self.map[time]:
                self.map[time][stateKey] = {}

            self.map[time][stateKey][eventType] = event

    def putPreGeneratedEvents(self, *events: Event) -> None:
        self.putEvents("pre-generated", *events)

    def putUserGeneratedEvents(self, *events: Event) -> None:
        self.putEvents("user-generated", *events)

    def clearUserGeneratedEvents(self) -> None:
        for time in range(self.minTime, self.maxTime + 1):
            if time not in self.map:
                continue
            for stateKey in list(self.map[time]):
                self.map[time][stateKey].pop("user-generated", None)

    def yieldEvents(
        self,
        startTime: int = None,
        endTime: int = None,
        stateKeys: Set[str] = None,
        eventType: EventType = None,
    ) -> Generator[Event, None, None]:
        """
        Yields events across the given timeframe that have the given state keys and event type.
        If any parameters are not provided, the associated constaints are simply ignored.
        """

        def getEventFromContainer(container: Dict[EventType, Event]) -> Optional[Event]:
            """
            If `eventType` was provided, returns the event of that type. Otherwise,
            returns either the pre-generated event or the user-generated event, with
            a preference of the user-generated event (because user-generated events take
            precedence over pre-generated events in the smart home simulation).
            """
            if eventType:
                return container.get(eventType)
            return container.get("user-generated") or container.get("pre-generated")

        if not self.map:
            return

        if startTime is None:
            startTime = self.minTime
        if endTime is None:
            endTime = self.maxTime + 1

        for time in range(startTime, endTime):
            if time not in self.map:
                continue
            if stateKeys:
                for stateKey in stateKeys:
                    if stateKey not in self.map[time]:
                        continue
                    event = getEventFromContainer(self.map[time][stateKey])
                    if event:
                        yield event
            else:
                for stateKey in self.map[time]:
                    event = getEventFromContainer(self.map[time][stateKey])
                    if event:
                        yield event

    def yieldPreGeneratedEvents(
        self, startTime: int = None, endTime: int = None, stateKeys: Set[str] = None
    ) -> Generator[Event, None, None]:
        return self.yieldEvents(startTime, endTime, stateKeys, "pre-generated")
