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
      bedroom1OverheadLight: false,
      bedroom1Lamp1: false,
      bedroom1Lamp2: false,
      bedroom1Window1: false,
      bedroom1Window2: false,
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
      bathroom1Window: false,
      bathroom2OverheadLight: false,
      bathroom2Window: false,
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
          title="Bedroom Lights"
          stateKeysMap={{
            // Subgroup state key prefix: subgroup state key suffixes
            bedroom1: ["OverheadLight", "Lamp1", "Lamp2"],
            bedroom2: ["OverheadLight", "Lamp1", "Lamp2"],
            bedroom3: ["OverheadLight", "Lamp1", "Lamp2"],
          }}
        />
        <SwitchGroup
          {...commonSwitchGroupProps}
          title="Other Lights"
          stateKeysMap={{
            // Subgroup state key prefix: subgroup state key suffixes
            bathroom1: ["OverheadLight"],
            bathroom2: ["OverheadLight"],
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
          title="Bedroom Windows"
          stateKeysMap={{
            // Subgroup state key prefix: subgroup state key suffixes
            bedroom1: ["Window1", "Window2"],
            bedroom2: ["Window1", "Window2"],
            bedroom3: ["Window1", "Window2"],
          }}
        />
        <SwitchGroup
          {...commonSwitchGroupProps}
          title="Other Windows"
          stateKeysMap={{
            // Subgroup state key prefix: subgroup state key suffixes
            bathroom1: ["Window"],
            bathroom2: ["Window"],
            livingRoom: ["Window1", "Window2", "Window3"],
            kitchen: ["Window1", "Window2"],
          }}
        />
      </div>
    );
  }
}
export default ControlPage;
