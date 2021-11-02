import { MdLocalLaundryService } from "react-icons/md";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Oven = (props: IconProps) => {
  const iconTrue = <MdLocalLaundryService color="red" />;
  const iconFalse = <MdLocalLaundryService color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Oven;
