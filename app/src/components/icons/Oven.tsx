import { CgSmartHomeCooker } from "react-icons/cg";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Oven = (props: IconProps) => {
  const iconTrue = <CgSmartHomeCooker color="red" />;
  const iconFalse = <CgSmartHomeCooker color="black" />;
  return <AbstractIcon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Oven;
