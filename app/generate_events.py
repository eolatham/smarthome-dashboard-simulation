"""
Generate state of home for two months
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

    def generateIntialState(self):
        """ Generates initial state, assuming t = 0 is a Monday at Midnight"""
        initial_states =[[0, "light", "bedRoom1OverheadLight", False, "Bedroom 1 Overhead Light is OFF"],
                        [0, "light", "bedRoom1Lamp1", False, "Bedroom 1 Lamp 1 is OFF"],
                        [0, "light", "bedRoom1Lamp2", False, "Bedroom 1 Lamp 2 is OFF"],
                        [0, "window", "bedRoom1Window1", False, "Bedroom 1 Window 1 is CLOSED"],
                        [0, "window", "bedRoom1Window2", False, "Bedroom 1 Window 2 is CLOSED"],
                        [0, "bedRoomTv", "bedRoom1Tv", False, "Bedroom 1 TV is OFF"],

                        [0, "light", "bedRoom2OverheadLight", False, "Bedroom 2 Overhead Light is OFF"],
                        [0, "light", "bedRoom2Lamp1", False, "Bedroom 2 Lamp 1 is OFF"],
                        [0, "light", "bedRoom2Lamp2", False, "Bedroom 2 Lamp 2 is OFF"],
                        [0, "window", "bedRoom2Window1", False, "Bedroom 2 Window 1 is CLOSED"],
                        [0, "window", "bedRoom2Window2", False, "Bedroom 2 Window 2 is CLOSED"],

                        [0, "light", "bedRoom3OverheadLight", False, "Bedroom 3 Overhead Light is OFF"],
                        [0, "light", "bedRoom3Lamp1", False, "Bedroom 3 Lamp 1 is OFF"],
                        [0, "light", "bedRoom3Lamp2", False, "Bedroom 3 Lamp 2 is OFF"],
                        [0, "window", "bedRoom3Window1", False, "Bedroom 3 Window 1 is CLOSED"],
                        [0, "window", "bedRoom3Window2", False, "Bedroom 3 Window 2 is CLOSED"],

                        [0, "light", "bathRoom1OverheadLight", False, "Bathroom 1 Overhead Light is OFF"],
                        [0, "bathExhaustFan", "bathRoom1ExhaustFan", False, "Bathroom 1 Exhaust Fan is OFF"],
                        [0, "window", "bathRoom1Window", False, "Bathroom 1 Window is CLOSED"],
                        [0, "shower", "bathRoom1Shower", False, "Bathroom 1 Shower is OFF"], #NOTE THIS IS DIFFERENT THAN BATHROOM FAUCET
                        [0, "bath", "bathRoom1Bath", False, "Bathroom 1 Bath is OFF"],

                        [0, "light", "bathRoom2OverheadLight", False, "Bathroom 2 Overhead Light is OFF"],
                        [0, "bathExhaustFan", "bathRoom2ExhaustFan", False, "Bathroom 2 Exhaust Fan is OFF"],
                        [0, "window", "bathRoom2Window", False, "Bathroom 2 Window is CLOSED"],
                        [0, "shower", "bathRoom2Shower", False, "Bathroom 2 Shower is OFF"], #NOTE THIS IS DIFFERENT THAN BATHROOM FAUCET
                        [0, "bath", "bathRoom2Bath", False, "Bathroom 2 Bath is OFF"],

                        [0, "light", "livingRoomOverheadLight", False, "Living Room Overhead Light is OFF"],
                        [0, "light", "livingRoomLamp1", False, "Living Room Lamp 1 is OFF"],
                        [0, "light", "livingRoomLamp2", False, "Living Room Lamp 2 is OFF"],
                        [0, "window", "livingRoomWindow1", False, "Living Room Window 1 is CLOSED"],
                        [0, "window", "livingRoomWindow2", False, "Living Room Window 2 is CLOSED"],
                        [0, "window", "livingRoomWindow3", False, "Living Room Window 2 is CLOSED"],
                        [0, "livingRoomTv", "livingRoomTv", False, "Living Room TV is OFF"],

                        [0, "light", "kitchenOverheadLight", False, "Kitchen Overhead Light is OFF"],
                        [0, "stove", "kitchenStove", False, "Kitchen Stove is OFF"],
                        [0, "oven", "kitchenOven", False, "Kitchen Oven is OFF"],
                        [0, "microwave", "kitchenMicrowave", False, "Kitchen Microwave is OFF"],
                        [0, "refrigerator", "kitchenRefrigerator", True, "Kitchen Refrigerator is ON"],
                        [0, "dishWasher", "kitchenDishWasher", False, "Kitchen Dishwasher is OFF"],
                        [0, "window", "kitchenWindow1", False, "Kitchen Window 1 is CLOSED"],
                        [0, "window", "kitchenWindow2", False, "Kitchen Window 2 is CLOSED"],

                        [0, "door", "garageCarDoor1", False, "Garage Car Door 1 is CLOSED"],
                        [0, "door", "garageCarDoor2", False, "Garage Car Door 2 is CLOSED"],
                        [0, "door", "garageHouseDoor", False, "Garage House Door is CLOSED"],
                        [0, "door", "frontDoor", False, "Front Door is CLOSED"],
                        [0, "door", "backDoor", False, "Back Door is CLOSED"]]
        
        for initial_state in initial_states:
            self.insert(initial_state[0], initial_state[1], initial_state[2], initial_state[3], initial_state[4])

        #Integer initial states
        self.insert(0, "temp", "thermostatTemp", 70, "Thermostat is set to 70")
        
        self.insert()

    def generateWeatherData(self):
        """ Generate hourly weather data"""
        start = self.start
        end = self.start + datetime.timedelta(60)
        loc = self.weather_location
        try:
            weather_data = Hourly(loc, start, end)
            weather_data = weather_data.fetch()
            for i in range(len(weather_data)):
                temp = int(5/9*weather_data[i].temp + 32
                #self.insert("integer_event", i*TIME_MAP["hour"], "temp", "outdoorTemp", temp, "The current outdoor temperature is "+str(temp)))
                weather_vals = ["integer_event", i*TIME_MAP["hour"], "temp", "outdoorTemp", temp, "The current outdoor temperature is "+str(temp)]
                print(weather_vals)
        except Exception as e:
            e.PrintStackTrace()



    def generateFrontBackDoors():
        # Assume t0 and t1 are always initial and final time

        #Iterate over each day
        for t_day in range(0, 60*TIME_MAP["day"], TIME_MAP["day"]):
            # S-S
            if ((t_curr % TIME_MAP["Saturday"]) == 0 ) or ((t_curr % TIME_MAP["Sunday"]) == 0):
                #7a-10p - 30 sec door event x32 (non overlapping)
                t_start = t_day + 7 * TIME_MAP["hour"]
                t_end = t_day + 22 * TIME_MAP["hour"]
                for i in range(32):
                    # HOW TO AVOID OVERLAP?

                    #Randomly pick which door to open
                    pick_door = random.random()
                    which_door = "frontDoor"
                    if pick_door < 0.5:
                        which_door = "backDoor"
                    
                    t_open = random.randInt(t_start, t_end)
                    t_close = t_open + 30

    def insert(table, time, state_type, state_key, new_value, message):
        if table in ["boolean_event", "integer_event"]:
            try:
                self.db.execute((f"INSERT INTO pre_generated_events.{table} "
                                "VALUES (%s, %s, %s, %s, %s) "
                                "ON CONFLICT DO UPDATE"), 
                                time, state_type, state_key, new_value, message)
            except Exception as e:
                e.PrintStackTrace()
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

    stateGenerator.generateWeatherData()
    #stateGenerator.generateInitialState()
    #stateGenerator.generateFrontBackDoors()
    


if __name__ == "__main__":
    main()