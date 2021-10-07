import React from "react";
import Lightbulb from "./Lightbulb";

class HomePage extends React.Component {
  static getInitialState() {
    return {}; // TODO
  }

    render() {
        return (        
        <div>
            <h1>Smart Home Dashboard Simulator</h1>
            <h4>(refresh page to restart simulation)</h4>
            <Lightbulb />
          </div>)
    }
}
export default HomePage;
