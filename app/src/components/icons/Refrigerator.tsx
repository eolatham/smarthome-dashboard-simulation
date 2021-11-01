import { RiFridgeFill, RiFridgeLine } from "react-icons/ri";
import Icon, { IconProps } from "./Icon";

const Refrigerator = (props: IconProps) => {
  const iconTrue = <RiFridgeFill />;
  const iconFalse = <RiFridgeLine />;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Refrigerator;
