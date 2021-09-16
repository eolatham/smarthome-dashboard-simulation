/**
 * Module for storing common helper functions.
 */

import { FAILED_TO_CONNECT_TO_SSE } from "./constants";

export function processEventSourceError(error: object) {
  console.log(FAILED_TO_CONNECT_TO_SSE, error);
}
