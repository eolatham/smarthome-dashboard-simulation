import React from "react";
import { processEventSourceError } from "../common/helpers";
import { SSE_URL } from "../common/constants";

// TODO: add functionality to change app clock speed
type AppClockProps = {};
type AppClockState = {
  relativeTime: number;
  absoluteTime: string;
  speed: number;
};
class AppClock extends React.Component<AppClockProps, AppClockState> {
  eventSource: EventSource;
  constructor(props: AppClockProps) {
    super(props);
    this.state = { relativeTime: 0, absoluteTime: null, speed: 0 };
    this.eventSource = new EventSource(SSE_URL);
    this.processEvent = this.processEvent.bind(this);
  }

  componentDidMount() {
    this.eventSource.addEventListener("time", this.processEvent, false);
    this.eventSource.addEventListener("error", processEventSourceError, false);
  }

  componentWillUnmount() {
    this.eventSource.close();
  }

  processEvent(event) {
    var data = JSON.parse(event.data);
    console.log("Received time event with data:", data);
    this.setState({ ...data });
  }

  render() {
    return (
      <>
        <h2>App Clock</h2>
        <h3>Relative Time: {Math.round(this.state.relativeTime)} seconds</h3>
        <h3>Absolute Time:</h3>
        <div style={{ whiteSpace: "pre-wrap" }}>{this.state.absoluteTime}</div>
        <h3>Speed: {Math.round(this.state.speed)} x real time</h3>
      </>
    );
  }
}

export default AppClock;
