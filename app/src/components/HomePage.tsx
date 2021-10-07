import React from "react";
import Lightbulb from "./Lightbulb";

class HomePage extends React.Component {

    static getInitialState() {
        var initialState = {
            TODO: '',
        };

        return initialState;
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