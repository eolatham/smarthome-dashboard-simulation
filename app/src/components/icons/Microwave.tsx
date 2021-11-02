import { MdMicrowave, MdOutlineMicrowave } from "react-icons/md";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Microwave = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<MdMicrowave color="red" />}
    iconFalse={<MdOutlineMicrowave color="black" />}
    labelTrue="on"
    labelFalse="off"
    {...props}
  />
);
export default Microwave;
