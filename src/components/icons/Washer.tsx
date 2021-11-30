import { GiWashingMachine } from "react-icons/gi";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Washer = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<GiWashingMachine color="blue" />}
    iconFalse={<GiWashingMachine color="black" />}
    labelTrue="on"
    labelFalse="off"
    {...props}
  />
);
export default Washer;
