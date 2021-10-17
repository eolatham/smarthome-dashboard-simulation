/**
 * Module for storing common helper functions.
 */

import {
  UserGeneratedEvent,
  UserGeneratedThermostatEvent,
  UserGeneratedBooleanStateKey,
  UserGeneratedBooleanEvent,
} from "./types";
import { CLOCK_SPEED_URL, USER_GENERATED_EVENT_URL } from "./constants";

export function isUppercaseChar(char: string): boolean {
  const code = char.charCodeAt(0);
  return code > 64 && code < 91;
}

export function isNumberChar(char: string): boolean {
  const code = char.charCodeAt(0);
  return code > 47 && code < 58;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function humanReadableStateKey(stateKey: string): string {
  var parts = [];
  var lastSplit = 0;
  var i, c;
  for (i = 0; i < stateKey.length; i++) {
    c = stateKey[i];
    if (isUppercaseChar(c) || isNumberChar(c)) {
      parts.push(capitalize(stateKey.slice(lastSplit, i)));
      lastSplit = i;
    }
  }
  parts.push(stateKey.slice(lastSplit));
  return parts.join(" ");
}

export function processEventSourceError(error: object) {
  console.log("Failed to connect to Flask-Redis SSE stream...", error);
}

export function getClockSpeedRequest(): Promise<number> {
  return fetch(CLOCK_SPEED_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((resp) => resp.json());
}

export function postClockSpeedRequest(speed: number): Promise<void> {
  return fetch(CLOCK_SPEED_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ speed: speed }),
  }).then((resp) => {
    if (resp.status !== 200)
      window.alert("Failed to post clock speed to the server!");
  });
}

export function postUserGeneratedEventRequest(
  event: UserGeneratedEvent
): Promise<void> {
  return fetch(USER_GENERATED_EVENT_URL, {
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

export function postUserGeneratedThermostatEvent(
  thermostatTemp: number
): Promise<void> {
  const event: UserGeneratedThermostatEvent = {
    time: -1, // This is set by the backend on retrieval
    state_type: "temp",
    state_key: "thermostatTemp",
    new_value: thermostatTemp,
    message: "The user changed the thermostat temperature",
  };
  return postUserGeneratedEventRequest(event);
}

export function postUserGeneratedBooleanEvent(
  stateKey: UserGeneratedBooleanStateKey,
  newValue: boolean
): Promise<void> {
  const USER_GENERATED_BOOLEAN_STATE_TYPE = {
    bedRoom1OverheadLight: "light",
    bedRoom1Lamp1: "light",
    bedRoom1Lamp2: "light",
    bedRoom1Window1: "window",
    bedRoom1Window2: "window",
    bedRoom2OverheadLight: "light",
    bedRoom2Lamp1: "light",
    bedRoom2Lamp2: "light",
    bedRoom2Window1: "window",
    bedRoom2Window2: "window",
    bedRoom3OverheadLight: "light",
    bedRoom3Lamp1: "light",
    bedRoom3Lamp2: "light",
    bedRoom3Window1: "window",
    bedRoom3Window2: "window",
    bathRoom1OverheadLight: "light",
    bathRoom1Window: "window",
    bathRoom2OverheadLight: "light",
    bathRoom2Window: "window",
    frontDoor: "door",
    backDoor: "door",
    garageHouseDoor: "door",
    garageCarDoor1: "door",
    garageCarDoor2: "door",
    livingRoomOverheadLight: "light",
    livingRoomLamp1: "light",
    livingRoomLamp2: "light",
    livingRoomWindow1: "window",
    livingRoomWindow2: "window",
    livingRoomWindow3: "window",
    kitchenOverheadLight: "light",
    kitchenWindow1: "window",
    kitchenWindow2: "window",
  };
  const stateType = USER_GENERATED_BOOLEAN_STATE_TYPE[stateKey];
  if (!stateType) throw new Error(`Invalid state key: ${stateKey}`);

  var message: string;
  switch (stateType) {
    case "door":
      message = `The user ${newValue ? "opened" : "closed"} the door`;
      break;
    case "window":
      message = `The user ${newValue ? "opened" : "closed"} the window`;
      break;
    case "light":
      message = `The user turned the light ${newValue ? "on" : "off"}`;
      break;
    default:
      throw new Error(`Invalid state type: ${stateType}`);
  }
  const event: UserGeneratedBooleanEvent = {
    time: -1, // This is set by the backend on retrieval
    state_type: stateType,
    state_key: stateKey,
    new_value: newValue,
    message: message,
  };
  return postUserGeneratedEventRequest(event);
}
