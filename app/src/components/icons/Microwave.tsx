import { MdMicrowave, MdOutlineMicrowave } from "react-icons/md";
import Icon, { IconProps } from "./Icon";

const Microwave = (props: IconProps) => {
  const iconTrue = <MdMicrowave />;
  const iconFalse = <MdOutlineMicrowave />;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Microwave;
