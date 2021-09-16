REDIS_URL = "redis://localhost"

MIN_APP_TIME = 0  # Seconds
MAX_APP_TIME = 5184000  # Seconds (60 days)

MIN_SPEEDUP_FACTOR = 1  # 1 real second = 1 app second
MAX_SPEEDUP_FACTOR = 43200  # 1 real second = 43200 app seconds
DEFAULT_SPEEDUP_FACTOR = 60  # 1 real second = 60 app seconds

PUBLISH_TIME_INTERVAL = 1  # Real seconds
PUBLISH_EVENTS_INTERVAL = 30  # App seconds
