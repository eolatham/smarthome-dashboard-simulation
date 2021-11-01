import { GiComputerFan } from "react-icons/gi";
import Icon, { IconProps } from "./Icon";

const Oven = (props: IconProps) => {
  const iconTrue = <GiComputerFan color="yellow"/>;
  const iconFalse = <GiComputerFan color="black"/>;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Oven;
