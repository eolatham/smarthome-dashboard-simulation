import { GiComputerFan } from "react-icons/gi";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Oven = (props: IconProps) => {
  const iconTrue = <GiComputerFan color="lightblue" />;
  const iconFalse = <GiComputerFan color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Oven;
