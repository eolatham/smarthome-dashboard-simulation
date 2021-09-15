import React from "react";
import { START_SIMULATION_URL, EVENT_STREAM_URL } from "./constants";

class EventStream extends React.Component {
  constructor(props) {
    super(props);
    this.state = { events: [] };
    this.processEvent = this.processEvent.bind(this);
    this.processError = this.processError.bind(this);
  }

  componentDidMount() {
    fetch(START_SIMULATION_URL);
    this.eventSource = new EventSource(EVENT_STREAM_URL);
    this.eventSource.addEventListener("event", this.processEvent, false);
    this.eventSource.addEventListener("error", this.processError, false);
  }

  processEvent(event) {
    var data = JSON.parse(event.data);
    console.log("Received event with data:", data);
    this.setState({ events: [...this.state.events, data] });
  }

  processError(error) {
    console.log("Error: " + error);
    alert("Failed to connect to event stream. Is Redis running?");
  }

  render() {
    return (
      <>
        <h2>Event Stream</h2>
        {this.state.events.map((event) => (
          <div key={event.id}>{JSON.stringify(event, null, 2)}</div>
        ))}
      </>
    );
  }
}

export default EventStream;
