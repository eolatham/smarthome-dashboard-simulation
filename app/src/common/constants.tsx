/**
 * Module for storing common constant values.
 */

export const SERVER_BASE_URL = "http://localhost:5000";
export const START_SIMULATION_URL = `${SERVER_BASE_URL}/start`;
export const CLOCK_SPEED_URL = `${SERVER_BASE_URL}/speed`;
export const SSE_URL = `${SERVER_BASE_URL}/sse`;

export const FAILED_TO_CONNECT_TO_SSE =
  "Failed to connect to Flask-Redis SSE stream...";
