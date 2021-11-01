import React from "react";
import "./Floorplan.css";
import Door from "./icons/Door";
import Window from "./icons/Window";
import Lightbulb from "./icons/Lightbulb";
import Faucet from "./icons/Faucet";
import Refrigerator from "./icons/Refrigerator";
import Microwave from "./icons/Microwave";
import Dishwasher from "./icons/Dishwasher";
import Stove from "./icons/Stove";
import Oven from "./icons/Oven";
import TV from "./icons/TV";
import Fan from "./icons/Fan";
import Washer from "./icons/Washer";
import Dryer from "./icons/Dryer";
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
        <Faucet {...iconProps("bathroom2Faucet")} />
        <Fan {...iconProps("bathroom2ExhaustFan")} />
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
        <TV {...iconProps("livingRoomTv")} />
      </div>
      <div className="kitchen">
        Kitchen
        <Lightbulb {...lightProps("kitchenOverheadLight")} />
        <Window {...iconProps("kitchenWindow1")} />
        <Window {...iconProps("kitchenWindow2")} />
        <Refrigerator {...iconProps("kitchenRefrigerator")}/>
        <Microwave {...iconProps("kitchenMicrowave")} />
        <Dishwasher {...iconProps("kitchenDishWasher")} />
        <Stove {...iconProps("kitchenStove")} />
        <Oven {...iconProps("kitchenOven")} />
      </div>
      <div className="laundry-room">Laundry Room
        <Washer {...iconProps("clothesWasher")} />
        <Dryer {...iconProps("clothesDryer")} />
      </div>
      <div className="bathroom-1">
        Bathroom 1
        <Lightbulb {...lightProps("bathroom1OverheadLight")} />
        <Window {...iconProps("bathroom1Window")} />
        <Faucet {...iconProps("bathroom1Faucet")} />
        <Fan {...iconProps("bathroom1ExhaustFan")} />
      </div>
      <div className="bedroom-1">
        Bedroom 1
        <Lightbulb {...lightProps("bedroom1OverheadLight")} />
        <Lightbulb {...lightProps("bedroom1Lamp1")} />
        <Lightbulb {...lightProps("bedroom1Lamp2")} />
        <Window {...iconProps("bedroom1Window1")} />
        <Window {...iconProps("bedroom1Window2")} />
        <TV {...iconProps("bedroom1Tv")} />
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
