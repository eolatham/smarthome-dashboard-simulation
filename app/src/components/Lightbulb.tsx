import React from "react";
import { BsFillLightbulbFill } from "react-icons/bs";

type LightbulbProps = {};
type LightbulbState = { on: boolean };
class Lightbulb extends React.Component<LightbulbProps, LightbulbState> {
  constructor(props: LightbulbProps) {
    super(props);
    this.state = { on: false };
  }

  render() {
    return (
      <div
        onClick={() => {
          if (this.state.on) {
            this.setState({ on: false });
          } else {
            this.setState({ on: true });
          }
        }}
      >
        <BsFillLightbulbFill
          color={this.state.on ? "yellow" : "black"}
          fontSize="2rem"
        ></BsFillLightbulbFill>
      </div>
    );
  }
}

export default Lightbulb;
