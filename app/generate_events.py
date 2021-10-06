"""
Generate state of home for two months

QUESTIONS:
1 Door behavior - Do we want to open/close garage doors when leaving for work/school?
2. Light behavior - Should all lights be on when someone is home/awake?
"""
#STL
import random
import psycopg2
import datetime
from meteostat import Hourly, Point

#LOCAL
from public.constants import TIME_MAP

HUMAN_READABLE_MAP = {
    # This could be done with some sort of regex...
    "bedRoom1OverheadLight": "Bedroom 1 Overhead Light", 
    "bedRoom1Lamp1": "Bedroom 1 Lamp 1", 
    "bedRoom1Lamp2": "Bedroom 1 Lamp 2", 
    "bedRoom1Window1": "Bedroom 1 Window 1",
    "bedRoom1Window2": "Bedroom 1 Window 2", 
    "bedRoom1Tv": "Bedroom 1 TV", 
    "bedRoom2OverheadLight": "Bedroom 2 Overhead Light", 
    "bedRoom2Lamp1": "Bedroom 2 Lamp 1", 
    "bedRoom2Lamp2": "Bedroom 2 Lamp 2", 
    "bedRoom2Window1": "Bedroom 2 Window 1",
    "bedRoom2Window2": "Bedroom 2 Window 2", 
    "bedRoom3OverheadLight": "Bedroom 3 Overhead Light", 
    "bedRoom3Lamp1": "Bedroom 3 Lamp 1", 
    "bedRoom3Lamp2": "Bedroom 3 Lamp 2", 
    "bedRoom3Window1": "Bedroom 3 Window 1", 
    "bedRoom3Window2": "Bedroom 3 Window 2", 
    "bathRoom1OverheadLight": "Bathroom 1 Overhead Light", 
    "bathRoom1ExhaustFan": "Bathroom 1 Exhaust Fan", 
    "bathRoom1Window": "Bathroom 1 Window", 
    "bathRoom1Faucet": "Bathroom 1 Faucet", 
    "bathRoom2OverheadLight": "Bathroom 2 Overhead Light",
    "bathRoom2ExhaustFan": "Bathroom 2 Exhaust Fan", 
    "bathRoom2Window": "Bathroom 2 Window", 
    "bathRoom2Faucet": "Bathroom 2 Faucet", 
    "livingRoomOverheadLight": "Living Room Overhead Light", 
    "livingRoomLamp1": "Living Room Lamp 1",
    "livingRoomLamp2": "Living Room Lamp 2", 
    "livingRoomTv": "Living Room TV", 
    "livingRoomWindow1": "Living Room Window 1",
    "livingRoomWindow2": "Living Room Window 2", 
    "livingRoomWindow3": "Living Room Window 3", 
    "kitchenOverheadLight": "Kitchen Overhead Light",
    "kitchenStove": "Kitchen Stove", 
    "kitchenOven": "Kitchen Oven", 
    "kitchenMicrowave": "Kitchen Microwave", 
    "kitchenRefrigerator": "Kitchen Refrigerator", 
    "kitchenDishWasher": "Kitchen Dishwasher", 
    "kitchenWindow1": "Kitchen Window 1",
    "kitchenWindow2": "Kitchen Window 2", 
    "garageHouseDoor": "Garage House Door", 
    "garageCarDoor1": "Garage Car Door 1", 
    "garageCarDoor2": "Garage Car Door 2", 
    "frontDoor": "Front Door", 
    "backDoor": "Back Door", 
    "clothesWasher": "Clothes Washer", 
    "clothesDryer": "Clothes Dryer",
}

