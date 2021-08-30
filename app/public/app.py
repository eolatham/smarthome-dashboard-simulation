#!/usr/bin/env python3

# STL
import logging

# PDM
from flask import Flask


def create_app():
    logging.basicConfig(
        level=logging.INFO,
        format="[%(asctime)s] [%(filename)20s:%(lineno)-4s] [%(levelname)8s]   %(message)s",
    )
    app = Flask(__name__)

    with app.app_context():
        from public import routes

        app.register_blueprint(routes.BP)

    return app
