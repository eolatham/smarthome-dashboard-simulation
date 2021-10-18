import React from "react";
import "./Thermostat.css";

export type ThermostatProps = {
  outdoorTemp: number;
  indoorTemp: number;
  thermostatTemp: number;
  minThermostatTemp: number;
  maxThermostatTemp: number;
  onThermostatTempChange: (newThermostatTemp: number) => void;
};
const Thermostat = (props: ThermostatProps) => {
  const {
    outdoorTemp,
    indoorTemp,
    thermostatTemp,
    minThermostatTemp,
    maxThermostatTemp,
    onThermostatTempChange,
  } = props;
  return (
    <div className="thermostat">
      <h2>Thermostat Control</h2>
      <hr />
      <h3>Outdoor Temp</h3>
      <div className="temp">{outdoorTemp}</div>
      <hr />
      <h3>Indoor Temp</h3>
      <div className="temp">{indoorTemp}</div>
      <hr />
      <h3>Thermostat Temp</h3>
      <button
        className="chevron-up"
        onClick={(e) => onThermostatTempChange(thermostatTemp + 1)}
        disabled={thermostatTemp >= maxThermostatTemp}
      ></button>
      <div className="temp my-3">{thermostatTemp}</div>
      <button
        className="chevron-down"
        onClick={(e) => onThermostatTempChange(thermostatTemp - 1)}
        disabled={thermostatTemp <= minThermostatTemp}
      ></button>
    </div>
  );
};
export default Thermostat;
