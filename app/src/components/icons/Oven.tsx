import { CgSmartHomeCooker } from "react-icons/cg";
import AbstractIcon, { IconProps } from "./AbstractIcon";

const Oven = (props: IconProps) => (
  <AbstractIcon
    iconTrue={<CgSmartHomeCooker color="red" />}
    iconFalse={<CgSmartHomeCooker color="black" />}
    labelTrue="on"
    labelFalse="off"
    {...props}
  />
);
export default Oven;
