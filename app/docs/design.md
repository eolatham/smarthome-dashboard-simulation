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
- The backend **processes** all unprocessed past events waiting on the event queue at **each half-minute** in the simulation (according to app time). Processing an event involves:
  - applying its changes to the smart home state
  - sending it to the frontend to be displayed to the user

## In Depth

### Historical Data Generation

We will generate weather and family event data for a 2-month time period and store it in a database.

- The data should be event-based; we should only store entries in the database for events that cause the smart home state to change.
- Each event should include a timestamp and specify how and why the smart home state changed.

### Events

TODO

### Application Runtime Model

#### Application Clock

The app clock represents time in the app's simulation of smart home events.

It allows running the smart home simulation at different speeds and changing speeds at runtime without losing the current place in time.

**Minimum application clock speed:**

```txt
1  real second  =  1  app second
```

**Maximum application clock speed:**

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
- allows retrieving all processed past events (to be [analyzed](#data-analysis))

When the app starts, it queries all events from the database into the event queue, which minimizes the number of queries and subsequently reduces network latency costs.

#### Event Processor

The event processor uses a background scheduler to continuously poll and process occurring events from an event queue.

At every half-minute of app time, the event processor retrieves all unprocessed past events from the event queue and does the following with each one:

- applies its changes to the smart home state
- sends it as a server-sent event (SSE) to the frontend to be displayed

The app facilitates SSE functionality based on [this guide](https://www.velotio.com/engineering-blog/how-to-implement-server-sent-events-using-python-flask-and-react).

**Benefits of SSE:**

- The SSE model is a more efficient alternative to the request model; the request model would require the frontend to constantly send requests (thousands in our case) to the backend for updates, while the SSE model allows the frontend to simply subscribe to a message channel that the backend publishes events to.
- SSEs are less expensive and time-consuming than HTTP requests, so the SSE model allows the app to consume events faster and with more granularity to time.
- With the SSE model, the frontend will only need to send explicit requests to the backend for user actions.

#### Restarting The Simulation

To restart its simulation, the app does the following:

- resets the event queue pointer
- starts/restarts the app clock
- starts the event processor (if it is not already running)

## Questions

- What does the smart home state include?
- How should weather events be represented?
- How should family events be represented?
