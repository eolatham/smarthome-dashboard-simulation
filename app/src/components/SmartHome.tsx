import React from "react";
import { Event, AnalysisObject } from "../common/types";
import { processEventSourceError } from "../common/helpers";
import { START_SIMULATION_URL, SSE_URL } from "../common/constants";

type SmartHomeProps = {};
type SmartHomeState = {
  events: Event[];
  indoorTemp: number;
  electricityUsage: number;
  electricityCost: number;
  waterUsage: number;
  waterCost: number;
  totalUtilitiesCost: number;
};
class SmartHome extends React.Component<SmartHomeProps, SmartHomeState> {
  eventSource: EventSource;
  constructor(props: SmartHomeProps) {
    super(props);
    this.state = {
      events: [],
      indoorTemp: null,
      electricityUsage: 0,
      electricityCost: 0,
      waterUsage: 0,
      waterCost: 0,
      totalUtilitiesCost: 0,
    };
    this.eventSource = new EventSource(SSE_URL);
    this.processEvent = this.processEvent.bind(this);
    this.processAnalysis = this.processAnalysis.bind(this);
  }

  componentDidMount() {
    fetch(START_SIMULATION_URL);
    this.eventSource.addEventListener("event", this.processEvent, false);
    this.eventSource.addEventListener("analysis", this.processAnalysis, false);
    this.eventSource.addEventListener("error", processEventSourceError, false);
  }

  componentWillUnmount() {
    this.eventSource.close();
  }

  processEvent(event) {
    var data: Event = JSON.parse(event.data);
    console.log("Received smart home event with data:", data);
    this.setState({ events: [...this.state.events, data] });
  }

  processAnalysis(analysis) {
    var data: AnalysisObject = JSON.parse(analysis.data);
    console.log("Received smart home analysis with data:", data);
    this.setState({
      indoorTemp: data.indoorTemp,
      electricityUsage:
        this.state.electricityUsage + data.utilityUsage.electricity.watts,
      electricityCost:
        this.state.electricityCost + data.utilityUsage.electricity.dollars,
      waterUsage: this.state.waterUsage + data.utilityUsage.water.gallons,
      waterCost: this.state.waterCost + data.utilityUsage.water.dollars,
      totalUtilitiesCost:
        this.state.totalUtilitiesCost + data.utilityUsage.totalDollars,
    });
  }

  render() {
    return (
      <>
        <h2>Smart Home</h2>

        <h3>Analysis</h3>
        <div>
          Indoor Temperature: {this.state.indoorTemp} degrees Fahrenheit
        </div>
        <div>Electricity Usage: {this.state.electricityUsage} watts</div>
        <div>Electricity Cost: {this.state.electricityCost} dollars</div>
        <div>Water Usage: {this.state.waterUsage} gallons</div>
        <div>Water Cost: {this.state.waterCost} dollars</div>
        <div>Total Utilities Cost: {this.state.totalUtilitiesCost} dollars</div>

        <h3>Events</h3>
        {this.state.events.map((event, i) => (
          <div key={i}>{JSON.stringify(event, null, 2)}</div>
        ))}
      </>
    );
  }
}

export default SmartHome;
