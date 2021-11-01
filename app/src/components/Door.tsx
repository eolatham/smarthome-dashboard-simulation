import React from "react";
import { RiDoorClosedFill, RiDoorOpenFill } from "react-icons/ri";

export type DoorProps = {
  label: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};
const Door = (props: DoorProps) => {
  const { label, open, setOpen } = props;
  let door;
  if (open) {
    door = (
        <RiDoorOpenFill fontSize="2rem"/>
    );
  } else {
    door = (
        <RiDoorClosedFill fontSize="2rem"/>
    );
  }
  return (
    <div title={label} onClick={() => setOpen(!open)}>
        {door}
    </div>
  );
};
export default Door;
