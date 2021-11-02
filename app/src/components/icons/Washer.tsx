import { GiWashingMachine } from "react-icons/gi";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Washer = (props: IconProps) => {
  const iconTrue = <GiWashingMachine color="blue" />;
  const iconFalse = <GiWashingMachine color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Washer;
