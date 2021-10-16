import React, {Component} from 'react';
import { 
    MAX_THERMOSTAT_TEMP, 
    MIN_THERMOSTAT_TEMP 
} from '../common/constants';
import './Thermostat.css';

export class Thermostat extends Component {
    state = {
        // TODO: Look into storing userTemp state into DB 
        userTemp: 72, //User controlled temperature

        outdoor: 78, // This needs to be from DB
        thermostat: 72 // This should also come from DB
    }

    ////// These are helper functions that provide functality to the buttons
    handleIncrement = () => { // Increase Temperature
        this.setState({ userTemp: this.state.userTemp + 1 });
    }
    handleDecrement = () => { // Decrease Temperature
        this.setState({ userTemp: this.state.userTemp - 1 });
    }
    disableHeat() { // Boolean: When value equals Max => disable heating button
        // eslint-disable-next-line eqeqeq
        return this.state.userTemp == MAX_THERMOSTAT_TEMP ? true : false;
    }
    disableCool() { // Boolean: When value equals Min => disable cooling button
        // eslint-disable-next-line eqeqeq
        return this.state.userTemp == MIN_THERMOSTAT_TEMP ? true : false;
    }

    /* TODO: Pull OutdoorTemp and ThermostatTemp from
             DB and store in respective placeholders
    */

    // TODO: Use helper function to trigger HVAC to respond to change in temp
    render() {
        return(
            <div className="Thermostat">
                <header><h1 style={{fontSize: "1.2em"}}>Thermostat Control</h1></header>
                <div className="TempContainer">
                    <header>
                        <h2 style={{fontSize: "1.2em"}}>Outdoor Temp</h2>
                    </header>
                    <div className="Temp">
                        <span>
                            {this.state.outdoor}
                        </span>
                    </div>
                </div>
                <div className="TempContainer">
                    <header>
                        <h2 style={{fontSize: '1.2em'}}>Indoor Temp</h2>
                    </header>
                    <div className="Temp">
                        <span>
                            {this.state.thermostat}
                        </span>
                    </div>
                </div>
                <div className="TempContainer">
                    <header><h2 style={{fontSize: "1.2em"}}>Thermostat Temp</h2></header>
                    <button className="ChevronUp" onClick={this.handleIncrement} disabled={this.disableHeat()} style={{outline: "none"}}></button>
                    <div className="Temp SetTemp">
                        <span>
                            {this.state.userTemp}
                        </span>
                    </div>
                    <button className="ChevronDown" onClick={this.handleDecrement} disabled={this.disableCool()} style={{outline: "none"}}>
                    </button>
                </div>
            </div>
        );
    }
}

export default Thermostat;
