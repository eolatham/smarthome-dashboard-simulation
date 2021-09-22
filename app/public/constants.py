REDIS_URL = "redis://localhost"

REAL_TIME = "REAL_TIME"
APP_TIME = "APP_TIME"

MIN_APP_TIME = 0  # Seconds
MAX_APP_TIME = 5184000  # Seconds (60 days)

MIN_SPEEDUP_FACTOR = 1  # 1 real second = 1 app second
MAX_SPEEDUP_FACTOR = 3600  # 1 real second = 1 app hour
DEFAULT_SPEEDUP_FACTOR = 60  # 1 real second = 1 app minute

PUBLISH_TIME_INTERVAL = (1, REAL_TIME)  # Seconds
PUBLISH_EVENTS_INTERVAL = (30, APP_TIME)  # Seconds
PUBLISH_INDOOR_TEMP_INTERVAL = (3600, APP_TIME)  # Seconds (1 hour)

OUTDOOR_TEMP_STATE_KEY = "outdoorTemp"  # TODO: verify this
THERMOSTAT_TEMP_STATE_KEY = "thermostatTemp"  # TODO: verify this
DOOR_STATE_KEYS = {"door"}  # TODO: add to this
WINDOW_STATE_KEYS = {"window"}  # TODO: add to this

MIN_THERMOSTAT_TEMP = 55  # Degrees Fahrenheit
MAX_THERMOSTAT_TEMP = 85  # Degrees Fahrenheit
