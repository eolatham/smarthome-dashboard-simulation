import { GiWindow, GiWindowBars } from "react-icons/gi";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Window = (props: IconProps) => {
  const iconTrue = <GiWindow color="brown" />;
  const iconFalse = <GiWindowBars color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Window;
