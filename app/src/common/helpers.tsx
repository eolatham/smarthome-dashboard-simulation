/**
 * Module for storing common helper functions.
 */

import {
  UserGeneratedEvent,
  UserGeneratedThermostatEvent,
  UserGeneratedBooleanStateType,
  UserGeneratedBooleanStateKey,
  UserGeneratedBooleanEvent,
} from "./types";
import { USER_GENERATED_EVENT_URL } from "./constants";

export function processEventSourceError(error: object) {
  console.log("Failed to connect to Flask-Redis SSE stream...", error);
}

function postUserGeneratedEventRequest(event: UserGeneratedEvent) {
  fetch(USER_GENERATED_EVENT_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event: event }),
  }).then((resp) => {
    if (resp.status !== 200)
      window.alert("Failed to post user-generated event to the server!");
  });
}

export function postUserGeneratedThermostatEvent(thermostatTemp: number) {
  const event: UserGeneratedThermostatEvent = {
    time: -1, // This is set by the backend on retrieval
    state_type: "temp",
    state_key: "thermostatTemp",
    new_value: thermostatTemp,
    message: "The user changed the thermostat temperature.",
  };
  postUserGeneratedEventRequest(event);
}

export function postUserGeneratedBooleanEvent(
  stateType: UserGeneratedBooleanStateType,
  stateKey: UserGeneratedBooleanStateKey,
  newValue: boolean
) {
  var message: string;
  switch (stateType) {
    case "door":
      message = `The user ${newValue ? "opened" : "closed"} the door.`;
      break;
    case "window":
      message = `The user ${newValue ? "opened" : "closed"} the window.`;
      break;
    case "light":
      message = `The user turned the light ${newValue ? "on" : "off"}.`;
      break;
    default:
      throw new Error("`stateType` must be 'light', 'door', or 'window'!");
  }
  const event: UserGeneratedBooleanEvent = {
    time: -1, // This is set by the backend on retrieval
    state_type: stateType,
    state_key: stateKey,
    new_value: newValue,
    message: message,
  };
  postUserGeneratedEventRequest(event);
}
