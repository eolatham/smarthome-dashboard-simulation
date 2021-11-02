import { OverlayTrigger, Tooltip } from "react-bootstrap";

// To be used by components wrapping the AbstractIcon component
export type IconProps = {
  className?: string;
  value: boolean;
  size?: string;
  tooltipMessage: string;
  onClick?: () => void;
};
type AbstractIconProps = {
  className?: string;
  value: boolean;
  iconTrue: any;
  iconFalse: any;
  size?: string;
  labelTrue: string;
  labelFalse: string;
  tooltipMessage: string;
  hoverTitle?: string;
  onClick?: () => void;
};
const AbstractIcon = (props: AbstractIconProps) => {
  const {
    className,
    value,
    iconTrue,
    iconFalse,
    size,
    labelTrue,
    labelFalse,
    tooltipMessage,
    hoverTitle,
    onClick,
  } = props;
  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 100, hide: 200 }}
      overlay={(props) => (
        <Tooltip id="icon-tooltip" {...props}>
          {tooltipMessage}
        </Tooltip>
      )}
    >
      <span
        className={className}
        style={{
          fontSize: size || "2rem",
          cursor: onClick ? "pointer" : "default",
        }}
        title={hoverTitle}
        onClick={onClick}
      >
        {value ? iconTrue : iconFalse}
        <div style={{ fontSize: "0.75rem" }}>
          {value ? labelTrue : labelFalse}
        </div>
      </span>
    </OverlayTrigger>
  );
};
export default AbstractIcon;
