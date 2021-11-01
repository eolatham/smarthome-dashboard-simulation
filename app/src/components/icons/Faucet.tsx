import { FaFaucet } from "react-icons/fa";
import Icon, { IconProps } from "./Icon";

const Faucet = (props: IconProps) => {
  const iconTrue = <FaFaucet color="yellow"/>;
  const iconFalse = <FaFaucet color="black"/>;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Faucet;
