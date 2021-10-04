"""
Generate state of home for two months

QUESTIONS:
bathRoomfaucet - Should we instead have bathRoom1Bath and bathRoom1Shower to match state_types
garageCarDoor1,2, and garageHouseDoor - when do these get used?
Is it reasonable to assert that the project starts Monday, midnight, at least 60 days prior?
How to avoid overlap with door events?
"""
import random
import psycopg2
import datetime
from meteostat import Hourly, Point


TIME_MAP = {
    #Assumes 0 = Midnight on Monday
    "minute": 60,
    "hour": 3600,
    "day": 86400,
    "week": 604800,
    "month": 2592000, #Assumes 30 days
    "Tuesday": 86400,
    "Wednesday": 172800,
    "Thursday": 259200,
    "Friday": 345600,
    "Saturday": 432000,
    "Sunday": 518400,
}

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
    "bathRoom1Bath": "Bathroom 1 Bath", 
    "bathRoom1Shower": "Bathroom 1 Shower", 
    "bathRoom2OverheadLight": "Bathroom 2 Overhead Light",
    "bathRoom2ExhaustFan": "Bathroom 2 Exhaust Fan", 
    "bathRoom2Window": "Bathroom 2 Window", 
    "bathRoom2Bath": "Bathroom 2 Bath", 
    "bathRoom2Shower": "Bathroom 2 Shower",
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
            start_date = datetime.date.today() - datetime.timedelta(61)
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
                        ["shower", "bathRoom1Shower", False, "Bathroom 1 Shower is OFF"], #NOTE THIS IS DIFFERENT THAN BATHROOM FAUCET
                        ["bath", "bathRoom1Bath", False, "Bathroom 1 Bath is OFF"],

                        ["light", "bathRoom2OverheadLight", False, "Bathroom 2 Overhead Light is OFF"],
                        ["bathExhaustFan", "bathRoom2ExhaustFan", False, "Bathroom 2 Exhaust Fan is OFF"],
                        ["window", "bathRoom2Window", False, "Bathroom 2 Window is CLOSED"],
                        ["shower", "bathRoom2Shower", False, "Bathroom 2 Shower is OFF"], #NOTE THIS IS DIFFERENT THAN BATHROOM FAUCET
                        ["bath", "bathRoom2Bath", False, "Bathroom 2 Bath is OFF"],

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
                        ["door", "backDoor", False, "Back Door is CLOSED"]]
        
        for initial_state in initial_states:
            print(initial_state)
            #self.insertEvent("boolean_event", 0, initial_state[0], initial_state[1], initial_state[2], initial_state[3])

        #Integer initial states
        #self.insertEvent("integer_event", 0, "temp", "thermostatTemp", 70, "Thermostat is set to 70")
        print(["integer_event", 0, "temp", "thermostatTemp", 70, "Thermostat is set to 70"])

        init_weather_data = Hourly(self.weather_location, self.start, self.start)
        init_weather_data = init_weather_data.fetch()
        temp = int(9/5*init_weather_data.temp[0]) + 32
        #self.insertEvent("integer_event", 0, "temp", "outdoorTemp", temp, "Current outdoor temperature is "+str(temp))
        print(["integer_event", 0, "temp", "outdoorTemp", temp, "Current outdoor temperature is "+str(temp)])

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
                #self.insertEvent("integer_event", i*TIME_MAP["hour"], "temp", "outdoorTemp", temp, "The current outdoor temperature is "+str(temp)))
                weather_vals = ["integer_event", i*TIME_MAP["hour"], "temp", "outdoorTemp", temp, "The current outdoor temperature is "+str(temp)]
                print(weather_vals)
        
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
            if ((t_day % TIME_MAP["Saturday"]) == 0 ) or ((t_day % TIME_MAP["Sunday"]) == 0):
                #7a-10p - 30 sec door event x32 (non overlapping)
                t_range_start = t_day + 7 * TIME_MAP["hour"]
                t_range_end = t_day + 22 * TIME_MAP["hour"]
                doorEvent(t_range_start, t_range_end, 32)

                t_day = t_day + TIME_MAP["day"] #Increment by a day

            # M-F
            else:
                t_morning_start = t_day + 7 * TIME_MAP["hour"] + 15 * TIME_MAP["minute"]
                t_morning_end = t_morning_start + 30 * TIME_MAP["minute"]
                doorEvent(t_range_start, t_range_end, 4)

                t_kids_start = t_day + 15 * TIME_MAP["hour"] + 45 * TIME_MAP["minute"]
                t_kids_end = t_kids_start + 30 * TIME_MAP["minute"]
                doorEvent(t_range_start, t_range_end, 2)

                t_adults_start = t_day + 17 * TIME_MAP["hour"] + 15 * TIME_MAP["minute"]
                t_adults_end = t_adults_start + 30 * TIME_MAP["minute"]
                doorEvent(t_range_start, t_range_end, 2)

                t_evening_start = t_day + 18 * TIME_MAP["hour"]
                t_evening_end = t_evening_start + 2 * TIME_MAP["hour"]
                doorEvent(t_range_start, t_range_end, 8)

                t_day = t_day + TIME_MAP["day"] #Increment by a day


    def generateOvenStoveEvents(self):
        """Generate Oven, Stove Events"""
        # Can be decoupled

        #Iterate over each day
        for t_day in range(0, 60*TIME_MAP["day"], TIME_MAP["day"]):
        # S-S
            if ((t_day % TIME_MAP["Saturday"]) == 0 ) or ((t_day % TIME_MAP["Sunday"]) == 0):
                #7a-10p - 30 sec door event x32 (non overlapping)
                t_range_start = t_day + 7 * TIME_MAP["hour"]
                t_range_end = t_day + 22 * TIME_MAP["hour"]
                doorEvent(t_range_start, t_range_end, 32)

                t_day = t_day + TIME_MAP["day"] #Increment by a day

            # M-F
            else:


        pass

    def generateMicrowaveEvents(self):
        """Generate Microwave Events"""

    def generateTvEvents(self):
        # Can be decoupled
        """Generate Bedroom TV and Living Room TV Events"""
        pass

    def generateWindowEvents(self):
        """Generate Microwave Events"""
        # This will be empty
        pass

    def generateShowerBathFanEvents(self):
        # Can be decoupled - ish
        """Generate Shower, Bath, and Bath Exhause Fan Events"""
        pass

    def generateDishwasherEvents(self):
        """Generate Dishwasher Events"""
        pass

    def generateClothesWasherDryerEvents(self):
        """Generate Clothes Washer and Clothes Dryer Events"""
        pass
    
    def generateRefrigeratorEvents(self):
        """Generate Refrigerator Events"""
        #This will be empty
        pass

    def generateLightEvents(self):
        """Generate Light Events"""
        # This will likely get moved into door events because lights 
        # Are on when family is home and awake
        pass

    def createEvent(self, t_range_start, t_range_end, duration, state_type, state_key, message=("ON", "OFF"), num_insert=1, table="boolean_event"):
            for i in range(num_insert):
                #Determine time of door events and insert into db
                event_start_t = random.randint(t_range_start, t_range_end - duration)
                event_stop_t = event_start_t + duration

                #self.insertEvent(table, event_start_t, state_type, state_key, True, HUMAN_READABLE_MAP[state_key]+" is "+message[0])
                #self.insertEvent(table, event_stop_t, state_type, state_key, False, HUMAN_READABLE_MAP[state_key]+" is "+message[1])
                print([table, event_start_t, state_type, state_key, True, HUMAN_READABLE_MAP[state_key]+" is "+message[0]])
                print([table, event_stop_t, state_type, state_key, False, HUMAN_READABLE_MAP[state_key]+" is "+message[1]])        

    def insertEvent(self, table, time, state_type, state_key, new_value, message):
        """Insert specified values into database"""
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


def main():

    #conn = psycopg2.connect(dbname="smart_home_simulation", user="username", password="password", host="localhost", port="5432")
    #cur = conn.cursor()

    start_date = datetime.date.today() - datetime.timedelta(61)
    week_day = start_date.weekday()
    start_date = start_date - datetime.timedelta(week_day) #make start day a monday
    start_datetime = datetime.datetime(start_date.year, start_date.month, start_date.day)

    weather_location = Point(33.5186, -86.8104) #Birmingham

    stateGenerator = StateGenerator(None, start_datetime, weather_location)

    #stateGenerator.generateTempEvents()
    #stateGenerator.generateInitialState()
    stateGenerator.generateDoorEvents()
    


if __name__ == "__main__":
    main()