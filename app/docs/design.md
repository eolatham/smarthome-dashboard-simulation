# Design

## Team 3

- Steven Capleton
- Landon Dyken
- Karen Horton
- Eric Latham
- Brittany Latham
- Laura Thompson

## Overview

Our smart home dashboard simulator is an event-based application that operates according to the following process:

- The database stores generated weather and family **events** that describe when and how the smart home state changed over a 2-month time period.
- The app runs on a **custom clock** to simulate fast-moving time, and the speed of app time is adjustable by the user.
- The backend **queries** all events from the database into an event queue when the app starts.
- The backend **publishes** the current app time **every real second** so that the frontend can display it.
- The backend **publishes** all unprocessed past events waiting on the event queue **every app half-minute** so that the frontend can process them.
- The frontend **manages and displays** all smart home state and **provides an interface** for the user to interact with the dashboard.

### Runtime Model

![diagram](img/runtime_model.png)

## In Depth

### Historical Data Generation

We will generate weather and family event data for a 2-month time period and store it in a database.

- The data should be event-based; we should only store entries in the database for events that cause the smart home state to change. This design is space-efficient and also lends itself well to event-driven/reactive programming.
- Each event should include a timestamp and specify how and why the smart home state changed.

### Smart Home State

TODO

### Events

Events are things that affect smart home state at certain points in app time.

Events are stored in a database table with the following structure:

```sql
CREATE TABLE event
(
    id serial,
    time int,
    stateKey text,
    newValue json,
    message text
);
```

- `id` is the unique identifier of the event (a serial assigned by Postgres)
- `time` is the number of seconds after the start of app time at which the event occurred
- `stateKey` is the key to the value in the smart home state that the event changed
- `newValue` is the new value for `stateKey` in the smart home state after the event
- `message` is a human-readable description of the event to be displayed to the user

Once queried from the database, the app represents events with objects of the following structure:

```json
{
  "id": 0,
  "time": 0,
  "stateKey": "<key>",
  "newValue": "<value>",
  "message": "<message>"
}
```

TODO: is this data model good enough? are there events that change multiple states?

#### Weather Event Examples

TODO

#### Family Event Examples

TODO

### Backend Components

#### Application Clock

The app clock represents time with flexible speed in a bounded timeframe, and it is used to keep time in the app's simulation of smart home events.

The app clock allows:

- running the smart home simulation at different speeds
- changing speeds at runtime without losing the current place in time
- restarting app time from the minimum app time at any point

**Minimum app clock speed:**

```txt
1  real second  =  1  app second
```

**Maximum app clock speed:**

```txt
1   real minute   =  1          app month
60  real seconds  =  2,592,000  app seconds
1   real second   =  43,200     app seconds
```

#### Event Queue

The event queue is a custom queue data structure for storing and retrieving smart home events.

It stores all events provided to it while only allowing past events to be retrieved, which allows the app to poll the event queue at regular time intervals to get only the events that have "occurred" since the last poll.

Specifically, the event queue:

- is instantiable with a list of event objects queried from the database
- uses the app clock to determine if an event is a past or future event
- hides future events
- allows retrieving all unprocessed past events (to be processed)
- allows retrieving all processed past events (to be analyzed)
- allows resetting its pointer to `0` (when restarting the simulation)

When the app starts, it queries all events from the database into the event queue, which minimizes the number of queries and subsequently reduces network latency costs.

#### Event Publisher

The event publisher uses a background scheduler to continuously poll and publish occurring events from the event queue.

At every half-minute of app time, the event publisher retrieves all unprocessed past events from the event queue and sends each one as a server-sent event (SSE) to the frontend to be processed.

The app facilitates SSE functionality based on [this guide](https://www.velotio.com/engineering-blog/how-to-implement-server-sent-events-using-python-flask-and-react).

#### Time Publisher

Using the same technology as the event publisher, the time publisher sends the current app time as a SSE to the frontend to be displayed every real second.

**Benefits of SSE:**

- The SSE model is a more efficient alternative to the request model; the request model would require the frontend to constantly send requests (thousands in our case) to the backend for updates, while the SSE model allows the frontend to simply subscribe to a message channel that the backend publishes events to.
- SSEs are less expensive and time-consuming than HTTP requests, so the SSE model allows the app to consume events faster and with more granularity to time.
- With the SSE model, the frontend will only need to send explicit requests to the backend for user actions.

### Frontend Components

TODO
