import { BsFillLightbulbFill } from "react-icons/bs";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Lightbulb = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<BsFillLightbulbFill color="orange" />}
    iconFalse={<BsFillLightbulbFill color="black" />}
    labelTrue="on"
    labelFalse="off"
    hoverTitle={`Click to turn ${props.value ? "off" : "on"}`}
    {...props}
  />
);
export default Lightbulb;
