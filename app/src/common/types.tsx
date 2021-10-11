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
  | "bedRoomTv"
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

export type IntegerStateKey = "outdoorTemp" | "thermostatTemp";
export type BooleanStateKey =
  | "bedRoom1OverheadLight"
  | "bedRoom1Lamp1"
  | "bedRoom1Lamp2"
  | "bedRoom1Window1"
  | "bedRoom1Window2"
  | "bedRoom1Tv"
  | "bedRoom2OverheadLight"
  | "bedRoom2Lamp1"
  | "bedRoom2Lamp2"
  | "bedRoom2Window1"
  | "bedRoom2Window2"
  | "bedRoom3OverheadLight"
  | "bedRoom3Lamp1"
  | "bedRoom3Lamp2"
  | "bedRoom3Window1"
  | "bedRoom3Window2"
  | "bathRoom1OverheadLight"
  | "bathRoom1ExhaustFan"
  | "bathRoom1Window"
  | "bathRoom1Faucet"
  | "bathRoom2OverheadLight"
  | "bathRoom2ExhaustFan"
  | "bathRoom2Window"
  | "bathRoom2Faucet"
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
  | "bedRoom1OverheadLight"
  | "bedRoom1Lamp1"
  | "bedRoom1Lamp2"
  | "bedRoom1Window1"
  | "bedRoom1Window2"
  | "bedRoom2OverheadLight"
  | "bedRoom2Lamp1"
  | "bedRoom2Lamp2"
  | "bedRoom2Window1"
  | "bedRoom2Window2"
  | "bedRoom3OverheadLight"
  | "bedRoom3Lamp1"
  | "bedRoom3Lamp2"
  | "bedRoom3Window1"
  | "bedRoom3Window2"
  | "bathRoom1OverheadLight"
  | "bathRoom1Window"
  | "bathRoom2OverheadLight"
  | "bathRoom2Window"
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
