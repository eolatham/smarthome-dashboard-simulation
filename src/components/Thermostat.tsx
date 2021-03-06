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
      <h3>Thermostat Control</h3>
      <hr />
      <h4>Outdoor Temp</h4>
      <div className="temp">{Math.round(outdoorTemp)}</div>
      <hr />
      <h4>Indoor Temp</h4>
      <div className="temp">{Math.round(indoorTemp)}</div>
      <hr />
      <h4>Thermostat Temp</h4>
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
