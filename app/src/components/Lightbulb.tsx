import React from "react";
import { BsFillLightbulbFill } from "react-icons/bs";

export type LightbulbProps = {
  label: string;
  on: boolean;
  setOn: (on: boolean) => void;
};
const Lightbulb = (props: LightbulbProps) => {
  const { label, on, setOn } = props;
  return (
    <div title={label} onClick={() => setOn(!on)}>
      <BsFillLightbulbFill
        color={on ? "yellow" : "black"}
        fontSize="2rem"
      ></BsFillLightbulbFill>
    </div>
  );
};
export default Lightbulb;
