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

Given the data provided in specifications, this pseudocode should return semi-randomly generated events based on the following schedule:

### Family Schedule

5am - adults wake up  
6am - kids wake up  
7:30am - adults/kids leave  
4pm - kids arrive home  
5:30pm - adults arrive home  
8:30pm - kids sleep  
10:30pm - adults sleep

#### Events M-F

7:15-7:45a - 4 door events  
3:45-4:15a - 2 door events  
5:15-5:45a - 2 door events  
6:00-8:00a - 8 door events

5-6a - 5 min microwave event  
6-7:15a - 5 min microwave event  
4:15-4:45p - 5 min microwave event  
4:45-5:15p - 5 min microwave event

5:45-7p - 15 min stove event  
5:45-7p - 45 min oven event

4:15-10:00 - 4 hour LR TV event  
8:00 - 10:30 2 hr BR TV event

5:30-6:15a - 15 min shower event  
6:15-7:00a - 15 min shower event  
6-7p - 15 min bath event  
7-8p - 15 min bath event

#### S-S Events

7a-10p - 30 sec door event x32 (non overlapping)  
7a-10p - 5 min microwave event x6 (non overlapping)  
5p-7p - 30 min stove event  
4p-7p - 60 min oven event

7a-10p - 8 hr LR TV event  
6a-10a - 2 hr BR TV event  
7p-10p - 2 hr BR TV event

6-7a - 15 min shower event  
7-8a - 15 min shower event  
11-12p - 15 min shower event  
12-1p - 15 min bath event  
6-7p - 15 min bath event  
7-8p - 15 min bath event

#### Events Any Day

7-10p (START) - 45 min dishwasher event (4 times/week)  
7-10p - 60 min wash/dry event (2 times/ M-F)  
8a-10p - 60 min wash/dry event S-S, x2 (non overlapping)

```txt
Call weather API and get hourly reports for temp
Commit weather data to Integer State table in DB

For every week/604,800 secs:
    Random generate days to dishwash
    Random generate days to clothes wash/dry
    For every day in week/86,400 sec:
        Check if weekday/weekend
        For events listed above (in chronological order):
            Random generate event start time
            Commit 'start' event to DB
            Commit 'stop' event to DB
```

### Questions About Data Generation

Do events in DB need to be in strictly chronological order? (I am assuming its better if this is the case)  
When are lightbulbs and bath exhaust fan on?  
When are windows open?  
Is there water usage other than showers/washers?  
Do we include pre-generated 'set thermostat data'?

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
