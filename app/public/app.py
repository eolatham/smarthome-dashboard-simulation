#!/usr/bin/env python3

# STL
import os
import logging

# PDM
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sse import sse
from typeguard import check_type
from apscheduler.schedulers.background import BackgroundScheduler

# LOCAL
from public.constants import *
from public.time.AppClock import AppClock
from public.time.TimePublisher import TimePublisher
from public.events.Event import Event, queryEvents
from public.events.EventStore import EventStore
from public.events.EventPublisher import EventPublisher
from public.analysis.IndoorTempPublisher import IndoorTempPublisher

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(filename)20s:%(lineno)-4s] [%(levelname)8s]   %(message)s",
)
LOGGER = logging.getLogger(__name__)

######################################### APP ##########################################

APP = Flask(__name__)
CORS(APP)
APP.config["REDIS_URL"] = REDIS_URL
APP.register_blueprint(sse, url_prefix="/sse")

if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    # Flask runs this script with two processes to refresh code changes,
    # but we only want these instructions to run on the main process.
    APP_CLOCK = AppClock(MIN_APP_TIME, MAX_APP_TIME, DEFAULT_SPEEDUP_FACTOR)
    BACKGROUND_SCHEDULER = BackgroundScheduler()
    EVENT_STORE = EventStore()
    EVENT_STORE.putPreGeneratedEvents(*queryEvents())
    TIME_PUBLISHER = TimePublisher(
        LOGGER,
        APP,
        APP_CLOCK,
        BACKGROUND_SCHEDULER,
        *PUBLISH_TIME_INTERVAL,
    )
    EVENT_PUBLISHER = EventPublisher(
        LOGGER,
        APP,
        APP_CLOCK,
        EVENT_STORE,
        BACKGROUND_SCHEDULER,
        *PUBLISH_EVENTS_INTERVAL,
    )
    INDOOR_TEMP_PUBLISHER = IndoorTempPublisher(
        LOGGER,
        APP,
        APP_CLOCK,
        EVENT_STORE,
        OUTDOOR_TEMP_STATE_KEY,
        THERMOSTAT_TEMP_STATE_KEY,
        DOOR_STATE_KEYS,
        WINDOW_STATE_KEYS,
        BACKGROUND_SCHEDULER,
        *PUBLISH_INDOOR_TEMP_INTERVAL,
    )

######################################## ROUTES ########################################

SUCCESS = "Success", 200


# TODO: add route to get constants (min/max app time speeds, min/max thermostat values)


@APP.route("/start")
def startSimulation():
    """
    Starts/restarts the smart home dashboard simulation by:
    - clearing user-generated events from the event map
    - starting or restarting the app clock
    - resetting and starting the SSE publishers
    """
    EVENT_STORE.clearUserGeneratedEvents()
    APP_CLOCK.start()
    TIME_PUBLISHER.start()
    EVENT_PUBLISHER.start()
    INDOOR_TEMP_PUBLISHER.start()
    return SUCCESS


@APP.route("/speed", methods=["GET", "POST"])
def appClockSpeedupFactor():
    """
    Gets or sets the speedup factor of the app clock.
    """
    if request.method == "GET":
        return jsonify(APP_CLOCK.getSpeedupFactor())

    # Request is a POST if the below code is reached
    speedupFactor = request.json.get("speed")
    if not isinstance(speedupFactor, (int, float)):
        return "The value of `speed` should be a number", 400
    if speedupFactor < MIN_SPEEDUP_FACTOR:
        return (
            f"The value of `speed` should not be less than {MIN_SPEEDUP_FACTOR}",
            400,
        )
    if speedupFactor > MAX_SPEEDUP_FACTOR:
        return (
            f"The value of `speed` should not be greater than {MAX_SPEEDUP_FACTOR}",
            400,
        )
    APP_CLOCK.setSpeedupFactor(speedupFactor)
    EVENT_PUBLISHER.refreshJobInterval()
    INDOOR_TEMP_PUBLISHER.refreshJobInterval()
    return SUCCESS


@APP.route("/user-generated-event", methods=["POST"])
def userGeneratedEvent():
    """
    Puts a user-generated event into the event map so that it will be
    included in the calculations of derived state and utility usage.
    """
    try:
        event: Event = request.json.get("event")
        check_type("`event`", event, Event)
    except TypeError as e:
        return f"The value of `event` is invalid... {e.args[0]}", 400

    event["time"] = int(APP_CLOCK.time())
    EVENT_STORE.putUserGeneratedEvents(event)
    return SUCCESS


# TODO: implement this
@APP.route("/utility-usage", methods=["GET"])
def utilityUsage():
    return SUCCESS


######################################### MAIN #########################################

if __name__ == "__main__":
    APP.run(host="localhost", port=5000, debug=True)
