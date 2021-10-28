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
import { CallbackFunction, AnalysisObject, Event } from "./common/types";
import { processEventSourceError } from "./common/helpers";
import {
  START_SIMULATION_URL,
  SSE_URL,
  PUBLISH_ANALYSIS_INTERVAL,
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
    this.setHomePageState = this.setHomePageState.bind(this);
    this.setHomePageIntegerState = this.setHomePageIntegerState.bind(this);
    this.setHomePageBooleanState = this.setHomePageBooleanState.bind(this);
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

    // Update indoor temp value
    this.setHomePageIntegerState({ indoorTemp: data.indoorTemp });

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
    } = this.state.analysisPageState;

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
      Math.max(
        0,
        newDataLength - (n * 24 * 60 * 60) / PUBLISH_ANALYSIS_INTERVAL
      );
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
    });
  }

  setHomePageState(state: object, callback?: CallbackFunction) {
    this.setState(
      { homePageState: { ...this.state.homePageState, ...state } },
      callback
    );
  }

  setHomePageIntegerState(integerState: object, callback?: CallbackFunction) {
    this.setHomePageState(
      { integer: { ...this.state.homePageState.integer, ...integerState } },
      callback
    );
  }

  setHomePageBooleanState(booleanState: object, callback?: CallbackFunction) {
    this.setHomePageState(
      { boolean: { ...this.state.homePageState.boolean, ...booleanState } },
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
        <MenuBar />
        <Switch>
          <Route
            exact
            path="/home"
            render={(props) => (
              <HomePage
                state={this.state.homePageState}
                setState={this.setHomePageState}
                setIntegerState={this.setHomePageIntegerState}
                setBooleanState={this.setHomePageBooleanState}
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
