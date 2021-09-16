import React from "react";
import { processEventSourceError } from "../common/helpers";
import { SSE_URL } from "../common/constants";

// TODO: add functionality to change app clock speed
type AppClockProps = {};
type AppClockState = { time: number; speed: number };
class AppClock extends React.Component<AppClockProps, AppClockState> {
  eventSource: EventSource;
  constructor(props: AppClockProps) {
    super(props);
    this.state = { time: 0, speed: 0 };
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
    this.setState({ time: data.time, speed: data.speed });
  }

  render() {
    return (
      <>
        <h2>App Clock</h2>
        <h3>Time: {Math.round(this.state.time)} seconds</h3>
        <h3>Speed: {Math.round(this.state.speed)} x real time</h3>
      </>
    );
  }
}

export default AppClock;