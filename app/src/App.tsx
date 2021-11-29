import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import MenuBar from "./components/MenuBar";
import HomePage, { HomePageState } from "./components/HomePage";
import ControlPage, { ControlPageState } from "./components/ControlPage";
import AnalysisPage, { AnalysisPageState } from "./components/AnalysisPage";
import { RowData } from "./components/AnalysisTable";
import { CallbackFunction, AnalysisObject, Event } from './common/types';
import { processEventSourceError } from "./common/helpers";
import {
  START_SIMULATION_URL,
  SSE_URL,
  ANALYSIS_PUBLICATIONS_PER_DAY,
} from "./common/constants";

type AppProps = {};
type AppState = {
  homePageState: HomePageState;
  controlPageState: ControlPageState;
  analysisPageState: AnalysisPageState;
};
class App extends React.Component<AppProps, AppState> {
  eventSource: EventSource;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      homePageState: HomePage.getInitialState(),
      controlPageState: ControlPage.getInitialState(),
      analysisPageState: AnalysisPage.getInitialState(),
    };
    this.eventSource = new EventSource(SSE_URL);
    this.processEvent = this.processEvent.bind(this);
    this.processAnalysis = this.processAnalysis.bind(this);
    this.setSmartHomeState = this.setSmartHomeState.bind(this);
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
    // Reset state to avoid inaccurate calculations
    this.setState({
      homePageState: HomePage.getInitialState(),
      controlPageState: ControlPage.getInitialState(),
      analysisPageState: AnalysisPage.getInitialState(),
    });
  }

  processEvent(event) {
    var data: Event = JSON.parse(event.data);
    // console.log("Received smart home event with data:", data);
    this.setSmartHomeState({ [data.state_key]: data.new_value });
  }

  processAnalysis(analysis) {
    var data: AnalysisObject = JSON.parse(analysis.data);
    // console.log("Received smart home analysis with data:", data);

    // Update indoor temp value
    this.setSmartHomeState({ indoorTemp: data.indoorTemp });

    const {
      waterUsageData,
      electricityUsageData,
      totalUtilitiesCostData,
      dataLength: previousDataLength,
      dataIndexOneDayAgo: previousDataIndexOneDayAgo,
      dataIndexOneWeekAgo: previousDataIndexOneWeekAgo,
      dataIndexOneMonthAgo: previousDataIndexOneMonthAgo,
      utilitiesDataLastDay: previousUtilitiesDataLastDay,
      utilitiesDataLastWeek: previousUtilitiesDataLastWeek,
      utilitiesDataLastMonth: previousUtilitiesDataLastMonth,
      totalUtilitiesData,
    } = this.state.analysisPageState;
    console.log(data);
    // Update utility usage graph data
    waterUsageData.push({
      x: data.time,
      y: data.utilityUsage.water.gallons,
    });
    electricityUsageData.push({
      x: data.time,
      y: data.utilityUsage.electricity.watts,
    });
    totalUtilitiesCostData.push({
      x: data.time,
      y: data.utilityUsage.totalDollars,
    });

    // Update utility usage table data
    const newDataLength = previousDataLength + 1;
    const dataIndexNDaysAgo = (n: number): number =>
      Math.max(0, newDataLength - n * ANALYSIS_PUBLICATIONS_PER_DAY);
    const newDataIndexOneDayAgo = dataIndexNDaysAgo(1);
    const newDataIndexOneWeekAgo = dataIndexNDaysAgo(7);
    const newDataIndexOneMonthAgo = dataIndexNDaysAgo(30);
    const utilitiesData = (
      previousUtilitiesData: RowData,
      previousIndex: number,
      newIndex: number
    ): RowData => {
      var waterUsageToSubtract = 0;
      var electricityUsageToSubtract = 0;
      var totalUtilitiesCostToSubtract = 0;
      for (var i = previousIndex; i < newIndex; ++i) {
        waterUsageToSubtract += waterUsageData[i].y;
        electricityUsageToSubtract += electricityUsageData[i].y;
        totalUtilitiesCostToSubtract += totalUtilitiesCostData[i].y;
      }
      const waterUsageToAdd = data.utilityUsage.water.gallons;
      const electricityUsageToAdd = data.utilityUsage.electricity.watts;
      const totalUtilitiesCostToAdd = data.utilityUsage.totalDollars;
      return {
        waterUsage:
          previousUtilitiesData.waterUsage -
          waterUsageToSubtract +
          waterUsageToAdd,
        electricityUsage:
          previousUtilitiesData.electricityUsage -
          electricityUsageToSubtract +
          electricityUsageToAdd,
        totalUtilitiesCost:
          previousUtilitiesData.totalUtilitiesCost -
          totalUtilitiesCostToSubtract +
          totalUtilitiesCostToAdd,
      };
    };
    const newUtilitiesDataLastDay = utilitiesData(
      previousUtilitiesDataLastDay,
      previousDataIndexOneDayAgo,
      newDataIndexOneDayAgo
    );
    const newUtilitiesDataLastWeek = utilitiesData(
      previousUtilitiesDataLastWeek,
      previousDataIndexOneWeekAgo,
      newDataIndexOneWeekAgo
    );
    const newUtilitiesDataLastMonth = utilitiesData(
      previousUtilitiesDataLastMonth,
      previousDataIndexOneMonthAgo,
      newDataIndexOneMonthAgo
    );
    const newTotalUtilitiesData = {
      waterUsage: totalUtilitiesData.waterUsage + data.utilityUsage.water.gallons,
      electricityUsage: totalUtilitiesData.electricityUsage + data.utilityUsage.electricity.watts,
      totalUtilitiesCost: totalUtilitiesData.totalUtilitiesCost + data.utilityUsage.totalDollars,
    }
    const newProjectedData = {
      waterUsage: newTotalUtilitiesData.waterUsage * (30 / data.time),
      electricityUsage:  newTotalUtilitiesData.electricityUsage * (30 / data.time),
      totalUtilitiesCost: newTotalUtilitiesData.totalUtilitiesCost * (30 / data.time),
    };
    this.setAnalysisPageState({
      waterUsageData,
      electricityUsageData,
      totalUtilitiesCostData,
      dataLength: newDataLength,
      dataIndexOneDayAgo: newDataIndexOneDayAgo,
      dataIndexOneWeekAgo: newDataIndexOneWeekAgo,
      dataIndexOneMonthAgo: newDataIndexOneMonthAgo,
      utilitiesDataLastDay: newUtilitiesDataLastDay,
      utilitiesDataLastWeek: newUtilitiesDataLastWeek,
      utilitiesDataLastMonth: newUtilitiesDataLastMonth,
      totalUtilitiesData: newTotalUtilitiesData,
      projectedData: newProjectedData,
    });
  }

  /**
   * Sets state for the Home page and/or Control page.
   */
  setSmartHomeState(state: object, callback?: CallbackFunction) {
    var homePageState = this.state.homePageState;
    var controlPageState = this.state.controlPageState;
    Object.entries(state).forEach(([stateKey, newValue]) => {
      const stateType = typeof newValue === "number" ? "integer" : "boolean";
      if (homePageState[stateType][stateKey] !== undefined)
        // Event is relevant to Home page
        homePageState[stateType][stateKey] = newValue;
      if (controlPageState[stateKey] !== undefined)
        // Event is relevant to Control page
        controlPageState[stateKey] = newValue;
    });
    this.setState({ homePageState, controlPageState }, callback);
  }

  /**
   * Sets state for the Analysis page.
   */
  setAnalysisPageState(state: object, callback?: CallbackFunction) {
    var analysisPageState = this.state.analysisPageState;
    Object.entries(state).forEach(([stateKey, newValue]) => {
      if (analysisPageState[stateKey] !== undefined)
        analysisPageState[stateKey] = newValue;
    });
    this.setState({ analysisPageState }, callback);
  }

  render() {
    return (
      <Router>
        <MenuBar />
        <Switch>
          <Route
            exact
            path="/home"
            render={(props) => (
              <HomePage
                state={this.state.homePageState}
                setState={this.setSmartHomeState}
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
                setState={this.setSmartHomeState}
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
