# Requirements

## Team 3

- Steven Capleton
- Landon Dyken
- Karen Horton
- Eric Latham
- Brittany Latham
- Laura Thompson

## Overview

### Smart Home Simulation

The user should be able to:

- watch pre-generated events stream through the smart home dashboard
- restart the simulation by clicking a button or refreshing the page
- change the speed of the simulation

### Live User Interaction

The user should be able to:

- set the thermostat
- turn lights on and off
- open and close windows and doors

Each of these user actions should:

- update the smart home state
- display a visible change in the user interface
- be included in [data analysis](#data-analysis) calculations

### Data Analysis

#### Utility Usage

The user should be able to view utility usage and cost data for:

- the **last day**
- the **last week**
- the **last month**
- the **next month** (projected)

## Application Screens

The following sections illustrate and describe the various screens and components the application should have to satisfy the above general requirements.

### Main Screen

![wireframe](img/screen1_wireframe.png)

#### Interactive Floor Plan

This component should show all of the rooms, doors, windows, and appliances in the smart home.

As the smart home state changes at runtime, the component should indicate:

- what lights are on and off
- what doors are open and closed
- what windows are open and closed

The component should also allow the user to turn specific lights on or off by clicking on them.

#### Thermostat Control

This component should:

- display the current indoor, outdoor, and thermostat temperature values
- allow the user to change the thermostat temperature setting

### Control Screen

![wireframe](img/screen2_wireframe.png)

This screen should contain controls that allow the user to:

- turn each individual light on or off
- open or close each individual door and window

### Analysis Screen

![wireframe](img/screen3_wireframe.png)

#### Utility Usage Graph

This component should display a live-updated utility usage graph that includes the following data:

- the **water usage** trend from the start of the simulation to now
- the **power usage** trend from the start of the simulation to now
- the **total utilities cost** trend from the start of the simulation to now

#### Utility Usage Table

This component should display a table like the following:

|                        | Water Usage | Power Usage | Total Cost |
| ---------------------- | ----------- | ----------- | ---------- |
| Last Day               | x           | x           | x          |
| Last Week              | x           | x           | x          |
| Last Month             | x           | x           | x          |
| Next Month (Projected) | x           | x           | x          |

### All Screens

#### Menu Bar

All screens should include a menu bar at the top that contains the following:

- links to all application screens so that the user can switch between them
- a button to restart the simulation
- a simulation speed control component that allows the user to speed up or slow down the simulation
