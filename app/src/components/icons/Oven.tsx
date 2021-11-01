import { CgSmartHomeCooker } from "react-icons/cg";
import Icon, { IconProps } from "./Icon";

const Oven = (props: IconProps) => {
  const iconTrue = <CgSmartHomeCooker color="yellow"/>;
  const iconFalse = <CgSmartHomeCooker color="black"/>;
  return <Icon iconTrue={iconTrue} iconFalse={iconFalse} {...props} />;
};
export default Oven;
