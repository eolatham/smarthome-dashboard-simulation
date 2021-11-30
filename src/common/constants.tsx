/**
 * Module for storing common constant values.
 */

import { ConstantsFromBackend } from "./types";

export const SERVER_BASE_URL = "http://localhost:4000";
export const CONSTANTS_URL = `${SERVER_BASE_URL}/constants`;
export const START_SIMULATION_URL = `${SERVER_BASE_URL}/start`;
export const CLOCK_SPEED_URL = `${SERVER_BASE_URL}/speed`;
export const USER_GENERATED_EVENT_URL = `${SERVER_BASE_URL}/user-generated-event`;
export const SSE_URL = `${SERVER_BASE_URL}/sse`;

var constantsRequest = new XMLHttpRequest();
constantsRequest.open("GET", CONSTANTS_URL, false); // Synchronous!
constantsRequest.send();
var constants: ConstantsFromBackend = JSON.parse(constantsRequest.response);
export const MIN_SPEEDUP_FACTOR = constants.MIN_SPEEDUP_FACTOR;
export const MAX_SPEEDUP_FACTOR = constants.MAX_SPEEDUP_FACTOR;
export const MIN_THERMOSTAT_TEMP = constants.MIN_THERMOSTAT_TEMP;
export const MAX_THERMOSTAT_TEMP = constants.MAX_THERMOSTAT_TEMP;
export const PUBLISH_ANALYSIS_INTERVAL = constants.PUBLISH_ANALYSIS_INTERVAL;

export const LOCAL_AVG_GALLONS_PER_DAY = 100;
export const LOCAL_AVG_WATTS_PER_DAY = 25000;
export const ANALYSIS_PUBLICATIONS_PER_DAY =
  (24 * 60 * 60) / PUBLISH_ANALYSIS_INTERVAL;
export const LOCAL_AVG_GALLONS_PER_PUBLISH_ANALYSIS_INTERVAL =
  LOCAL_AVG_GALLONS_PER_DAY / ANALYSIS_PUBLICATIONS_PER_DAY;
export const LOCAL_AVG_WATTS_PER_PUBLISH_ANALYSIS_INTERVAL =
  LOCAL_AVG_WATTS_PER_DAY / ANALYSIS_PUBLICATIONS_PER_DAY;
