#!/usr/bin/env python3

# STL
import os
import logging

# PDM
from flask import Flask, request, jsonify
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
    APP_CLOCK = AppClock(MIN_APP_TIME, MAX_APP_TIME, DEFAULT_SPEEDUP_FACTOR)
    EVENT_QUEUE = EventQueue(LOGGER, APP_CLOCK, queryAllEvents())
    EVENT_PROCESSOR = EventProcessor(LOGGER, APP, APP_CLOCK, EVENT_QUEUE)

######################################## ROUTES ########################################

SUCCESS = "Success", 200

# TODO: add route to get constants


@APP.route("/start")
def startSimulation():
    """
    Starts/restarts the smart home dashboard simulation by:
    - resetting the event queue pointer
    - starting/restarting the app clock
    - starting the event processor (if it is not already running)
    """
    EVENT_QUEUE.reset()
    APP_CLOCK.start()
    EVENT_PROCESSOR.start()
    return SUCCESS


@APP.route("/clock", methods=["GET"])
def getAppClockInfo():
    """
    Gets the following information from the app clock:
    ```
    {
        "time": "<the current app time in seconds>",
        "speed": "<the current speedup factor of the app clock>"
    }
    ```
    """
    if not APP_CLOCK.running:
        return "The app clock is not running; please wait for it to start.", 425
    return jsonify({"time": APP_CLOCK.time(), "speed": APP_CLOCK.getSpeedupFactor()})


@APP.route("/speed", methods=["PUT"])
def setAppClockSpeedupFactor():
    """
    Sets the speedup factor of the app clock using `request.json["speedupFactor"]`.
    """
    speedupFactor = request.json.get("speedupFactor")
    if not isinstance(speedupFactor, (int, float)):
        return "The value of `speedupFactor` should be a number!", 400
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
    return SUCCESS


######################################### MAIN #########################################

if __name__ == "__main__":
    APP.run(host="localhost", port=5000, debug=True)
