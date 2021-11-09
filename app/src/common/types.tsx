/**
 * Module for storing common types.
 */

export type CallbackFunction = () => void;
export type SetStateFunction = (
  state: object,
  callback?: CallbackFunction
) => void;

export type ConstantsFromBackend = {
  MIN_SPEEDUP_FACTOR: number;
  MAX_SPEEDUP_FACTOR: number;
  MIN_THERMOSTAT_TEMP: number;
  MAX_THERMOSTAT_TEMP: number;
  PUBLISH_ANALYSIS_INTERVAL: number;
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

export type IntegerStateType = "temp";
export type BooleanStateType =
  | "door"
  | "window"
  | "light"
  | "bedroomTv"
  | "livingRoomTv"
  | "stove"
  | "oven"
  | "microwave"
  | "refrigerator"
  | "dishWasher"
  | "shower"
  | "bath"
  | "bathExhaustFan"
  | "clothesWasher"
  | "clothesDryer";
export type UserGeneratedBooleanStateType = "door" | "window" | "light";
export type StateType = IntegerStateType | BooleanStateType;

export type IntegerStateKey = "outdoorTemp" | "indoorTemp" | "thermostatTemp";
export type BooleanStateKey =
  | "bedroom1OverheadLight"
  | "bedroom1Lamp1"
  | "bedroom1Lamp2"
  | "bedroom1Window1"
  | "bedroom1Window2"
  | "bedroom1Tv"
  | "bedroom2OverheadLight"
  | "bedroom2Lamp1"
  | "bedroom2Lamp2"
  | "bedroom2Window1"
  | "bedroom2Window2"
  | "bedroom3OverheadLight"
  | "bedroom3Lamp1"
  | "bedroom3Lamp2"
  | "bedroom3Window1"
  | "bedroom3Window2"
  | "bathroom1OverheadLight"
  | "bathroom1ExhaustFan"
  | "bathroom1Window"
  | "bathroom1Faucet"
  | "bathroom2OverheadLight"
  | "bathroom2ExhaustFan"
  | "bathroom2Window"
  | "bathroom2Faucet"
  | "clothesWasher"
  | "clothesDryer"
  | "frontDoor"
  | "backDoor"
  | "garageHouseDoor"
  | "garageCarDoor1"
  | "garageCarDoor2"
  | "livingRoomOverheadLight"
  | "livingRoomLamp1"
  | "livingRoomLamp2"
  | "livingRoomTv"
  | "livingRoomWindow1"
  | "livingRoomWindow2"
  | "livingRoomWindow3"
  | "kitchenOverheadLight"
  | "kitchenStove"
  | "kitchenOven"
  | "kitchenMicrowave"
  | "kitchenRefrigerator"
  | "kitchenDishWasher"
  | "kitchenWindow1"
  | "kitchenWindow2";
export type UserGeneratedBooleanStateKey =
  | "bedroom1OverheadLight"
  | "bedroom1Lamp1"
  | "bedroom1Lamp2"
  | "bedroom1Window1"
  | "bedroom1Window2"
  | "bedroom2OverheadLight"
  | "bedroom2Lamp1"
  | "bedroom2Lamp2"
  | "bedroom2Window1"
  | "bedroom2Window2"
  | "bedroom3OverheadLight"
  | "bedroom3Lamp1"
  | "bedroom3Lamp2"
  | "bedroom3Window1"
  | "bedroom3Window2"
  | "bathroom1OverheadLight"
  | "bathroom1Window"
  | "bathroom2OverheadLight"
  | "bathroom2Window"
  | "frontDoor"
  | "backDoor"
  | "garageHouseDoor"
  | "garageCarDoor1"
  | "garageCarDoor2"
  | "livingRoomOverheadLight"
  | "livingRoomLamp1"
  | "livingRoomLamp2"
  | "livingRoomWindow1"
  | "livingRoomWindow2"
  | "livingRoomWindow3"
  | "kitchenOverheadLight"
  | "kitchenWindow1"
  | "kitchenWindow2";
export type StateKey = IntegerStateKey | BooleanStateKey;

export type IntegerEvent = {
  time: number;
  state_type: IntegerStateType;
  state_key: IntegerStateKey;
  new_value: number;
  message: string;
};
export type BooleanEvent = {
  time: number;
  state_type: BooleanStateType;
  state_key: BooleanStateKey;
  new_value: boolean;
  message: string;
};

export type UserGeneratedThermostatEvent = {
  time: number;
  state_type: "temp";
  state_key: "thermostatTemp";
  new_value: number;
  message: string;
};
export type UserGeneratedBooleanEvent = {
  time: number;
  state_type: UserGeneratedBooleanStateType;
  state_key: UserGeneratedBooleanStateKey;
  new_value: boolean;
  message: string;
};
export type UserGeneratedEvent =
  | UserGeneratedThermostatEvent
  | UserGeneratedBooleanEvent;

export type Event = IntegerEvent | BooleanEvent | UserGeneratedEvent;
