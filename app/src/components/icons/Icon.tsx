// To be used by components wrapping the AbstractIcon component
export type IconProps = {
  size?: string;
  label: string;
  value: boolean;
  onClick?: () => void;
};
export type AbstractIconProps = {
  iconTrue: any;
  iconFalse: any;
  size?: string;
  label: string;
  value: boolean;
  onClick?: () => void;
};
const AbstractIcon = (props: AbstractIconProps) => {
  const { iconTrue, iconFalse, size, label, value, onClick } = props;
  return (
    <span style={{ fontSize: size || "2rem" }} title={label} onClick={onClick}>
      {value ? iconTrue : iconFalse}
    </span>
  );
};
export default AbstractIcon;
