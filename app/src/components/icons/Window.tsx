import React from "react";
import { GiWindow, GiWindowBars } from "react-icons/gi";
import Icon, { IconProps } from "./Icon";

const Window = (props: IconProps) => {
  const iconTrue = <GiWindow />;
  const iconFalse = <GiWindowBars />;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Window;
