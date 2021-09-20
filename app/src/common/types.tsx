/**
 * Module for storing common types.
 */

export type SmartHomeEvent = {
  time: number;
  stateKey: string;
  newValue: any;
  message: string;
};
