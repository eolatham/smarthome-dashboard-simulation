#!/usr/bin/env python3

# STL
import os
import logging
from time import time

# PDM
from flask import Flask
from flask_sse import sse

# LOCAL
from public.routes import BLUEPRINT
from public.clock.AppClock import AppClock
from public.event.EventQueue import EventQueue
from public.event.EventPublisher import EventPublisher

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(filename)20s:%(lineno)-4s] [%(levelname)8s]   %(message)s",
)
LOGGER = logging.getLogger(__name__)

APP = Flask(__name__)
APP.config["REDIS_URL"] = "redis://localhost"
APP.register_blueprint(sse, url_prefix="/events")
APP.register_blueprint(BLUEPRINT)

if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    # Flask runs this script with two processes to refresh code changes,
    # but we only want these instructions to run on the main process.
    APP_CLOCK = AppClock(startTime=time(), speedupFactor=1)
    EVENT_QUEUE = EventQueue(
        LOGGER,
        APP_CLOCK,
        [{"time": time() + 2}, {"time": time() + 7}, {"time": time() + 12}],
    )
    EVENT_PUBLISHER = EventPublisher(APP, LOGGER, EVENT_QUEUE, 1)
    EVENT_PUBLISHER.start()

if __name__ == "__main__":
    APP.run(host="localhost", port=5000, debug=True)
