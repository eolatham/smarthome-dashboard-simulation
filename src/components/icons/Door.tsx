import { RiDoorClosedFill, RiDoorOpenFill } from "react-icons/ri";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Door = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<RiDoorOpenFill color="brown" />}
    iconFalse={<RiDoorClosedFill color="black" />}
    labelTrue="open"
    labelFalse="closed"
    {...props}
  />
);
export default Door;
