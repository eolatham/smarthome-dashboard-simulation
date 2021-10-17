import React from "react";
import Switch from "@mui/material/Switch";
import { Row } from "react-bootstrap";
import { humanReadableStateKey } from "../common/helpers";
import { UserGeneratedBooleanStateKey } from "../common/types";

type SwitchRowProps = {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
const SwitchRow = (props: SwitchRowProps) => (
  <Row className="m-0 p-0">
    <span
      className="ml-1"
      style={{
        display: "flex",
        alignItems: "center",
        marginRight: "auto",
      }}
    >
      {props.label}
    </span>
    <Switch checked={props.checked} onChange={props.onChange} />
  </Row>
);

export type SwitchGroupProps = {
  title: string;
  state: object;
  onChange: (
    stateKeys: UserGeneratedBooleanStateKey[],
    newValue: boolean
  ) => void;
  stateKeysMap: {
    // Subgroup state key prefix: subgroup state key suffixes
    [key: string]: string[];
  };
};
const SwitchGroup = (props: SwitchGroupProps) => {
  const { title, state, onChange, stateKeysMap } = props;
  var allStateKeys = [];
  Object.entries(stateKeysMap).forEach(([prefix, suffixes]) =>
    suffixes.forEach((suffix) => allStateKeys.push(prefix + suffix))
  );
  const allStateKeysSwitch = (
    <SwitchRow
      label={`All ${title}`}
      checked={allStateKeys.reduce(
        (checked, stateKey) => checked && state[stateKey],
        true
      )}
      onChange={(e) => onChange(allStateKeys, e.target.checked)}
    />
  );
  return (
    <div className="mx-4 my-2 p-0">
      <h5 className="mb-3">{title}</h5>
      {allStateKeysSwitch}
      {Object.entries(stateKeysMap).map(([prefix, suffixes], index) => (
        <div key={index} className="mb-4">
          {prefix ? (
            <h6 className="mt-3">{humanReadableStateKey(prefix)}</h6>
          ) : null}
          {suffixes.map((suffix, index) => {
            const stateKey = (prefix + suffix) as UserGeneratedBooleanStateKey;
            return (
              <SwitchRow
                key={index}
                label={humanReadableStateKey(suffix)}
                checked={state[stateKey]}
                onChange={(e) => onChange([stateKey], e.target.checked)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
export default SwitchGroup;
