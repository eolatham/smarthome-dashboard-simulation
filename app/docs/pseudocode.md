# Pseudocode

## Team 3

- Steven Capleton
- Landon Dyken
- Karen Horton
- Eric Latham
- Brittany Latham
- Laura Thompson

## Pre-Generated Events

The following pseudocode describes the process for generating pre-generated events before the app runs:

```txt

```

## Indoor Temperature & Utility Usage

The following pseudocode describes the app's process for calculating and publishing the indoor temperature and utility usage of the smart home during the simulation:

```txt
at every thirty minutes of app time:

    if previousIndoorTemp exists:
        indoorTemp = previousIndoorTemp
    else:
        indoorTemp = thermostatTemp

    electricityUsage = 0
    waterUsage = 0

    booleanStateTrackerMap = empty map for tracking total time True and utility usage for boolean state keys

    for each event that occurred since the last calculation:

        if event is a boolean state event:

            if event changes state from True to False (closing or turning off):
                - mark booleanStateTrackerMap entry as closed/off
                - add time open/on to booleanStateTrackerMap entry

            else if event changes state from False to True (opening or turning on):
                - mark booleanStateTrackerMap entry as open/on
                - record event time in booleanStateTrackerMap

        else (event is an integer event changing outdoorTemp or thermostatTemp):

            totalOpenDoorTime = sum of door entries from booleanStateTrackerMap
            totalOpenWindowTime = sum of window entries from booleanStateTrackerMap

            - based on indoorTemp, outdoorTemp, thermostatTemp, totalOpenDoorTime, and totalOpenWindowTime,
              calculate new indoorTemp and the amount of electricity HVAC used to regulate indoorTemp
              since the last calculation

            - add the amount of electricity HVAC used to regulate indoorTemp since the last calculation
              to electricityUsage

            - reset door entries in booleanStateTrackerMap
            - reset window entries in booleanStateTrackerMap

    - add sum of all electricity usage from booleanStateTrackerMap to electricityUsage
    - add sum of all water usage from booleanStateTrackerMap to waterUsage

    electricityCost = cost calculated for electricityUsage
    waterCost = cost calculated for waterUsage
    totalUtilitiesCost = electricityCost + waterCost

    publish indoorTemp, electricityUsage, electricityCost, waterUsage, waterCost, and totalUtilitiesCost
```
