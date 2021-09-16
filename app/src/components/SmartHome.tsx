import React from "react";
import { SmartHomeEvent } from "../common/types";
import { processEventSourceError } from "../common/helpers";
import { START_SIMULATION_URL, SSE_URL } from "../common/constants";

// TODO: implement actual smart home state and functionality
type SmartHomeProps = {};
type SmartHomeState = { events: SmartHomeEvent[] };
class SmartHome extends React.Component<SmartHomeProps, SmartHomeState> {
  eventSource: EventSource;
  constructor(props: SmartHomeProps) {
    super(props);
    this.state = { events: [] };
    this.eventSource = new EventSource(SSE_URL);
    this.processEvent = this.processEvent.bind(this);
  }

  componentDidMount() {
    fetch(START_SIMULATION_URL);
    this.eventSource.addEventListener("event", this.processEvent, false);
    this.eventSource.addEventListener("error", processEventSourceError, false);
  }

  componentWillUnmount() {
    this.eventSource.close();
  }

  processEvent(event) {
    var data = JSON.parse(event.data);
    console.log("Received smart home event with data:", data);
    this.setState({ events: [...this.state.events, data] });
  }

  render() {
    return (
      <>
        <h2>Smart Home</h2>
        {this.state.events.map((event) => (
          <div key={event.id}>Event: {JSON.stringify(event, null, 2)}</div>
        ))}
      </>
    );
  }
}

export default SmartHome;
