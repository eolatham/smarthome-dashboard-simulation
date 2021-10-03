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

    def generateIntialState():
        # Assume t0 is Midnight on Monday
        pass

    def generateWeatherData(self):
        """ Generate hourly weather data"""
        # TODO Convert to F, insert into DB, check that correct num are inserted
        start = self.start
        end = self.start + datetime.timedelta(60)
        loc = self.weather_location
        try:
            weather_data = Hourly(loc, start, end)
            weather_data = weather_data.fetch()
            print(weather_data.temp)
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
                self.db.execute(f"INSERT INTO pre_generated_events.{table} VALUES (%s, %s, %s, %s, %s)", 
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