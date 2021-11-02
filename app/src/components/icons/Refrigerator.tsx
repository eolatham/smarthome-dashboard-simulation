import { RiFridgeFill, RiFridgeLine } from "react-icons/ri";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Refrigerator = (props: IconProps) => {
  const iconTrue = <RiFridgeFill color="lightblue" />;
  const iconFalse = <RiFridgeLine color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Refrigerator;
