import { GiGasStove } from "react-icons/gi";
import Icon, { IconProps } from "./Icon";

const Faucet = (props: IconProps) => {
  const iconTrue = <GiGasStove color="yellow"/>;
  const iconFalse = <GiGasStove color="black"/>;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Faucet;
