import { FaSink } from "react-icons/fa";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Faucet = (props: IconProps) => {
  const iconTrue = <FaSink color="blue" />;
  const iconFalse = <FaSink color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Faucet;
