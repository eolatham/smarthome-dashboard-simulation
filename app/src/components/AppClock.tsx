import React from "react";
import { Container, Row } from "react-bootstrap";
import { BsClock } from "react-icons/bs";
import {
  processEventSourceError,
  getClockSpeedRequest,
  postClockSpeedRequest,
} from "../common/helpers";
import {
  SSE_URL,
  MIN_SPEEDUP_FACTOR,
  MAX_SPEEDUP_FACTOR,
} from "../common/constants";

type AppClockProps = {};
type AppClockState = {
  time: string;
  speed: number;
  lastSpeed: number;
  speedString: string;
};
class AppClock extends React.Component<AppClockProps, AppClockState> {
  eventSource: EventSource;
  constructor(props: AppClockProps) {
    super(props);
    this.state = { time: null, speed: 0, lastSpeed: 0, speedString: "0" };
    this.eventSource = new EventSource(SSE_URL);
    this.processEvent = this.processEvent.bind(this);
  }

  componentDidMount() {
    getClockSpeedRequest()
      .then((speed) => Math.round(speed))
      .then((speed) =>
        this.setState({
          speed: speed,
          lastSpeed: speed,
          speedString: String(speed),
        })
      );
    this.eventSource.addEventListener("time", this.processEvent, false);
    this.eventSource.addEventListener("error", processEventSourceError, false);
  }

  componentWillUnmount() {
    this.eventSource.close();
  }

  processEvent(event) {
    var data = JSON.parse(event.data);
    console.log("Received time event with data:", data);
    this.setState({ time: data.time });
  }

  render() {
    return (
      <>
        <Container className="m-2" style={{ fontSize: "0.5em" }}>
          <b>Simulation Time</b>
          <Row>
            <BsClock fontSize="4em" />
            <div style={{ whiteSpace: "pre-wrap" }}>{this.state.time}</div>
          </Row>
        </Container>
        <Container className="m-2" style={{ fontSize: "0.5em" }}>
          <b>Simulation Speed</b>
          <input
            style={{
              fontSize: "3em",
              borderStyle: "solid",
              borderColor: "black",
              backgroundColor: "white",
            }}
            title="Press enter to set new speed"
            type="number"
            step="1"
            min={MIN_SPEEDUP_FACTOR}
            max={MAX_SPEEDUP_FACTOR}
            value={this.state.speedString}
            onChange={(event) =>
              this.setState({
                speed: event.target.valueAsNumber,
                speedString: event.target.value,
              })
            }
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                let speed = this.state.speed;
                let lastSpeed = this.state.lastSpeed;
                if (speed === lastSpeed) return;
                if (isNaN(speed)) {
                  this.setState({
                    speed: lastSpeed,
                    speedString: String(lastSpeed),
                  });
                  return;
                }
                if (speed < MIN_SPEEDUP_FACTOR) speed = MIN_SPEEDUP_FACTOR;
                if (speed > MAX_SPEEDUP_FACTOR) speed = MAX_SPEEDUP_FACTOR;
                this.setState(
                  {
                    speed: speed,
                    lastSpeed: speed,
                    speedString: String(speed),
                  },
                  () => postClockSpeedRequest(speed)
                );
              }
            }}
          />
        </Container>
      </>
    );
  }
}

export default AppClock;
