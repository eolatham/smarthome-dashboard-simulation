import { FaFaucet } from "react-icons/fa";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Faucet = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<FaFaucet color="blue" />}
    iconFalse={<FaFaucet color="black" />}
    labelTrue="on"
    labelFalse="off"
    {...props}
  />
);
export default Faucet;
