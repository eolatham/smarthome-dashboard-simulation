# Requirements

## Team 3

- Steven Capleton
- Landon Dyken
- Karen Horton
- Eric Latham
- Brittany Latham
- Laura Thompson

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

The user should be able to view utility usage data for:

- the **previous month** (based on the previous month's smart home events)
- the **current month** (based on the current month's smart home events)

The following utility usage information should be displayed:

- the projected water usage (in gallons) and the resulting cost
- the projected electricity usage (in kilowatt-hours) and the resulting cost
- the projected total utility cost (water + electricity)

Costs should be displayed in dollars.
