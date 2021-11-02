import { RiDoorClosedFill, RiDoorOpenFill } from "react-icons/ri";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Door = (props: IconProps) => {
  const iconTrue = <RiDoorOpenFill color="brown" />;
  const iconFalse = <RiDoorClosedFill color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Door;