class StateGenerator:
    def __init__(self, db, start, weather_location):
        """
        Define initial state
        """

        """
        self.boolean_state_types = ["door, window", "light", "bedRoomTv",
            "livingRoomTv", "stove", "oven", "microwave",
            "refrigerator", "dishWasher", "shower", "bath",
            "bathExhaustFan", "clothesWasher", "clothesDryer"]
        self.boolean_state_keys = "bedRoom1OverheadLight", "bedRoom1Lamp1", "bedRoom1Lamp2", "bedRoom1Window1",
            "bedRoom1Window2", "bedRoom1Tv", "bedRoom2OverheadLight", "bedRoom2Lamp1", "bedRoom2Lamp2", "bedRoom2Window1",
            "bedRoom2Window2", "bedRoom2OverheadLight", "bedRoom2Lamp1", "bedRoom2Lamp2", "bedRoom2Window1", "bedRoom2Window2", 
            "bathRoom1OverheadLight", "bathRoom1ExhaustFan", "bathRoom1Window", "bathRoom1Faucet", "bathRoom2OverheadLight",
            "bathRoom2ExhaustFan", "bathRoom2Window", "bathRoom2Faucet", "livingRoomOverheadLight", "livingRoomLamp1",
            "livingRoomLamp2", "livingRoomTv", "livingRoomWindow1", "livingRoomWindow2", "livingRoomWindow3", "kitchenOverheadLight",
            "kitchenStove", "kitchenOven", "kitchenMicrowave", "kitchenRefrigerator", "kitchenDishWasher", "kitchenWindow1",
            "kitchenWindow2", "garageHouseDoor", "garageCarDoor1", "garageCarDoor2", "frontDoor", "backDoor", "clothesWasher", "clothesDryer"]
        self.integer_state_types = ["temp"]
        self.integer_state_keys = ["outdoorTemp", "thermostatTemp"]
        """

        self.db = db
        self.weather_location = weather_location

        self.start = start
        #Assert start time is midnight, on monday, and at least 60 days prior:
        if not (start.weekday() == 0 and start.hour == 0 and start.minute == 0 and start.second == 0 and ((start + datetime.timedelta(61)) <= datetime.datetime.today())):
            start_date = datetime.date.today() - datetime.timedelta(days=61)
            week_day = start_date.weekday()
            start_date = start_date - datetime.timedelta(week_day)
            self.start = datetime.datetime(start_date.year, start_date.month, start_date.day)

    def generateInitialState(self):
        """ Generates initial state, assuming t = 0 is a Monday at Midnight"""
        initial_states =[["light", "bedRoom1OverheadLight", False, "Bedroom 1 Overhead Light is OFF"],
                        ["light", "bedRoom1Lamp1", False, "Bedroom 1 Lamp 1 is OFF"],
                        ["light", "bedRoom1Lamp2", False, "Bedroom 1 Lamp 2 is OFF"],
                        ["window", "bedRoom1Window1", False, "Bedroom 1 Window 1 is CLOSED"],
                        ["window", "bedRoom1Window2", False, "Bedroom 1 Window 2 is CLOSED"],
                        ["bedRoomTv", "bedRoom1Tv", False, "Bedroom 1 TV is OFF"],

                        ["light", "bedRoom2OverheadLight", False, "Bedroom 2 Overhead Light is OFF"],
                        ["light", "bedRoom2Lamp1", False, "Bedroom 2 Lamp 1 is OFF"],
                        ["light", "bedRoom2Lamp2", False, "Bedroom 2 Lamp 2 is OFF"],
                        ["window", "bedRoom2Window1", False, "Bedroom 2 Window 1 is CLOSED"],
                        ["window", "bedRoom2Window2", False, "Bedroom 2 Window 2 is CLOSED"],

                        ["light", "bedRoom3OverheadLight", False, "Bedroom 3 Overhead Light is OFF"],
                        ["light", "bedRoom3Lamp1", False, "Bedroom 3 Lamp 1 is OFF"],
                        ["light", "bedRoom3Lamp2", False, "Bedroom 3 Lamp 2 is OFF"],
                        ["window", "bedRoom3Window1", False, "Bedroom 3 Window 1 is CLOSED"],
                        ["window", "bedRoom3Window2", False, "Bedroom 3 Window 2 is CLOSED"],

                        ["light", "bathRoom1OverheadLight", False, "Bathroom 1 Overhead Light is OFF"],
                        ["bathExhaustFan", "bathRoom1ExhaustFan", False, "Bathroom 1 Exhaust Fan is OFF"],
                        ["window", "bathRoom1Window", False, "Bathroom 1 Window is CLOSED"],
                        ["shower", "bathRoom1Faucet", False, "Bathroom 1 Faucet is OFF"], #NOTE THIS IS DIFFERENT THAN BATHROOM FAUCET
                        ["bath", "bathRoom1Bath", False, "Bathroom 1 Faucet is OFF"],

                        ["light", "bathRoom2OverheadLight", False, "Bathroom 2 Overhead Light is OFF"],
                        ["bathExhaustFan", "bathRoom2ExhaustFan", False, "Bathroom 2 Exhaust Fan is OFF"],
                        ["window", "bathRoom2Window", False, "Bathroom 2 Window is CLOSED"],
                        ["shower", "bathRoom2Faucet", False, "Bathroom 2 Faucet is OFF"], #NOTE THIS IS DIFFERENT THAN BATHROOM FAUCET
                        ["bath", "bathRoom2Faucet", False, "Bathroom 2 Faucet is OFF"],

                        ["light", "livingRoomOverheadLight", False, "Living Room Overhead Light is OFF"],
                        ["light", "livingRoomLamp1", False, "Living Room Lamp 1 is OFF"],
                        ["light", "livingRoomLamp2", False, "Living Room Lamp 2 is OFF"],
                        ["window", "livingRoomWindow1", False, "Living Room Window 1 is CLOSED"],
                        ["window", "livingRoomWindow2", False, "Living Room Window 2 is CLOSED"],
                        ["window", "livingRoomWindow3", False, "Living Room Window 2 is CLOSED"],
                        ["livingRoomTv", "livingRoomTv", False, "Living Room TV is OFF"],

                        ["light", "kitchenOverheadLight", False, "Kitchen Overhead Light is OFF"],
                        ["stove", "kitchenStove", False, "Kitchen Stove is OFF"],
                        ["oven", "kitchenOven", False, "Kitchen Oven is OFF"],
                        ["microwave", "kitchenMicrowave", False, "Kitchen Microwave is OFF"],
                        ["refrigerator", "kitchenRefrigerator", True, "Kitchen Refrigerator is ON"],
                        ["dishWasher", "kitchenDishWasher", False, "Kitchen Dishwasher is OFF"],
                        ["window", "kitchenWindow1", False, "Kitchen Window 1 is CLOSED"],
                        ["window", "kitchenWindow2", False, "Kitchen Window 2 is CLOSED"],

                        ["door", "garageCarDoor1", False, "Garage Car Door 1 is CLOSED"],
                        ["door", "garageCarDoor2", False, "Garage Car Door 2 is CLOSED"],
                        ["door", "garageHouseDoor", False, "Garage House Door is CLOSED"],
                        ["door", "frontDoor", False, "Front Door is CLOSED"],
                        ["door", "backDoor", False, "Back Door is CLOSED"],
                        
                        ["clothesWasher", "clothesWasher", False, "Clothes Washer is OFF"],
                        ["clothesDryer", "clothesDryer", False, "Clothes Dryer is OFF"]]
        
        for initial_state in initial_states:
            self.insertEvent("boolean_event", 0, initial_state[0], initial_state[1], initial_state[2], initial_state[3])

        #Integer initial states
        self.insertEvent("integer_event", 0, "temp", "thermostatTemp", 70, "Thermostat is set to 70")

        init_weather_data = Hourly(self.weather_location, self.start, self.start)
        init_weather_data = init_weather_data.fetch()
        temp = int(9/5*init_weather_data.temp[0]) + 32
        self.insertEvent("integer_event", 0, "temp", "outdoorTemp", temp, "Current outdoor temperature is "+str(temp))

    def generateTempEvents(self):
        """ Generate hourly weather data"""
        start = self.start
        end = self.start + datetime.timedelta(60)
        loc = self.weather_location
        try:
            weather_data = Hourly(loc, start, end)
            weather_data = weather_data.fetch()
            for i in range(len(weather_data)):
                temp = int(9/5*weather_data.temp[i]) + 32
                self.insertEvent("integer_event", i*TIME_MAP["hour"], "temp", "outdoorTemp", temp, "The current outdoor temperature is "+str(temp))
        
        except Exception as e:
            print(e)



    def generateDoorEvents(self):
        """Generate Door events throughout the day"""
        #SUS behavior with not opening/closing doors til end of first day
        def doorEvent(t_range_start, t_range_end, num_insert):
            for i in range(num_insert):
                #Randomly pick which door to open
                pick_door = random.random()
                which_door = "frontDoor"
                if pick_door < 0.5:
                    which_door = "backDoor"

                self.createEvent(t_range_start, t_range_end, 30, "door", which_door, ("OPEN", "CLOSED"))

        #Iterate over each day
        for t_day in range(0, 60*TIME_MAP["day"], TIME_MAP["day"]):
            # S-S
            if ((t_day != 0) and (((t_day % TIME_MAP["Saturday"]) == 0 ) or ((t_day % TIME_MAP["Sunday"]) == 0))):
                #7a-10p - 30 sec door event x32 (non overlapping)
                t_range_start = t_day + 7 * TIME_MAP["hour"]
                t_range_end = t_day + 22 * TIME_MAP["hour"]
                doorEvent(t_range_start, t_range_end, 32)

            # M-F
            else:
                #7-7:30a 4x 30 sec door event
                t_morning_start = t_day + 7 * TIME_MAP["hour"] + 15 * TIME_MAP["minute"]
                t_morning_end = t_morning_start + 30 * TIME_MAP["minute"]
                doorEvent(t_morning_start, t_morning_end, 4)

                #3:45-4:15p 2x 30 sec door event
                t_kids_start = t_day + 15 * TIME_MAP["hour"] + 45 * TIME_MAP["minute"]
                t_kids_end = t_kids_start + 30 * TIME_MAP["minute"]
                doorEvent(t_kids_start, t_kids_end, 2)

                #5:15-5:45 2x 30 sec door event
                t_adults_start = t_day + 17 * TIME_MAP["hour"] + 15 * TIME_MAP["minute"]
                t_adults_end = t_adults_start + 30 * TIME_MAP["minute"]
                doorEvent(t_adults_start, t_adults_end, 2)

                #6-8p 8x 30 sec door event
                t_evening_start = t_day + 18 * TIME_MAP["hour"]
                t_evening_end = t_evening_start + 2 * TIME_MAP["hour"]
                doorEvent(t_evening_start, t_evening_end, 8)


    def generateOvenStoveEvents(self):
        """Generate Oven, Stove Events"""
        # Can be decoupled

        #Iterate over each day
        for t_day in range(0, 60*TIME_MAP["day"], TIME_MAP["day"]):
            # S-S
            if ((t_day != 0) and (((t_day % TIME_MAP["Saturday"]) == 0 ) or ((t_day % TIME_MAP["Sunday"]) == 0))):
                #5-7p 30 min stove event
                t_range_start = t_day + 17 * TIME_MAP["hour"]
                t_range_end = t_day + 19 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 30 * TIME_MAP["minute"], "stove", "kitchenStove")

                #4-7p 60 min oven event
                t_range_start = t_day + 16 * TIME_MAP["hour"]
                t_range_end = t_day + 19 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 60 * TIME_MAP["minute"], "oven", "kitchenOven")

            # M-F
            else:
                #5:45-7p 15 min stove event
                t_range_start = t_day + 17 * TIME_MAP["hour"] + 45 * TIME_MAP["minute"]
                t_range_end = t_day + 19 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 15 * TIME_MAP["minute"], "stove", "kitchenStove")

                #5:45-7p 45 min oven event
                t_range_start = t_day + 17 * TIME_MAP["hour"] + 45 * TIME_MAP["minute"]
                t_range_end = t_day + 19 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 45 * TIME_MAP["minute"], "oven", "kitchenOven")


    def generateMicrowaveEvents(self):
        """Generate Microwave Events"""
        #Iterate over each day
        for t_day in range(0, 60*TIME_MAP["day"], TIME_MAP["day"]):
            # S-S 
            if ((t_day != 0) and (((t_day % TIME_MAP["Saturday"]) == 0 ) or ((t_day % TIME_MAP["Sunday"]) == 0))):
                #7a-10p 5 min microwave event X6 
                t_range_start = t_day + 7 * TIME_MAP["hour"]
                t_range_end = t_day + 22 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 5 * TIME_MAP["minute"], "microwave", "kitchenMicrowave", num_insert=6)

            #M-F
            else:
                #5a-6a 5 min microwave event
                t_range_start = t_day + 5 * TIME_MAP["hour"]
                t_range_end = t_day + 6 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 5 * TIME_MAP["minute"], "microwave", "kitchenMicrowave")

                #6-7:15a 5 min microwave event
                t_range_start = t_day + 6 * TIME_MAP["hour"]
                t_range_end = t_day + 7 * TIME_MAP["hour"] + 15 * TIME_MAP["minute"]
                self.createEvent(t_range_start, t_range_end, 5 * TIME_MAP["minute"], "microwave", "kitchenMicrowave")

                #4:15-4:45p 5 min microwave event
                t_range_start = t_day + 16 * TIME_MAP["hour"] + 15 * TIME_MAP["minute"]
                t_range_end = t_day + 16 * TIME_MAP["hour"] + 45 * TIME_MAP["minute"]
                self.createEvent(t_range_start, t_range_end, 5 * TIME_MAP["minute"], "microwave", "kitchenMicrowave")

                #4:45-5:15p 5 min microwave event
                t_range_start = t_day + 16 * TIME_MAP["hour"] + 45 * TIME_MAP["minute"]
                t_range_end = t_day + 17 * TIME_MAP["hour"] + 15 * TIME_MAP["minute"]
                self.createEvent(t_range_start, t_range_end, 5 * TIME_MAP["minute"], "microwave", "kitchenMicrowave")

    def generateTvEvents(self):
        # Can be decoupled
        """Generate Bedroom TV and Living Room TV Events"""
        #Iterate over each day
        for t_day in range(0, 60*TIME_MAP["day"], TIME_MAP["day"]):
            # S-S
            if ((t_day != 0) and (((t_day % TIME_MAP["Saturday"]) == 0 ) or ((t_day % TIME_MAP["Sunday"]) == 0))):
                #7a-10p 8hr LR TV event
                t_range_start = t_day + 7 * TIME_MAP["hour"]
                t_range_end = t_day + 22 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 8 * TIME_MAP["hour"], "livingRoomTv", "livingRoomTv")

                #6a-10a 2hr BR TV event
                t_range_start = t_day + 6 * TIME_MAP["hour"]
                t_range_end = t_day + 10 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 2 * TIME_MAP["hour"], "bedRoomTv", "bedRoom1Tv")

            # M-F
            else:
                #4:45-10p 4hr LR TV event
                t_range_start = t_day + 16 * TIME_MAP["hour"] + 45 * TIME_MAP["minute"]
                t_range_end = t_day + 22 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 4 * TIME_MAP["hour"], "livingRoomTv", "livingRoomTv")

                #7p-10p 2hr BR TV event
                t_range_start = t_day + 19 * TIME_MAP["hour"]
                t_range_end = t_day + 22 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 2 * TIME_MAP["hour"], "bedRoomTv", "bedRoom1Tv")

            #Any Day
            #7p-10p 2hr BR TV event
            t_range_start = t_day + 19 * TIME_MAP["hour"]
            t_range_end = t_day + 22 * TIME_MAP["hour"]
            self.createEvent(t_range_start, t_range_end, 2 * TIME_MAP["hour"], "bedRoomTv", "bedRoom1Tv")
            

    
    def generateShowerBathFanEvents(self):
        # Can be decoupled - ish
        """Generate Shower, Bath, and Bath Exhause Fan Events"""
        fan1 = {
            "state_type": "bathExhaustFan",
            "state_key": "bathRoom1ExhaustFan"
        }
        fan2 = {
            "state_type": "bathExhaustFan",
            "state_key": "bathRoom2ExhaustFan"
        }
        #Iterate over each day
        for t_day in range(0, 60*TIME_MAP["day"], TIME_MAP["day"]):
            # S-S
            if ((t_day != 0) and (((t_day % TIME_MAP["Saturday"]) == 0 ) or ((t_day % TIME_MAP["Sunday"]) == 0))):
                #6-7a 15 min shower event
                t_range_start = t_day + 6 * TIME_MAP["hour"]
                t_range_end = t_day + 7 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 15 * TIME_MAP["minute"], "shower", "bathRoom1Faucet", concurrent_event=fan1)

                #7-8a 15 min shower event
                t_range_start = t_day + 7 * TIME_MAP["hour"]
                t_range_end = t_day + 8 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 15 * TIME_MAP["minute"], "shower", "bathRoom2Faucet", concurrent_event=fan2)

                #11-12p 15 min shower event
                t_range_start = t_day + 11 * TIME_MAP["hour"]
                t_range_end = t_day + 12 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 15 * TIME_MAP["minute"], "shower", "bathRoom1Faucet", concurrent_event=fan1)

                #12-1p 15 min bath event
                t_range_start = t_day + 12 * TIME_MAP["hour"]
                t_range_end = t_day + 13 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 15 * TIME_MAP["minute"], "bath", "bathRoom1Faucet", concurrent_event=fan1)

            # M-F
            else:
                #5:30-6:15a 15 min shower event
                t_range_start = t_day + 5 * TIME_MAP["hour"] + 30 * TIME_MAP["minute"]
                t_range_end = t_day + 6 * TIME_MAP["hour"] + 15 * TIME_MAP["minute"]
                self.createEvent(t_range_start, t_range_end, 15 * TIME_MAP["minute"], "shower", "bathRoom1Faucet", concurrent_event=fan1)

                #6:15-7a 15 min shower event
                t_range_start = t_day + 6 * TIME_MAP["hour"] + 15 * TIME_MAP["minute"]
                t_range_end = t_day + 7 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 15 * TIME_MAP["minute"], "shower", "bathRoom2Faucet", concurrent_event=fan2)

            #Any Day
            #6-7p 15 min bath event
            t_range_start = t_day + 18 * TIME_MAP["hour"]
            t_range_end = t_day + 19 * TIME_MAP["hour"]
            self.createEvent(t_range_start, t_range_end, 15 * TIME_MAP["minute"], "bath", "bathRoom1Faucet", concurrent_event=fan1)

            #7-8p 15 min bath event
            t_range_start = t_day + 19 * TIME_MAP["hour"]
            t_range_end = t_day + 20 * TIME_MAP["hour"]
            self.createEvent(t_range_start, t_range_end, 15 * TIME_MAP["minute"], "bath", "bathRoom2Faucet", concurrent_event=fan2)

    def generateDishwasherEvents(self):
        """Generate Dishwasher Events"""
        # Iterate over each week
        for t_week in range(0, 8 * TIME_MAP["week"], TIME_MAP["week"]):
            run_days = random.sample(range(7), 4)
            # Any 4 days, 7-10p 45 min dishWasher event
            for run_day in run_days:
                t_range_start = t_week + run_day * TIME_MAP["day"] + 19 * TIME_MAP["hour"]
                t_range_end = t_week + run_day * TIME_MAP["day"] + 22 * TIME_MAP["hour"]
                self.createEvent(t_range_start, t_range_end, 45 * TIME_MAP["minute"], "dishWasher", "kitchenDishWasher")

    def generateClothesWasherDryerEvents(self):
        """Generate Clothes Washer and Clothes Dryer Events"""

        dryer = {
            "state_type": "clothesDryer",
            "state_key": "clothesDryer"
        }
        #Iterate over each week
        for t_week in range(0, 8 * TIME_MAP["week"], TIME_MAP["week"]):
            run_days = random.sample(range(7), 4)
            # Any 4 days, 60 min clothes wash/dry event
            for run_day in run_days:
                # 7-10p on weekdays
                if run_day < 5:
                    t_range_start = t_week + run_day * TIME_MAP["day"] + 19 * TIME_MAP["hour"]
                    t_range_end = t_week + run_day * TIME_MAP["day"] + 22 * TIME_MAP["hour"]
                    self.createEvent(t_range_start, t_range_end, 30 * TIME_MAP["minute"], "clothesWasher", "clothesWasher", concurrent_event=dryer)
                # 8a-10p on weekends
                else:
                    t_range_start = t_week + run_day * TIME_MAP["day"] + 8 * TIME_MAP["hour"]
                    t_range_end = t_week + run_day * TIME_MAP["day"] + 22 * TIME_MAP["hour"]
                    self.createEvent(t_range_start, t_range_end, 30 * TIME_MAP["minute"], "clothesWasher", "clothesWasher", concurrent_event=dryer)

    def generateLightEvents(self):
        """Generate Light Events"""
        # This will likely get moved into door events because lights 
        # Are on when family is home and awake
        pass
    
    def generateRefrigeratorEvents(self):
        """Generate Refrigerator Events"""
        #This will be empty
        pass

    def generateWindowEvents(self):
        """Generate Microwave Events"""
        # This will be empty
        pass

    def createEvent(self, t_range_start, t_range_end, duration, state_type, state_key, message=("ON", "OFF"), concurrent_event=None, num_insert=1, table="boolean_event"):
            for i in range(num_insert):
                #Determine time of door events and insert into db
                event_start_t = random.randint(t_range_start, t_range_end - duration)
                event_stop_t = event_start_t + duration

                self.insertEvent(table, event_start_t, state_type, state_key, True, HUMAN_READABLE_MAP[state_key]+" is "+message[0])
                self.insertEvent(table, event_stop_t, state_type, state_key, False, HUMAN_READABLE_MAP[state_key]+" is "+message[1])

                # Handle things that are contingent on other things - lights/bath fans
                if concurrent_event is not None:
                    #Special handler for running clothes dryer 30 mins after washer
                    if concurrent_event["state_type"] == "clothesDryer":
                        event_start_t += 30 * TIME_MAP["minute"]
                        event_stop_t += 30 * TIME_MAP["minute"]

                    self.insertEvent(table, event_start_t, concurrent_event["state_type"], concurrent_event["state_key"], True, HUMAN_READABLE_MAP[concurrent_event["state_key"]]+" is "+message[0])
                    self.insertEvent(table, event_stop_t, concurrent_event["state_type"], concurrent_event["state_key"], False, HUMAN_READABLE_MAP[concurrent_event["state_key"]]+" is "+message[1])
                    

    def insertEvent(self, table, time, state_type, state_key, new_value, message):
        """Insert specified values into database"""

        print([table, str(self.convertToDate(time)), state_type, state_key, new_value, message])

        """
        if table in ["boolean_event", "integer_event"]:
            try:
                self.db.execute((f"INSERT INTO pre_generated_events.{table} "
                                "VALUES (%s, %s, %s, %s, %s) "
                                "ON CONFLICT DO UPDATE"), 
                                time, state_type, state_key, new_value, message)
            except Exception as e:
                print(e)
        else:
            print("Could not insert into table" + table)
        """

    def convertToDate(self, time):
        """Return a datetime object representing the date 'time' seconds after start"""
        return self.start + datetime.timedelta(seconds=time)


def main():

    #conn = psycopg2.connect(dbname="smart_home_simulation", user="username", password="password", host="localhost", port="5432")
    #cur = conn.cursor()

    start_date = datetime.date.today() - datetime.timedelta(61)
    week_day = start_date.weekday()
    start_date = start_date - datetime.timedelta(week_day) #make start day a monday
    start_datetime = datetime.datetime(start_date.year, start_date.month, start_date.day)

    weather_location = Point(33.5186, -86.8104) #Birmingham

    stateGenerator = StateGenerator(None, start_datetime, weather_location)

    stateGenerator.generateTempEvents()
    stateGenerator.generateInitialState()
    stateGenerator.generateDoorEvents()
    stateGenerator.generateOvenStoveEvents()
    stateGenerator.generateTvEvents()
    stateGenerator.generateShowerBathFanEvents()
    stateGenerator.generateMicrowaveEvents()
    stateGenerator.generateDishwasherEvents()
    stateGenerator.generateClothesWasherDryerEvents()
    stateGenerator.generateLightEvents()
    


if __name__ == "__main__":
    main()