import { MdLocalLaundryService } from "react-icons/md";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Oven = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<MdLocalLaundryService color="red" />}
    iconFalse={<MdLocalLaundryService color="black" />}
    labelTrue="on"
    labelFalse="off"
    {...props}
  />
);
export default Oven;
