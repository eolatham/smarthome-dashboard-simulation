import React from "react";
import Thermostat from "./Thermostat";
import {
  SetStateFunction,
  IntegerStateKey,
  BooleanStateKey,
} from "../common/types";
import { postUserGeneratedThermostatEvent } from "../common/helpers";
import { MIN_THERMOSTAT_TEMP, MAX_THERMOSTAT_TEMP } from "../common/constants";

export type HomePageState = {
  integer: {
    [Property in IntegerStateKey]: number;
  };
  boolean: {
    [Property in BooleanStateKey]: boolean;
  };
};
export type HomePageProps = {
  state: HomePageState;
  setState: SetStateFunction;
  setIntegerState: SetStateFunction;
  setBooleanState: SetStateFunction;
};
class HomePage extends React.Component<HomePageProps, HomePageState> {
  static getInitialState(): HomePageState {
    return {
      integer: { outdoorTemp: null, indoorTemp: null, thermostatTemp: null },
      boolean: {
        bedRoom1OverheadLight: false,
        bedRoom1Lamp1: false,
        bedRoom1Lamp2: false,
        bedRoom1Window1: false,
        bedRoom1Window2: false,
        bedRoom1Tv: false,
        bedRoom2OverheadLight: false,
        bedRoom2Lamp1: false,
        bedRoom2Lamp2: false,
        bedRoom2Window1: false,
        bedRoom2Window2: false,
        bedRoom3OverheadLight: false,
        bedRoom3Lamp1: false,
        bedRoom3Lamp2: false,
        bedRoom3Window1: false,
        bedRoom3Window2: false,
        bathRoom1OverheadLight: false,
        bathRoom1ExhaustFan: false,
        bathRoom1Window: false,
        bathRoom1Faucet: false,
        bathRoom2OverheadLight: false,
        bathRoom2ExhaustFan: false,
        bathRoom2Window: false,
        bathRoom2Faucet: false,
        clothesWasher: false,
        clothesDryer: false,
        frontDoor: false,
        backDoor: false,
        garageHouseDoor: false,
        garageCarDoor1: false,
        garageCarDoor2: false,
        livingRoomOverheadLight: false,
        livingRoomLamp1: false,
        livingRoomLamp2: false,
        livingRoomTv: false,
        livingRoomWindow1: false,
        livingRoomWindow2: false,
        livingRoomWindow3: false,
        kitchenOverheadLight: false,
        kitchenStove: false,
        kitchenOven: false,
        kitchenMicrowave: false,
        kitchenRefrigerator: false,
        kitchenDishWasher: false,
        kitchenWindow1: false,
        kitchenWindow2: false,
      },
    };
  }

  render() {
    const { state, setIntegerState } = this.props;
    return (
      <div>
        <h1>Home</h1>
        <div>
          <Thermostat
            outdoorTemp={state.integer.outdoorTemp}
            indoorTemp={state.integer.indoorTemp}
            thermostatTemp={state.integer.thermostatTemp}
            minThermostatTemp={MIN_THERMOSTAT_TEMP}
            maxThermostatTemp={MAX_THERMOSTAT_TEMP}
            onThermostatTempChange={(newThermostatTemp: number) =>
              setIntegerState(
                {
                  thermostatTemp: newThermostatTemp,
                },
                () => postUserGeneratedThermostatEvent(newThermostatTemp)
              )
            }
          />
        </div>
      </div>
    );
  }
}
export default HomePage;
