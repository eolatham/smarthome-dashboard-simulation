import React from "react";
import {
  SetStateFunction,
  UserGeneratedBooleanStateKey,
} from "../common/types";

export type ControlPageState = {
  [Property in UserGeneratedBooleanStateKey]: boolean;
};
export type ControlPageProps = {
  state: ControlPageState;
  setState: SetStateFunction;
};
class ControlPage extends React.Component<ControlPageProps, ControlPageState> {
  static getInitialState(): ControlPageState {
    return {
      bedRoom1OverheadLight: false,
      bedRoom1Lamp1: false,
      bedRoom1Lamp2: false,
      bedRoom1Window1: false,
      bedRoom1Window2: false,
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
      bathRoom1Window: false,
      bathRoom2OverheadLight: false,
      bathRoom2Window: false,
      frontDoor: false,
      backDoor: false,
      garageHouseDoor: false,
      garageCarDoor1: false,
      garageCarDoor2: false,
      livingRoomOverheadLight: false,
      livingRoomLamp1: false,
      livingRoomLamp2: false,
      livingRoomWindow1: false,
      livingRoomWindow2: false,
      livingRoomWindow3: false,
      kitchenOverheadLight: false,
      kitchenWindow1: false,
      kitchenWindow2: false,
    };
  }

  render() {
    const { state } = this.props;
    return (
      <div>
        <h1>Control</h1>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(state, null, "\t")}
        </div>
      </div>
    );
  }
}
export default ControlPage;
