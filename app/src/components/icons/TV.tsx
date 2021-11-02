import { IoMdTv, IoIosTv } from "react-icons/io";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const TV = (props: IconProps) => {
  const iconTrue = <IoIosTv color="green" />;
  const iconFalse = <IoMdTv color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default TV;
