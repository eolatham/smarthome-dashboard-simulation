#!/usr/bin/env python3

# STL
import logging
from public.event.EventPublisher import EventPublisher
from public.event.EventQueue import EventQueue
from public.clock.AppClock import AppClock

# PDM
from flask import Flask
from flask_sse import sse

APP_CLOCK = AppClock(startTime=0, speedupFactor=1)
EVENT_QUEUE = EventQueue(APP_CLOCK, [{"time": 0}, {"time": 5}, {"time": 10}])
EVENT_PUBLISHER = EventPublisher(EVENT_QUEUE, 1)
EVENT_PUBLISHER.start()


def create_app() -> Flask:
    logging.basicConfig(
        level=logging.INFO,
        format="[%(asctime)s] [%(filename)20s:%(lineno)-4s] [%(levelname)8s]   %(message)s",
    )
    app = Flask(__name__)
    app.config["REDIS_URL"] = "redis://localhost"

    with app.app_context():
        from public import routes

        app.register_blueprint(routes.BP)
        app.register_blueprint(sse, url_prefix="/events")

    return app
