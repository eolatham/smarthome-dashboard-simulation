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
    const { state } = this.props;
    return (
      <div>
        <h1>Home</h1>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(state, null, "\t")}
        </div>
      </div>
    );
  }
}
export default HomePage;
