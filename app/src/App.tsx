import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import getHistory from 'react-router-global-history'; 
import MenuBar from "./components/MenuBar";
import HomePage, { HomePageState } from "./components/HomePage";
import ControlPage, { ControlPageState } from "./components/ControlPage";
import AnalysisPage, { AnalysisPageState } from "./components/AnalysisPage";
import { CallbackFunction, AnalysisObject, Event } from "./common/types";
import { processEventSourceError } from "./common/helpers";
import { START_SIMULATION_URL, SSE_URL } from "./common/constants";

type PageType = "home" | "control" | "analysis";
type AppProps = {};
type AppState = {
  currentPage : PageType,
  homePageState: HomePageState;
  controlPageState: ControlPageState;
  analysisPageState: AnalysisPageState;
};
class App extends React.Component<AppProps, AppState> {
  eventSource: EventSource;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      currentPage: "home",
      homePageState: HomePage.getInitialState(),
      controlPageState: ControlPage.getInitialState(),
      analysisPageState: AnalysisPage.getInitialState(),
    };
    this.eventSource = new EventSource(SSE_URL);
    this.processEvent = this.processEvent.bind(this);
    this.processAnalysis = this.processAnalysis.bind(this);
    this.setCurrentPage = this.setCurrentPage.bind(this);
    this.setHomePageState = this.setHomePageState.bind(this);
    this.setControlPageState = this.setControlPageState.bind(this);
    this.setAnalysisPageState = this.setAnalysisPageState.bind(this);
  }

  componentDidMount() {
    fetch(START_SIMULATION_URL);
    this.eventSource.addEventListener("event", this.processEvent, false);
    this.eventSource.addEventListener("analysis", this.processAnalysis, false);
    this.eventSource.addEventListener("error", processEventSourceError, false);
  }

  componentWillUnmount() {
    this.eventSource.close();
  }

  shouldComponentUpdate(nextProps : AppProps, nextState : AppState) {
    const history = getHistory();
    if (history.location.pathname === "/home" && nextState.homePageState !== this.state.homePageState) {
      return true
    }
    if (history.location.pathname === "/control" && nextState.controlPageState !== this.state.controlPageState) {
      return true
    }
    if (history.location.pathname === "/analysis/" && nextState.analysisPageState !== this.state.analysisPageState) {
      return true
    }
    return false;
  }

  processEvent(event) {
    var data: Event = JSON.parse(event.data);
    console.log("Received smart home event with data:", data);
    const { homePageState, controlPageState } = this.state;
    const valueType =
      typeof data.new_value === "number" ? "integer" : "boolean";
    if (homePageState[valueType][data.state_key] !== undefined)
      // Event is relevant to Home page
      this.setHomePageState({
        [valueType]: {
          ...homePageState[valueType],
          [data.state_key]: data.new_value,
        },
      });
    if (controlPageState[data.state_key] !== undefined)
      // Event is relevant to Control page
      this.setControlPageState({ [data.state_key]: data.new_value });
  }

  processAnalysis(analysis) {
    var data: AnalysisObject = JSON.parse(analysis.data);
    console.log("Received smart home analysis with data:", data);
    const { analysisPageState } = this.state;
    this.setAnalysisPageState({
      indoorTemp: data.indoorTemp,
      electricityUsage:
        analysisPageState.electricityUsage +
        data.utilityUsage.electricity.watts,
      electricityCost:
        analysisPageState.electricityCost +
        data.utilityUsage.electricity.dollars,
      waterUsage:
        analysisPageState.waterUsage + data.utilityUsage.water.gallons,
      waterCost: analysisPageState.waterCost + data.utilityUsage.water.dollars,
      totalUtilitiesCost:
        analysisPageState.totalUtilitiesCost + data.utilityUsage.totalDollars,
    });
  }

  setCurrentPage(page: PageType, callback?: CallbackFunction) {
    this.setState(
      { currentPage: page },
      callback
    );
  }

  setHomePageState(state: object, callback?: CallbackFunction) {
    this.setState(
      { homePageState: { ...this.state.homePageState, ...state } },
      callback
    );
  }

  setControlPageState(state: object, callback?: CallbackFunction) {
    this.setState(
      { controlPageState: { ...this.state.controlPageState, ...state } },
      callback
    );
  }

  setAnalysisPageState(state: object, callback?: CallbackFunction) {
    this.setState(
      { analysisPageState: { ...this.state.analysisPageState, ...state } },
      callback
    );
  }

  render() {
    return (
      <Router>
        <MenuBar setCurrentPage={this.setCurrentPage}/>
        <Switch>
          <Route
            exact
            path="/home"
            render={(props) => (
              <HomePage
                state={this.state.homePageState}
                setState={this.setHomePageState}
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/control"
            render={(props) => (
              <ControlPage
                state={this.state.controlPageState}
                setState={this.setControlPageState}
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/analysis"
            render={(props) => (
              <AnalysisPage
                state={this.state.analysisPageState}
                setState={this.setAnalysisPageState}
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
