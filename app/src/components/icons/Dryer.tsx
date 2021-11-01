import { MdLocalLaundryService } from "react-icons/md";
import Icon, { IconProps } from "./Icon";

const Oven = (props: IconProps) => {
  const iconTrue = <MdLocalLaundryService color="yellow"/>;
  const iconFalse = <MdLocalLaundryService color="black"/>;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Oven;
