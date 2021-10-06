import React from "react";

class ControlPage extends React.Component {

    static getInitialState() {
        var initialState = {
            TODO: '',
        };

        return initialState;
    }

    render() {
        return (        
        <div>
            <h1>Control Page</h1>
        </div>)
    }
}
export default ControlPage;