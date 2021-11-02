import { GiWindow, GiWindowBars } from "react-icons/gi";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Window = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<GiWindow color="brown" />}
    iconFalse={<GiWindowBars color="black" />}
    labelTrue="open"
    labelFalse="closed"
    {...props}
  />
);
export default Window;
