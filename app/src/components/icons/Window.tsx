import React from "react";
import { GiWindow, GiWindowBars } from "react-icons/gi";
import Icon, { IconProps } from "./Icon";

const Window = (props: IconProps) => {
  const iconTrue = <GiWindow color="brown" />;
  const iconFalse = <GiWindowBars color="black" />;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Window;
