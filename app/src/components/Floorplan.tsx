import React from "react";
import "./Floorplan.css";
import Door from "./icons/Door";
import Window from "./icons/Window";
import Lightbulb from "./icons/Lightbulb";
import { IconProps } from "./icons/Icon";
import {
  humanReadableStateKey,
  postUserGeneratedBooleanEvent,
} from "../common/helpers";
import {
  SetStateFunction,
  BooleanStateKey,
  UserGeneratedBooleanStateKey,
} from "../common/types";

export type FloorplanProps = {
  state: {
    [Property in BooleanStateKey]: boolean;
  };
  setState: SetStateFunction;
};
const Floorplan = (props: FloorplanProps) => {
  const { state, setState } = props;

  const iconProps = (stateKey: BooleanStateKey, size?: string): IconProps => ({
    size: size,
    label: humanReadableStateKey(stateKey),
    value: state[stateKey],
  });

  const lightProps = (
    stateKey: UserGeneratedBooleanStateKey,
    size?: string
  ): IconProps => ({
    ...iconProps(stateKey, size),
    onClick: () =>
      setState({ [stateKey]: !state[stateKey] }, () =>
        postUserGeneratedBooleanEvent(stateKey, !state[stateKey])
      ),
  });

  return (
    <div className="floorplan">
      <div className="bedroom-2">
        Bedroom 2
        <Lightbulb {...lightProps("bedroom2OverheadLight")} />
        <Lightbulb {...lightProps("bedroom2Lamp1")} />
        <Lightbulb {...lightProps("bedroom2Lamp2")} />
        <Window {...iconProps("bedroom2Window1")} />
        <Window {...iconProps("bedroom2Window2")} />
      </div>
      <div className="bathroom-2">
        Bathroom 2
        <Lightbulb {...lightProps("bathroom2OverheadLight")} />
        <Window {...iconProps("bathroom2Window")} />
      </div>
      <div className="bedroom-3">
        Bedroom 3
        <Lightbulb {...lightProps("bedroom3OverheadLight")} />
        <Lightbulb {...lightProps("bedroom3Lamp1")} />
        <Lightbulb {...lightProps("bedroom3Lamp2")} />
        <Window {...iconProps("bedroom3Window1")} />
        <Window {...iconProps("bedroom3Window2")} />
      </div>
      <div className="living-room">
        Living Room
        <Lightbulb {...lightProps("livingRoomLamp1")} />
        <Lightbulb {...lightProps("livingRoomLamp2")} />
        <Window {...iconProps("livingRoomWindow1")} />
        <Window {...iconProps("livingRoomWindow2")} />
        <Window {...iconProps("livingRoomWindow3")} />
      </div>
      <div className="kitchen">
        Kitchen
        <Lightbulb {...lightProps("kitchenOverheadLight")} />
        <Window {...iconProps("kitchenWindow1")} />
        <Window {...iconProps("kitchenWindow2")} />
      </div>
      <div className="laundry-room">Laundry Room</div>
      <div className="bathroom-1">
        Bathroom 1
        <Lightbulb {...lightProps("bathroom1OverheadLight")} />
        <Window {...iconProps("bathroom1Window")} />
      </div>
      <div className="bedroom-1">
        Bedroom 1
        <Lightbulb {...lightProps("bedroom1OverheadLight")} />
        <Lightbulb {...lightProps("bedroom1Lamp1")} />
        <Lightbulb {...lightProps("bedroom1Lamp2")} />
        <Window {...iconProps("bedroom1Window1")} />
        <Window {...iconProps("bedroom1Window2")} />
      </div>
      <div className="garage">
        Garage
        <Door {...iconProps("garageHouseDoor")} />
        <Door {...iconProps("garageCarDoor1")} />
        <Door {...iconProps("garageCarDoor2")} />
      </div>
    </div>
  );
};
export default Floorplan;
