import React from "react";
import { GiWindow, GiWindowBars } from "react-icons/gi";

export type WindowProps = {
  label: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};
const Window = (props: WindowProps) => {
  const { label, open, setOpen } = props;
  let window;
  if (open) {
    window = (
        <GiWindow fontSize="2rem"/>
    );
  } else {
    window = (
        <GiWindowBars fontSize="2rem"/>
    );
  }
  return (
    <div title={label} onClick={() => setOpen(!open)}>
        {window}
    </div>
  );
};
export default Window;
