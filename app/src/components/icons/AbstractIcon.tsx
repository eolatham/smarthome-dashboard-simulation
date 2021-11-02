// To be used by components wrapping the AbstractIcon component
export type IconProps = {
  size?: string;
  label: string;
  className: string;
  value: boolean;
  onClick?: () => void;
};
type AbstractIconProps = {
  iconTrue: any;
  iconFalse: any;
  size?: string;
  label: string;
  className: string;
  value: boolean;
  onClick?: () => void;
};
const AbstractIcon = (props: AbstractIconProps) => {
  const { iconTrue, iconFalse, size, label, className, value, onClick } = props;
  return (
    <span
      className={className}
      style={{
        fontSize: size || "2rem",
        cursor: onClick ? "pointer" : "default",
      }}
      title={label}
      onClick={onClick}
    >
      {value ? iconTrue : iconFalse}
    </span>
  );
};
export default AbstractIcon;
