# Design

## Team 3

- Steven Capleton
- Landon Dyken
- Karen Horton
- Eric Latham
- Brittany Latham
- Laura Thompson

### Historical Data Generation

We need to generate weather and family event data for a 2-month time period and store it in a database.

- The data should be event-based; we should only store entries in the database for events that cause the smart home state to change.
- Each events should include a timestamp and specify how and why the smart home state changed.

### Application Runtime Model

#### Application Clock

TODO

needs to be flexible; speed up application time by a user-adjustable factor

#### Database Query Schedule

The application should query the database for all of the events of the current month at the beginning of each month according to the application clock.

This will minimize the number of queries made and subsequently reduce network latency costs.

#### Event Queue

The application should use a custom queue data structure to store the events retrieved from a monthly event query.

The event queue should store all of the events provided to it while only allowing past events to be popped. This will allow the application to poll the event queue at a regular time interval to get only the events that have "ocurred" since the last poll.

Specifically, the event queue should:

- be instantiatable with a set of event objects queried from the database
- hide future events and prevent them from being popped
- allow popping the next past event individually
- allow popping all past events at once

Note that event queue should use the application clock to determine if an event is a past or future event.

#### Event Queue Polling

Every real second, the application should pop all past events from the event queue and process them.

### Live User Interaction

The user should be able to:

- set the themostat
- turn lights on and off
- open and close windows and doors

Each of these user actions should:

- insert an event into the database
- update the smart home state in memory
- display a visible change in the user interface

### Data Analysis

#### Historical Utility Usage

TODO

#### Projected Utility Usage

The user should be able to view data for projected utility usage amounts and costs **for the current month** based on the events stored in the database for the current month.

The following specific data should be displayed:

- the projected water usage (in gallons) and the resulting cost
- the projected electricity usage (in kilowatt-hours) and the resulting cost
- the projected total utility cost (water + electricity)

Costs should be displayed in dollars.
