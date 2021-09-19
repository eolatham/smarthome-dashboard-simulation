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
from public.events.Event import Event, queryEvents
from public.events.EventQueue import EventQueue
from public.sse.TimePublisher import TimePublisher
from public.sse.EventPublisher import EventPublisher
from public.sse.DerivedStatePublisher import DerivedStatePublisher

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
    PRE_GENERATED_EVENT_QUEUE = EventQueue(LOGGER, APP_CLOCK, queryEvents())
    USER_GENERATED_EVENT_QUEUE = EventQueue(LOGGER, APP_CLOCK, [])
    BACKGROUND_SCHEDULER = BackgroundScheduler()
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
        PRE_GENERATED_EVENT_QUEUE,
        BACKGROUND_SCHEDULER,
        *PUBLISH_EVENTS_INTERVAL,
    )
    DERIVED_STATE_PUBLISHER = DerivedStatePublisher(
        LOGGER,
        APP,
        APP_CLOCK,
        PRE_GENERATED_EVENT_QUEUE,
        USER_GENERATED_EVENT_QUEUE,
        BACKGROUND_SCHEDULER,
        *PUBLISH_DERIVED_STATE_INTERVAL,
    )

######################################## ROUTES ########################################

SUCCESS = "Success", 200


@APP.route("/start")
def startSimulation():
    """
    Starts/restarts the smart home dashboard simulation by:
    - resetting the event queue pointer
    - starting/restarting the app clock
    - starting the time publisher (if it is not already running)
    - starting the event publisher (if it is not already running)
    - starting the measurements publisher (if it is not already running)
    """
    PRE_GENERATED_EVENT_QUEUE.reset()
    USER_GENERATED_EVENT_QUEUE.clear()
    APP_CLOCK.start()
    TIME_PUBLISHER.start()
    EVENT_PUBLISHER.start()
    DERIVED_STATE_PUBLISHER.start()
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
    DERIVED_STATE_PUBLISHER.refreshJobInterval()
    return SUCCESS


@APP.route("/user-generated-event", methods=["POST"])
def userGeneratedEvent():
    """
    Appends an event to the user-generated event queue so that it will
    be included in the calculations of derived state and utility usage.
    """
    try:
        event: Event = request.json.get("event")
        check_type("`event`", event, Event)
    except TypeError as e:
        return f"The value of `event` is invalid... {e.args[0]}", 400

    event["time"] = int(APP_CLOCK.time())
    USER_GENERATED_EVENT_QUEUE.append(event)
    return SUCCESS


# TODO: implement this
@APP.route("/utility-usage", methods=["GET"])
def utilityUsage():
    """
    Gets utility usage statistics for the previous and current months.
    """
    return SUCCESS


######################################### MAIN #########################################

if __name__ == "__main__":
    APP.run(host="localhost", port=5000, debug=True)
