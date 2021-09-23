/**
 * Module for storing common types.
 */

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
  indoorTemp: number;
  utilityUsage: UtilityUsage;
};
