import React from "react";
import Floorplan from "./Floorplan";
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
        bedroom1OverheadLight: false,
        bedroom1Lamp1: false,
        bedroom1Lamp2: false,
        bedroom1Window1: false,
        bedroom1Window2: false,
        bedroom1Tv: false,
        bedroom2OverheadLight: false,
        bedroom2Lamp1: false,
        bedroom2Lamp2: false,
        bedroom2Window1: false,
        bedroom2Window2: false,
        bedroom3OverheadLight: false,
        bedroom3Lamp1: false,
        bedroom3Lamp2: false,
        bedroom3Window1: false,
        bedroom3Window2: false,
        bathroom1OverheadLight: false,
        bathroom1ExhaustFan: false,
        bathroom1Window: false,
        bathroom1Faucet: false,
        bathroom2OverheadLight: false,
        bathroom2ExhaustFan: false,
        bathroom2Window: false,
        bathroom2Faucet: false,
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
      <div className="page-container my-3">
        <div className="page-section-column mx-3" style={{ width: "80%" }}>
          <h1>Interactive Floorplan</h1>
          <Floorplan />
        </div>
        <div className="page-section-column mx-3" style={{ width: "20%" }}>
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
