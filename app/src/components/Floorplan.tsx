import {
  IconProps,
  Dishwasher,
  Door,
  Dryer,
  Fan,
  Faucet,
  Lightbulb,
  Microwave,
  Oven,
  Refrigerator,
  Stove,
  TV,
  Washer,
  Window,
} from "./icons";
import {
  humanReadableStateKey,
  postUserGeneratedBooleanEvent,
} from "../common/helpers";
import {
  SetStateFunction,
  BooleanStateKey,
  UserGeneratedBooleanStateKey,
} from "../common/types";
import "./Floorplan.css";

export type FloorplanProps = {
  state: {
    [Property in BooleanStateKey]: boolean;
  };
  setState: SetStateFunction;
};
const Floorplan = (props: FloorplanProps) => {
  const { state, setState } = props;

  const iconProps = (stateKey: BooleanStateKey, size?: string): IconProps => ({
    className: stateKey,
    value: state[stateKey],
    size: size,
    tooltipMessage: humanReadableStateKey(stateKey),
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
      <div className="bedroom2">
        Bedroom 2
        <Lightbulb {...lightProps("bedroom2OverheadLight")} />
        <Lightbulb {...lightProps("bedroom2Lamp1", "1.5rem")} />
        <Lightbulb {...lightProps("bedroom2Lamp2", "1.5rem")} />
        <Window {...iconProps("bedroom2Window1")} />
        <Window {...iconProps("bedroom2Window2")} />
      </div>
      <div className="bathroom2">
        Bathroom 2
        <Lightbulb {...lightProps("bathroom2OverheadLight")} />
        <Window {...iconProps("bathroom2Window")} />
        <Faucet {...iconProps("bathroom2Faucet")} />
        <Fan {...iconProps("bathroom2ExhaustFan")} />
      </div>
      <div className="bedroom3">
        Bedroom 3
        <Lightbulb {...lightProps("bedroom3OverheadLight")} />
        <Lightbulb {...lightProps("bedroom3Lamp1", "1.5rem")} />
        <Lightbulb {...lightProps("bedroom3Lamp2", "1.5rem")} />
        <Window {...iconProps("bedroom3Window1")} />
        <Window {...iconProps("bedroom3Window2")} />
      </div>
      <div className="livingRoom">
        Living Room
        <Lightbulb {...lightProps("livingRoomOverheadLight")} />
        <Lightbulb {...lightProps("livingRoomLamp1", "1.5rem")} />
        <Lightbulb {...lightProps("livingRoomLamp2", "1.5rem")} />
        <Window {...iconProps("livingRoomWindow1")} />
        <Window {...iconProps("livingRoomWindow2")} />
        <Window {...iconProps("livingRoomWindow3")} />
        <TV {...iconProps("livingRoomTv", "4rem")} />
        <Door {...iconProps("frontDoor")} />
        <Door {...iconProps("backDoor")} />
      </div>
      <div className="kitchen">
        Kitchen
        <Lightbulb {...lightProps("kitchenOverheadLight")} />
        <Window {...iconProps("kitchenWindow1")} />
        <Window {...iconProps("kitchenWindow2")} />
        <Refrigerator {...iconProps("kitchenRefrigerator")} />
        <Microwave {...iconProps("kitchenMicrowave")} />
        <Dishwasher {...iconProps("kitchenDishWasher")} />
        <Stove {...iconProps("kitchenStove")} />
        <Oven {...iconProps("kitchenOven")} />
      </div>
      <div className="laundryRoom">
        Laundry Room
        <Washer {...iconProps("clothesWasher")} />
        <Dryer {...iconProps("clothesDryer")} />
      </div>
      <div className="bathroom1">
        Bathroom 1
        <Lightbulb {...lightProps("bathroom1OverheadLight")} />
        <Window {...iconProps("bathroom1Window")} />
        <Faucet {...iconProps("bathroom1Faucet")} />
        <Fan {...iconProps("bathroom1ExhaustFan")} />
      </div>
      <div className="bedroom1">
        Bedroom 1
        <Lightbulb {...lightProps("bedroom1OverheadLight")} />
        <Lightbulb {...lightProps("bedroom1Lamp1", "1.5rem")} />
        <Lightbulb {...lightProps("bedroom1Lamp2", "1.5rem")} />
        <Window {...iconProps("bedroom1Window1")} />
        <Window {...iconProps("bedroom1Window2")} />
        <TV {...iconProps("bedroom1Tv")} />
      </div>
      <div className="garage">
        Garage
        <Door {...iconProps("garageHouseDoor")} />
        <Door {...iconProps("garageCarDoor1", "4rem")} />
        <Door {...iconProps("garageCarDoor2", "4rem")} />
      </div>
    </div>
  );
};
export default Floorplan;
