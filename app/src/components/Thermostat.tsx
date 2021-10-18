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
      <h1>Thermostat Control</h1>
      <div className="temp-container">
        <h2>Outdoor Temp</h2>
        <div className="temp">{outdoorTemp}</div>
      </div>
      <div className="temp-container">
        <h2>Indoor Temp</h2>
        <div className="temp">{indoorTemp}</div>
      </div>
      <div className="temp-container">
        <h2>Thermostat Temp</h2>
        <button
          className="chevron-up"
          onClick={(e) => onThermostatTempChange(thermostatTemp + 1)}
          disabled={thermostatTemp >= maxThermostatTemp}
        ></button>
        <div className="temp set-temp">{thermostatTemp}</div>
        <button
          className="chevron-down"
          onClick={(e) => onThermostatTempChange(thermostatTemp - 1)}
          disabled={thermostatTemp <= minThermostatTemp}
        ></button>
      </div>
    </div>
  );
};
export default Thermostat;
