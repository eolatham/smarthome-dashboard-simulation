#!/usr/bin/env python3

# STL
import os
import logging

# PDM
from flask import Flask, request
from flask_cors import CORS
from flask_sse import sse

# LOCAL
from public.clock.AppClock import AppClock
from public.event.Event import queryAllEvents
from public.event.EventQueue import EventQueue
from public.event.EventProcessor import EventProcessor
from public.constants import *

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(filename)20s:%(lineno)-4s] [%(levelname)8s]   %(message)s",
)
LOGGER = logging.getLogger(__name__)

######################################### APP ##########################################

APP = Flask(__name__)
CORS(APP)
APP.config["REDIS_URL"] = REDIS_URL
APP.register_blueprint(sse, url_prefix="/events")

if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    # Flask runs this script with two processes to refresh code changes,
    # but we only want these instructions to run on the main process.
    APP_CLOCK = AppClock(MIN_SPEEDUP_FACTOR)
    EVENT_QUEUE = EventQueue(LOGGER, APP_CLOCK, queryAllEvents())
    EVENT_PROCESSOR = EventProcessor(LOGGER, APP, APP_CLOCK, EVENT_QUEUE)
    EVENT_PROCESSOR.start()

######################################## ROUTES ########################################


@APP.route("/")
def index():
    return "Hello, world!"


@APP.route("/speedupFactor", methods=["PUT"])
def setAppClockSpeedupFactor():
    speedupFactor = request.json.get("speedupFactor")
    if speedupFactor is None:
        return "The value of `speedupFactor` should not be None!", 400
    if speedupFactor < MIN_SPEEDUP_FACTOR:
        return (
            f"The value of `speedupFactor` should not be less than {MIN_SPEEDUP_FACTOR}!",
            400,
        )
    if speedupFactor > MAX_SPEEDUP_FACTOR:
        return (
            f"The value of `speedupFactor` should not be greater than {MAX_SPEEDUP_FACTOR}!",
            400,
        )
    APP_CLOCK.setSpeedupFactor(speedupFactor)
    EVENT_PROCESSOR.updateJobInterval()
    return "Success!", 200


######################################### MAIN #########################################

if __name__ == "__main__":
    APP.run(host="localhost", port=5000, debug=True)
