import React from "react";
import { RiDoorClosedFill, RiDoorOpenFill } from "react-icons/ri";
import Icon, { IconProps } from "./Icon";

const Door = (props: IconProps) => {
  const iconTrue = <RiDoorOpenFill color="brown" />;
  const iconFalse = <RiDoorClosedFill color="black" />;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Door;
