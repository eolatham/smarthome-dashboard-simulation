import React from "react";
import HomePage from "./components/HomePage";
import ControlPage from "./components/ControlPage";
import AnalysisPage from "./components/AnalysisPage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

type AppProps = {};
type AppState = {
  homeState: object;
  controlState: object;
  analysisState: object;
};
class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      homeState: HomePage.getInitialState(),
      controlState: ControlPage.getInitialState(),
      analysisState: AnalysisPage.getInitialState(),
    };
  }

  render() {
    const onPageUpdate = function (page, state, callback) {
      const tempState = { ...this.state[`${page}State`], ...state };
      this.setState(
        {
          [`${page}State`]: tempState,
        },
        callback
      );
    }.bind(this);

    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/home"
            render={(props) => (
              <HomePage
                setState={(state, callback) =>
                  onPageUpdate("home", state, callback)
                }
                state={this.state.homeState}
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/control"
            render={(props) => (
              <ControlPage
                setState={(state, callback) =>
                  onPageUpdate("control", state, callback)
                }
                state={this.state.controlState}
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/analysis"
            render={(props) => (
              <AnalysisPage
                setState={(state, callback) =>
                  onPageUpdate("analysis", state, callback)
                }
                state={this.state.analysisState}
                {...props}
              />
            )}
          />
          <Redirect to="/home" />
        </Switch>
      </Router>
    );
  }
}

export default App;
