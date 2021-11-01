import { FaSink } from "react-icons/fa";
import Icon, { IconProps } from "./Icon";

const Faucet = (props: IconProps) => {
  const iconTrue = <FaSink color="yellow"/>;
  const iconFalse = <FaSink color="black"/>;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Faucet;
