import React from "react";
import { postUserGeneratedBooleanEvent } from "../common/helpers";
import {
  SetStateFunction,
  UserGeneratedBooleanStateKey,
} from "../common/types";
import SwitchGroup from "./SwitchGroup";

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
    const switchGroupOnChange = (
      stateKeys: UserGeneratedBooleanStateKey[],
      newValue: boolean
    ) => {
      var newState = {};
      stateKeys.forEach((stateKey) => {
        newState[stateKey] = newValue;
      });
      this.props.setState(newState, () =>
        stateKeys.forEach((stateKey) =>
          postUserGeneratedBooleanEvent(stateKey, newValue)
        )
      );
    };
    const commonSwitchGroupProps = {
      state: this.props.state,
      onChange: switchGroupOnChange,
    };
    return (
      <div
        className="mx-5 my-3 p-0"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <SwitchGroup
          {...commonSwitchGroupProps}
          title="Bed Room Lights"
          stateKeysMap={{
            // Subgroup state key prefix: subgroup state key suffixes
            bedRoom1: ["OverheadLight", "Lamp1", "Lamp2"],
            bedRoom2: ["OverheadLight", "Lamp1", "Lamp2"],
            bedRoom3: ["OverheadLight", "Lamp1", "Lamp2"],
          }}
        />
        <SwitchGroup
          {...commonSwitchGroupProps}
          title="Other Lights"
          stateKeysMap={{
            // Subgroup state key prefix: subgroup state key suffixes
            bathRoom1: ["OverheadLight"],
            bathRoom2: ["OverheadLight"],
            livingRoom: ["OverheadLight", "Lamp1", "Lamp2"],
            kitchen: ["OverheadLight"],
          }}
        />
        <SwitchGroup
          {...commonSwitchGroupProps}
          title="Doors"
          stateKeysMap={{
            // Subgroup state key prefix: subgroup state key suffixes
            "": [
              "frontDoor",
              "backDoor",
              "garageHouseDoor",
              "garageCarDoor1",
              "garageCarDoor2",
            ],
          }}
        />
        <SwitchGroup
          {...commonSwitchGroupProps}
          title="Bed Room Windows"
          stateKeysMap={{
            // Subgroup state key prefix: subgroup state key suffixes
            bedRoom1: ["Window1", "Window2"],
            bedRoom2: ["Window1", "Window2"],
            bedRoom3: ["Window1", "Window2"],
          }}
        />
        <SwitchGroup
          {...commonSwitchGroupProps}
          title="Other Windows"
          stateKeysMap={{
            // Subgroup state key prefix: subgroup state key suffixes
            bathRoom1: ["Window"],
            bathRoom2: ["Window"],
            livingRoom: ["Window1", "Window2", "Window3"],
            kitchen: ["Window1", "Window2"],
          }}
        />
      </div>
    );
  }
}
export default ControlPage;
