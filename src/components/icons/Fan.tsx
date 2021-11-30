import { GiComputerFan } from "react-icons/gi";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Oven = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<GiComputerFan color="lightblue" />}
    iconFalse={<GiComputerFan color="black" />}
    labelTrue="on"
    labelFalse="off"
    {...props}
  />
);
export default Oven;
