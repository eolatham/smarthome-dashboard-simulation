import { RiFridgeFill, RiFridgeLine } from "react-icons/ri";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Refrigerator = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<RiFridgeFill color="lightblue" />}
    iconFalse={<RiFridgeLine color="black" />}
    labelTrue="on"
    labelFalse="off"
    {...props}
  />
);
export default Refrigerator;
