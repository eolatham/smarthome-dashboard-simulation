import React from "react";
import { processEventSourceError } from "./helpers";
import { SSE_URL } from "./constants";

// TODO: add functionality to change app clock speed
class AppClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time: null, speed: null };
    this.processEvent = this.processEvent.bind(this);
  }

  componentDidMount() {
    this.eventSource = new EventSource(SSE_URL);
    this.eventSource.addEventListener("time", this.processEvent, false);
    this.eventSource.addEventListener("error", processEventSourceError, false);
  }

  processEvent(event) {
    var data = JSON.parse(event.data);
    console.log("Received time event with data:", data);
    this.setState({ time: data.time, speed: data.speed });
  }

  render() {
    return (
      <>
        <h2>App Clock</h2>
        <h3>Time: {Math.round(this.state.time)} seconds</h3>
        <h3>Speed: {Math.round(this.state.speed)} x the speed of real time</h3>
      </>
    );
  }
}

export default AppClock;
