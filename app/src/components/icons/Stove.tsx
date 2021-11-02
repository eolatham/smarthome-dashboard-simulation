import { GiGasStove } from "react-icons/gi";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Faucet = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<GiGasStove color="red" />}
    iconFalse={<GiGasStove color="black" />}
    labelTrue="on"
    labelFalse="off"
    {...props}
  />
);
export default Faucet;
