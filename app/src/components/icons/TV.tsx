import { IoMdTv, IoIosTv } from "react-icons/io";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const TV = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<IoIosTv color="green" />}
    iconFalse={<IoMdTv color="black" />}
    labelTrue="on"
    labelFalse="off"
    {...props}
  />
);
export default TV;
