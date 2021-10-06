/**
 * Module for storing common types.
 */

export type ConstantsFromBackend = {
  MIN_SPEEDUP_FACTOR: number;
  MAX_SPEEDUP_FACTOR: number;
  MIN_THERMOSTAT_TEMP: number;
  MAX_THERMOSTAT_TEMP: number;
};
export type SmartHomeEvent = {
  time: number;
  stateType: string;
  stateKey: string;
  newValue: any;
  message: string;
};
export type WaterUsage = {
  gallons: number;
  dollars: number;
};
export type ElectricityUsage = {
  watts: number;
  dollars: number;
};
export type UtilityUsage = {
  water: WaterUsage;
  electricity: ElectricityUsage;
  totalDollars: number;
};
export type AnalysisObject = {
  time: number;
  indoorTemp: number;
  utilityUsage: UtilityUsage;
};
