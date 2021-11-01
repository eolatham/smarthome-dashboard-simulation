import { GiWashingMachine } from "react-icons/gi";
import Icon, { IconProps } from "./Icon";

const Washer = (props: IconProps) => {
  const iconTrue = <GiWashingMachine color="yellow"/>;
  const iconFalse = <GiWashingMachine color="black"/>;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Washer;
