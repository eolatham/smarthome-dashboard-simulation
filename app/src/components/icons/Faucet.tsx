import { FaFaucet } from "react-icons/fa";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Faucet = (props: IconProps) => {
  const iconTrue = <FaFaucet color="blue" />;
  const iconFalse = <FaFaucet color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Faucet;
