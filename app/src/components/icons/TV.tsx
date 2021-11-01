import { IoMdTv, IoIosTv } from "react-icons/io";
import Icon, { IconProps } from "./Icon";

const TV = (props: IconProps) => {
  const iconTrue = <IoIosTv />;
  const iconFalse = <IoMdTv />;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default TV;
