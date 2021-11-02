import { GiGasStove } from "react-icons/gi";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Faucet = (props: IconProps) => {
  const iconTrue = <GiGasStove color="red" />;
  const iconFalse = <GiGasStove color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Faucet;
