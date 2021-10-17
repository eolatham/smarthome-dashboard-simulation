import React from "react";
import {
  SetStateFunction,
  IntegerStateKey,
  BooleanStateKey,
} from "../common/types";

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
};
class HomePage extends React.Component<HomePageProps, HomePageState> {
  static getInitialState(): HomePageState {
    return {
      integer: { thermostatTemp: null, outdoorTemp: null },
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
    const { state } = this.props;
    return (
      <div>
        <h1>Home Page</h1>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(state, null, "\t")}
        </div>
      </div>
    );
  }
}
export default HomePage;
