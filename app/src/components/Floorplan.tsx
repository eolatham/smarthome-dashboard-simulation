import React from "react";
import "./Floorplan.css";
import Door from "./Door";
import Lightbulb from "./Lightbulb";
import Window from "./Window";

export type FloorplanProps = {
  booleanState: {
    bedroom1OverheadLight: boolean,
    bedroom1Lamp1: boolean,
    bedroom1Lamp2: boolean,
    bedroom1Window1: boolean,
    bedroom1Window2: boolean,
    bedroom1Tv: boolean,
    bedroom2OverheadLight: boolean,
    bedroom2Lamp1: boolean,
    bedroom2Lamp2: boolean,
    bedroom2Window1: boolean,
    bedroom2Window2: boolean,
    bedroom3OverheadLight: boolean,
    bedroom3Lamp1: boolean,
    bedroom3Lamp2: boolean,
    bedroom3Window1: boolean,
    bedroom3Window2: boolean,
    bathroom1OverheadLight: boolean,
    bathroom1ExhaustFan: boolean,
    bathroom1Window: boolean,
    bathroom1Faucet: boolean,
    bathroom2OverheadLight: boolean,
    bathroom2ExhaustFan: boolean,
    bathroom2Window: boolean,
    bathroom2Faucet: boolean,
    clothesWasher: boolean,
    clothesDryer: boolean,
    frontDoor: boolean,
    backDoor: boolean,
    garageHouseDoor: boolean,
    garageCarDoor1: boolean,
    garageCarDoor2: boolean,
    livingRoomOverheadLight: boolean,
    livingRoomLamp1: boolean,
    livingRoomLamp2: boolean,
    livingRoomTv: boolean,
    livingRoomWindow1: boolean,
    livingRoomWindow2: boolean,
    livingRoomWindow3: boolean,
    kitchenOverheadLight: boolean,
    kitchenStove: boolean,
    kitchenOven: boolean,
    kitchenMicrowave: boolean,
    kitchenRefrigerator: boolean,
    kitchenDishWasher: boolean,
    kitchenWindow1: boolean,
    kitchenWindow2: boolean,
  }
};
const Floorplan = (props: FloorplanProps) => {
  return (
    <div className="floorplan">
      <div className="bedroom-2">Bedroom 2
        <Lightbulb label="bedroom2OverheadLight" on={props.booleanState.bedroom2OverheadLight} setOn={(on) => {}}/>
        <Lightbulb label="bedroom2Lamp1" on={props.booleanState.bedroom2Lamp1} setOn={(on) => {}}/>
        <Lightbulb label="bedroom2Lamp2" on={props.booleanState.bedroom2Lamp2} setOn={(on) => {}}/>
        <Window label="bedroom2Window1" open={props.booleanState.bedroom2Window1} setOpen={(open) => {}} />
        <Window label="bedroom2Window2" open={props.booleanState.bedroom2Window2} setOpen={(open) => {}} />
      </div>
      <div className="bathroom-2">Bathroom 2
        <Lightbulb label="bathroom2OverheadLight" on={props.booleanState.bathroom2OverheadLight} setOn={(on) => {}}/>
        <Window label="bathroom2Window" open={props.booleanState.bathroom2Window} setOpen={(open) => {}} />
      </div>
      <div className="bedroom-3">Bedroom 3
        <Lightbulb label="bedroom3OverheadLight" on={props.booleanState.bedroom3OverheadLight} setOn={(on) => {}}/>
        <Lightbulb label="bedroom3Lamp1" on={props.booleanState.bedroom3Lamp1} setOn={(on) => {}}/>
        <Lightbulb label="bedroom3Lamp2" on={props.booleanState.bedroom3Lamp2} setOn={(on) => {}}/>
        <Window label="bedroom3Window1" open={props.booleanState.bedroom3Window1} setOpen={(open) => {}} />
        <Window label="bedroom3Window2" open={props.booleanState.bedroom3Window2} setOpen={(open) => {}} />
      </div>
      <div className="living-room">Living Room
        <Lightbulb label="livingRoomLamp1" on={props.booleanState.livingRoomLamp1} setOn={(on) => {}}/>
        <Lightbulb label="livingRoomLamp2" on={props.booleanState.livingRoomLamp2} setOn={(on) => {}}/>
        <Window label="livingRoomWindow1" open={props.booleanState.livingRoomWindow1} setOpen={(open) => {}} />
        <Window label="livingRoomWindow2" open={props.booleanState.livingRoomWindow2} setOpen={(open) => {}} />
        <Window label="livingRoomWindow3" open={props.booleanState.livingRoomWindow3} setOpen={(open) => {}} />
      </div>
      <div className="kitchen">Kitchen
        <Lightbulb label="kitchenOverheadLight" on={props.booleanState.kitchenOverheadLight} setOn={(on) => {}}/>
        <Window label="kitchenWindow1" open={props.booleanState.kitchenWindow1} setOpen={(open) => {}} />
        <Window label="kitchenWindow2" open={props.booleanState.kitchenWindow2} setOpen={(open) => {}} />
      </div>
      <div className="laundry-room">Laundry Room</div>
      <div className="bathroom-1">Bathroom 1
        <Lightbulb label="bathroom1OverheadLight" on={props.booleanState.bathroom1OverheadLight} setOn={(on) => {}}/>
        <Window label="bathroom1Window" open={props.booleanState.bathroom1Window} setOpen={(open) => {}} />
      </div>
      <div className="bedroom-1">Bedroom 1
        <Lightbulb label="bedroom1OverheadLight" on={props.booleanState.bedroom1OverheadLight} setOn={(on) => {}}/>
        <Lightbulb label="bedroom1Lamp1" on={props.booleanState.bedroom1Lamp1} setOn={(on) => {}}/>
        <Lightbulb label="bedroom1Lamp2" on={props.booleanState.bedroom1Lamp2} setOn={(on) => {}}/>
        <Window label="bedroom1Window1" open={props.booleanState.bedroom1Window1} setOpen={(open) => {}} />
        <Window label="bedroom1Window2" open={props.booleanState.bedroom1Window2} setOpen={(open) => {}} />
      </div>
      <div className="garage">Garage
        <Door label="garageHouseDoor" open={props.booleanState.garageHouseDoor} setOpen={(open) => {}}/>
        <Door label="garageCarDoor1" open={props.booleanState.garageCarDoor1} setOpen={(open) => {}}/>
        <Door label="garageCarDoor2" open={props.booleanState.garageCarDoor2} setOpen={(open) => {}}/>
      </div>
    </div>
  );
};
export default Floorplan;
