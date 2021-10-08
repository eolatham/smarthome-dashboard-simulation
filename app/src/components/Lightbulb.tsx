import React from "react";
import { BsFillLightbulbFill } from "react-icons/bs";

class Lightbulb extends React.Component {
  constructor(props) {
    super(props);
    this.state = { on: false };
  }

  render() {
    return (
      <div
        onClick={() => {
          if (this.state["on"]) {
            this.setState({ on: false });
          } else {
            this.setState({ on: true });
          }
        }}
      >
        <BsFillLightbulbFill
          color={this.state["on"] ? "yellow" : "black"}
          fontSize="2rem"
        ></BsFillLightbulbFill>
      </div>
    );
  }
}

export default Lightbulb;
