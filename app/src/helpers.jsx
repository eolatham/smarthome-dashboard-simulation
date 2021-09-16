import { FAILED_TO_CONNECT_TO_SSE } from "./constants";

export function processEventSourceError(error) {
  console.log(FAILED_TO_CONNECT_TO_SSE, error);
}
