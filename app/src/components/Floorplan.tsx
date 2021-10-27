import React from "react";
import "./Floorplan.css";

export type FloorplanProps = {};
const Floorplan = (props: FloorplanProps) => {
  return (
    <div className="floorplan">
      <div className="bedroom-2">Bedroom 2</div>
      <div className="bathroom-2">Bathroom 2</div>
      <div className="bedroom-3">Bedroom 3</div>
      <div className="living-room">Living Room</div>
      <div className="kitchen">Kitchen</div>
      <div className="laundry-room">Laundry Room</div>
      <div className="bathroom-1">Bathroom 1</div>
      <div className="bedroom-1">Bedroom 1</div>
      <div className="garage">Garage</div>
    </div>
  );
};
export default Floorplan;
