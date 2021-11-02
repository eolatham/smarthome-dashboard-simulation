import { BsFillLightbulbFill } from "react-icons/bs";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Lightbulb = (props: IconProps) => {
  const iconTrue = <BsFillLightbulbFill color="orange" />;
  const iconFalse = <BsFillLightbulbFill color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Lightbulb;
