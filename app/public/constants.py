# STL
from datetime import datetime


POSTGRES_URL = "postgresql://username:password@localhost:5432/smart_home_simulation"
REDIS_URL = "redis://localhost"

REAL_TIME = "REAL_TIME"
APP_TIME = "APP_TIME"

MIN_APP_TIME = 0  # Seconds
MAX_APP_TIME = 5184000  # Seconds (60 days)

# TODO: change this to the correct date after `generate_events.py` is run
SIMULATION_START_DATE_TIMESTAMP = datetime(2021, 10, 4).timestamp()

MIN_SPEEDUP_FACTOR = 1  # 1 real second = 1 app second
MAX_SPEEDUP_FACTOR = 3600  # 1 real second = 1 app hour
DEFAULT_SPEEDUP_FACTOR = 60  # 1 real second = 1 app minute

PUBLISH_TIME_INTERVAL = (1, REAL_TIME)  # Seconds
PUBLISH_EVENTS_INTERVAL = (30, APP_TIME)  # Seconds
PUBLISH_INDOOR_TEMP_INTERVAL = (1800, APP_TIME)  # Seconds (30 minutes)

MIN_THERMOSTAT_TEMP = 55  # Degrees Fahrenheit
MAX_THERMOSTAT_TEMP = 85  # Degrees Fahrenheit

TIME_MAP = {
    "minute": 60,
    "hour": 3600,
    "day": 86400,
    "week": 604800,
    "month": 2592000, #Assumes 30 days
    "Tuesday": 86400, #Assumes 0 = Midnight on Monday
    "Wednesday": 172800,
    "Thursday": 259200,
    "Friday": 345600,
    "Saturday": 432000,
    "Sunday": 518400,
}
