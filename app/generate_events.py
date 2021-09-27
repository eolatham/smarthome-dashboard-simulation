"""
Generate state of home for two months
"""

class PredeterminedState():
    def __init__():
        # See excel

# Send events - smallest increment of change = 30 sec door event

# Questions
# When are lightbulbs and bath exhaust fan on?
# Is there water usage other than showers/washers?
# When are windows open?

# State rules
# Outdoor temp: From weather API
# Doors: 30 sec/event, 16 events/day M-F, 32 events/day S-S
# Fridge: always running
# Microwave: 20 min/day M-F, 30 min/day S-S
# Stove: 15 min/day M-F, 30 min/day S-S
# Oven: 45 min/day M-F, 60 min/day S-S
# LR TV: 4 hrs/day M-F, 8 hrs/day S-S
# Bedroom TV: M-F 2 hrs/day, 4 hrs/day S-S
# Shower: 2/day M-F, 3/day S-S, 25 gal (65% hot, 35 % cold)
# Bath: 2/day M-F, 3/day S-S, 30 gal (65% hot, 35 % cold)
# Dishwasher: 45 min/load, 4 load/week
# Clothes washer: 30 min/load, 4 loads/week
# Clothes dryer: 30 min/load, 4 loads/week

# Approximate Family Schedule M-F
# 5am - adults wake up
# 6am - kids wake up
# 7:30am - adults/kids leave
# 4pm - kids arrive home
# 5:30pm - adults arrive home
# 8:30pm - kids sleep
# 10:30pm - adults sleep

# Events M-F
# 7:15-7:45a - 4 door events
# 3:45-4:15a - 2 door events
# 5:15-5:45a - 2 door events
# 6:00-8:00a - 8 door events

# 5-6a - 5 min microwave event
# 6-7:15a - 5 min microwave event
# 4:15-4:45p - 5 min microwave event
# 4:45-5:15p - 5 min microwave event

# 5:45-7p - 15 min stove event
# 5:45-7p - 45 min oven event

# 4:15-10:00 - 4 hour LR TV event
# 8:00 - 10:30 2 hr BR TV event

# 5:30-6:15a - 15 min shower event
# 6:15-7:00a - 15 min shower event
# 6-7p - 15 min bath event
# 7-8p - 15 min bath event

#Events S-S
# 7a-10p - 30 sec door event x32 (non overlapping)
# 7a-10p - 5 min microwave event x6 (non overlapping)
# 5p-7p - 30 min stove event
# 4p-7p - 60 min oven event

# 7a-10p - 8 hr LR TV event
# 6a-10a - 2 hr BR TV event
# 7p-10p - 2 hr BR TV event

# 6-7a - 15 min shower event
# 7-8a - 15 min shower event
# 11-12p - 15 min shower event
# 12-1p - 15 min bath event
# 6-7p - 15 min bath event
# 7-8p - 15 min bath event

# Any day
# 7-10p (START) - 45 min dishwasher event (4 times/week)
# 7-10p - 60 min wash/dry event (2 times/ M-F)
# 8a-10p - 60 min wash/dry event S-S, x2 (non overlapping)


# Calculation Rules

# Interior temp - +/- 2 deg/hr per 10 deg outside
# +/- 2 deg/hr per 10 deg dif outside per 5 min door is open
# +/- 1 deg/hr/10 deg dif outside per 5 min window open

# HVAC +/- 1 degree for every minute of operation, maintains set temp 
# within 2 degrees, HVAC - 3500 W

# Light bulbs - 60 W, 15 lights, running when?
# Bath fan, 30W, 2 fans, running when?
# Fridge - 150 W, running always
# Microwave - 1100 W, 20 min/day M-F, 30 min/day S-S
# Stove - 3500 W, 15 min/day M-F, 30 min/day S-S
# Oven - 4000 W, 45 min/day M-F, 60 min/day S-S
# LR TV - 636 W, 4 hrs/day M-F, 8 hrs/day S-S
# B TV - 100 W, 2 hrs/day M-F, 4 hrs/day S-S

# Shower: 2/day M-F, 3/day S-S, 25 gal (65% hot, 35 % cold)
# Bath: 2/day M-F, 3/day S-S, 30 gal (65% hot, 35 % cold)

# Dishwasher: 1800 W, 45 mins/load, 4 load/week, 6 gal hot water/load
# Clothes Washer: 500 W, 20 gal/load (85% hot water, 15% cold), 30 min/load, 4 load/week
# Clothes Dryer: 3000 W, 30 min/load, 4 load/week

# Electricity = $0.12 per kWh
# Hot Water Heater - 4500 W, 4 mins to heat 1 gal/water
# Water = $2.52 per 100 cubic feet of water

# Variable Calculations:
# Indoor Temperature/HVAC

# Static Calculations:
# (If desired we could make these slightly less static = e.g. hourly)
# Light bulbs, fans, microwave, stove, oven, TVs, Showers/Baths, Dishwasher, Clothes