/**
 * Module for storing common constant values.
 */

import { ConstantsFromBackend } from "./types";

export const SERVER_BASE_URL = "http://localhost:5000";
export const CONSTANTS_URL = `${SERVER_BASE_URL}/constants`;
export const START_SIMULATION_URL = `${SERVER_BASE_URL}/start`;
export const CLOCK_SPEED_URL = `${SERVER_BASE_URL}/speed`;
export const USER_GENERATED_EVENT_URL = `${SERVER_BASE_URL}/user-generated-event`;
export const SSE_URL = `${SERVER_BASE_URL}/sse`;

export const AVG_WATER_USAGE_RATE = 25; // Gallons per day
export const AVG_ELECTRICITY_USAGE_RATE = 10000; // Watts per day

var constantsRequest = new XMLHttpRequest();
constantsRequest.open("GET", CONSTANTS_URL, false); // Synchronous!
constantsRequest.send();
var constants: ConstantsFromBackend = JSON.parse(constantsRequest.response);
export const MIN_SPEEDUP_FACTOR = constants.MIN_SPEEDUP_FACTOR;
export const MAX_SPEEDUP_FACTOR = constants.MAX_SPEEDUP_FACTOR;
export const MIN_THERMOSTAT_TEMP = constants.MIN_THERMOSTAT_TEMP;
export const MAX_THERMOSTAT_TEMP = constants.MAX_THERMOSTAT_TEMP;
export const PUBLISH_ANALYSIS_INTERVAL = constants.PUBLISH_ANALYSIS_INTERVAL;
