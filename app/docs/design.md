# Design

## Team 3

- Steven Capleton
- Landon Dyken
- Karen Horton
- Eric Latham
- Brittany Latham
- Laura Thompson

## Questions

### Backend

- How can we calculate derived state and utility usage?

### Frontend

- What React libraries and other tools should we use to make the user interface?
- What are all the attributes of smart home state?
- What other components should be added?

### Data Generation

- How should pre-generated events be made?

## High-Level Runtime Model

Our smart home dashboard simulator is an event-based application that operates according to the following runtime model:

![diagram](img/runtime_model.png)

## Smart Home State

TODO

### Derived State

Derived state is smart home state that is calculated based on the effects of smart home events over time.

Although the backend treats derived state differently (because it has to calculate it), the frontend treats derived state as a normal part of the overall smart home state.

#### Indoor Temperature

Indoor temperature is the temperature inside the smart home measured in Fahrenheit.

It is affected by:

- the outdoor temperature
- the opening and closing of doors and windows

#### HVAC Status

HVAC status tells whether the smart home's HVAC system is _off_, _heating_, or _cooling_.

It is affected by:

- the thermostat setting
- the indoor temperature

## Utility Usage

Utility usage is calculated based on smart home events over a period of time that consume water and/or electricity.

## Events

An event is an object representing a change in smart home state at a certain point in time.

### Event Attributes

- `time` is the number of seconds after the start of app time at which the event occurred
- `stateKey` is the key to the value in the smart home state that the event changed
- `newValue` is the new value for `stateKey` in the smart home state after the event
- `message` is a human-readable description of the event to be displayed to the user

### Pre-Generated Events

Pre-generated events are the backbone of the smart home simulation. They:

- are generated ahead of time (before the app runs)
- are uniquely identifiable by `time` and `stateKey`
- are based on the provided family schedule and downloaded weather data
- define the base smart home state over a 2-month time period

### User-Generated Events

User-generated events are events triggered by the user and created at runtime. They:

- are stored with pre-generated events on the backend
- are included in calculations of derived state and utility usage
- take precedence over pre-generated events during calculations when there is a conflict by `time` and `stateKey`

## Database Design

The database is only used for storing **pre-generated events**, and it does so using a table with the following structure:

```sql
CREATE TABLE PreGeneratedEvent
(
    time int,
    stateKey text,
    newValue json,
    message text,
    PRIMARY KEY (time, stateKey)
);
```

This design is space-efficient and also lends itself well to event-driven/reactive programming.

## Backend Design

### Important Concepts

#### Server-Sent Events

Server-sent events (SSE) provide an efficient and scalable alternative to traditional request models.

SSE can be leveraged to effectively "stream" events from the server to the client in many different contexts, which goes along with other reactive programming techniques.

The app facilitates SSE functionality based on [this guide](https://www.velotio.com/engineering-blog/how-to-implement-server-sent-events-using-python-flask-and-react).

##### Benefits

- The SSE model is a more efficient alternative to the request model; the request model would require the frontend to constantly send requests (thousands in our case) to the backend for updates, while the SSE model allows the frontend to simply subscribe to a message channel that the backend publishes events to.
- SSEs are less expensive and time-consuming than HTTP requests, so the SSE model allows the app to consume events faster and with more granularity to time.
- With the SSE model, the frontend will only need to send explicit requests to the backend for user actions.

### Classes

#### `AppClock`

The app clock represents time with flexible speed in a bounded (2-month) timeframe, and it is used to keep time in the app's simulation of smart home events.

The app clock allows:

- running the smart home simulation at different speeds
- changing speeds at runtime without losing the current place in time
- restarting app time from the minimum app time at any point

##### Minimum Speed

```txt
1  real second  =  1  app second
```

##### Maximum Speed

```txt
1   real second   =  1     app hour
1   real second   =  3600  app seconds
```

#### `EventStore`

The event store is an object that wraps an [EventMap](#eventmap) storing all events during the smart home simulation.

The event store supports:

- efficiently inserting pre-generated events at simulation start
- efficiently inserting user-generated events at runtime
- efficiently removing user-generated events at simulation restart
- efficiently iterating over specific groups of events filtered by `time`, `stateKey`, and event type ([pre-generated](#pre-generated-events) or [user-generated](#user-generated-events))

#### `EventMap`

`EventMap` is a custom map data structure designed for storing events and supporting efficient insertions and retrievals.

`EventMap` indexes events by `time`, `stateKey`, and event type:

```python
{
    0: {
        "stateKey0": {
            "pre-generated": <unique event>,
            "user-generated": <unique event>
        },
        "stateKey1": {
            "pre-generated": <unique event>,
            "user-generated": <unique event>
        },
        ...
    },
    1: {
        "stateKey2": {
            "pre-generated": <unique event>,
            "user-generated": <unique event>
        },
        "stateKey3": {
            "pre-generated": <unique event>,
            "user-generated": <unique event>
        },
        ...
    },
    ...
}
```

This structure allows:

- inserting events in `O(1)` time
- retrieving events in `O(1)` time
- removing events in `O(1)` time

Retrieving and removing many events at once both require iterating over app time, which results in `O(1)` time complexity as well because app time is bounded by constants in the smart home simulation.

#### `SSEPublisher`

`SSEPublisher` is an abstract base class providing common functionality for the Flask-Redis SSE publishers used in the app.

It supports running a background job (in a background scheduler using a daemon thread) on an interval of real time or app time to publish objects as SSEs from a SSE-compatible Flask app.

Implementing classes just need to set the `sseType` attribute and implement the `job()` method.

#### `TimePublisher`

Inheriting from [SSEPublisher](#ssepublisher), the time publisher sends the **current app time** as a SSE to the frontend to be displayed **every real second**.

#### `EventPublisher`

Inheriting from [SSEPublisher](#ssepublisher), the event publisher sends all **unprocessed past events** from the event store as SSEs to the frontend to be processed at **every half-minute of app time**.

##### [EventStore](#eventstore) Strategy

Iterate over time from the last time the publish job was done to the current time to publish all present pre-generated events in that time period.

#### `DerivedStatePublisher`

Inheriting from [SSEPublisher](#ssepublisher), the derived state publisher calculates and sends **derived state** as a SSE to the frontend to be displayed at **every hour of app time**.

##### [EventStore](#eventstore) Strategy

Iterate over time from the last time the publish job was done to the current time to calculate derived state values from the present pre-generated and user-generated events in that time period, then publish the final derived state values.

## Frontend Design

### Important Concepts

TODO

### Components

#### `AppClock`

TODO

#### `SmartHome`

TODO
