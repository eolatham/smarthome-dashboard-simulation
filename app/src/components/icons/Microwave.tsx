import { MdMicrowave, MdOutlineMicrowave } from "react-icons/md";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Microwave = (props: IconProps) => {
  const iconTrue = <MdMicrowave color="red" />;
  const iconFalse = <MdOutlineMicrowave color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Microwave;
