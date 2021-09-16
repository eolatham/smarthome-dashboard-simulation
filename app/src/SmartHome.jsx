import React from "react";
import { processEventSourceError } from "./helpers";
import { START_SIMULATION_URL, SSE_URL } from "./constants";

// TODO: implement actual smart home state and functionality
class SmartHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { events: [] };
    this.processEvent = this.processEvent.bind(this);
  }

  componentDidMount() {
    fetch(START_SIMULATION_URL);
    this.eventSource = new EventSource(SSE_URL);
    this.eventSource.addEventListener("event", this.processEvent, false);
    this.eventSource.addEventListener("error", processEventSourceError, false);
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
