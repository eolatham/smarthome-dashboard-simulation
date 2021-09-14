#!/usr/bin/env python3

# STL
import os
import logging

# PDM
from flask import Flask, Blueprint, request
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

######################################## ROUTES ########################################

BLUEPRINT = Blueprint("routes", __name__)


@BLUEPRINT.route("/")
def index():
    return "Hello, world!"


@BLUEPRINT.route("/speedupFactor", methods=["PUT"])
def setAppClockSpeedupFactor():
    speedupFactor = request.json.get("speedupFactor")
    if speedupFactor is None:
        LOGGER.warning("The value of `speedupFactor` should not be None!")
        return "BAD REQUEST", 400
    if speedupFactor < MIN_SPEEDUP_FACTOR:
        LOGGER.warning(
            "The value of `speedupFactor` should not be less than %d!",
            MIN_SPEEDUP_FACTOR,
        )
        return "BAD REQUEST", 400
    if speedupFactor > MAX_SPEEDUP_FACTOR:
        LOGGER.warning(
            "The value of `speedupFactor` should not be greater than %d!",
            MAX_SPEEDUP_FACTOR,
        )
        return "BAD REQUEST", 400
    APP_CLOCK.setSpeedupFactor(speedupFactor)
    EVENT_PROCESSOR.updateJobInterval()
    return "SUCCESS", 200


######################################### APP ##########################################

APP = Flask(__name__)
APP.config["REDIS_URL"] = REDIS_URL
APP.register_blueprint(sse, url_prefix="/events")
APP.register_blueprint(BLUEPRINT)

if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    # Flask runs this script with two processes to refresh code changes,
    # but we only want these instructions to run on the main process.
    APP_CLOCK = AppClock(MIN_SPEEDUP_FACTOR)
    EVENT_QUEUE = EventQueue(LOGGER, APP_CLOCK, queryAllEvents())
    EVENT_PROCESSOR = EventProcessor(LOGGER, APP, APP_CLOCK, EVENT_QUEUE)
    EVENT_PROCESSOR.start()

if __name__ == "__main__":
    APP.run(host="localhost", port=5000, debug=True)
