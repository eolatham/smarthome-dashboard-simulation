import React from "react";
import { BsFillLightbulbFill } from "react-icons/bs";
import Icon, { IconProps } from "./Icon";

const Lightbulb = (props: IconProps) => {
  const iconTrue = <BsFillLightbulbFill color="yellow" />;
  const iconFalse = <BsFillLightbulbFill color="black" />;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Lightbulb;
