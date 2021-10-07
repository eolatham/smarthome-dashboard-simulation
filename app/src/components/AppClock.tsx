import React from "react";
import { processEventSourceError } from "../common/helpers";
import { SSE_URL } from "../common/constants";
import { Container, Row } from "react-bootstrap";
import { BsClock } from "react-icons/bs";


// TODO: add functionality to change app clock speed
type AppClockProps = {};
type AppClockState = {
  time: string;
  speed: number;
};
class AppClock extends React.Component<AppClockProps, AppClockState> {
  eventSource: EventSource;
  constructor(props: AppClockProps) {
    super(props);
    this.state = { time: null, speed: 0 };
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
      <Container className="m-2" style={{fontSize: "0.5em"}}>
        <b>Simulation Time</b>
        <Row>
          <BsClock fontSize="4em"/>
          <div style={{ whiteSpace: "pre-wrap" }}>{this.state.time}</div>
        </ Row>
      </Container>
      <Container className="m-2" style={{fontSize: "0.5em"}}>
        <b>Simulation Speed</b>
        <div style={{ fontSize: "3em", whiteSpace: "pre-wrap", borderStyle: "solid", borderColor: "black", backgroundColor: "white" }}>
          {Math.round(this.state.speed)} x
        </div>
      </Container>
      </>
    );
  }
}

export default AppClock;
