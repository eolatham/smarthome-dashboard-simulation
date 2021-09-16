/**
 * Module for storing common types.
 */

export type SmartHomeEvent = {
  id: number;
  time: number;
  stateKey: string;
  newValue: any;
  message: string;
};
