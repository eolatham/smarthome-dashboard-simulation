# STL
import logging
import asyncio

# PDM
from flask import Blueprint

LOG = logging.getLogger(__name__)
LOOP = asyncio.new_event_loop()

BLUEPRINT = Blueprint("routes", __name__)


@BLUEPRINT.route("/")
def index():
    return "Hello, world!"
