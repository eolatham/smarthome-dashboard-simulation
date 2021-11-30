import { FaSink } from "react-icons/fa";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Faucet = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<FaSink color="blue" />}
    iconFalse={<FaSink color="black" />}
    labelTrue="on"
    labelFalse="off"
    {...props}
  />
);
export default Faucet;
