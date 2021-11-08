import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import AnalysisGraph, { DataPoint } from "./AnalysisGraph";
import AnalysisTable, { RowData } from "./AnalysisTable";

export type AnalysisPageState = {
  // For graph
  waterUsageData: DataPoint[];
  electricityUsageData: DataPoint[];
  totalUtilitiesCostData: DataPoint[];
  // For table
  dataLength: number;
  dataIndexOneDayAgo: number;
  dataIndexOneWeekAgo: number;
  dataIndexOneMonthAgo: number;
  utilitiesDataLastDay: RowData;
  utilitiesDataLastWeek: RowData;
  utilitiesDataLastMonth: RowData;
};
export type AnalysisPageProps = {
  state: AnalysisPageState;
};
class AnalysisPage extends React.Component<
  AnalysisPageProps,
  AnalysisPageState
> {
  static getInitialState(): AnalysisPageState {
    return {
      waterUsageData: [],
      electricityUsageData: [],
      totalUtilitiesCostData: [],
      dataLength: 0,
      dataIndexOneDayAgo: 0,
      dataIndexOneWeekAgo: 0,
      dataIndexOneMonthAgo: 0,
      utilitiesDataLastDay: {
        waterUsage: 0,
        electricityUsage: 0,
        totalUtilitiesCost: 0,
      },
      utilitiesDataLastWeek: {
        waterUsage: 0,
        electricityUsage: 0,
        totalUtilitiesCost: 0,
      },
      utilitiesDataLastMonth: {
        waterUsage: 0,
        electricityUsage: 0,
        totalUtilitiesCost: 0,
      },
    };
  }

  render() {
    const {
      waterUsageData,
      electricityUsageData,
      totalUtilitiesCostData,
      utilitiesDataLastDay,
      utilitiesDataLastWeek,
      utilitiesDataLastMonth,
    } = this.props.state;
    // TODO Toggle between graphs
    let selectedGraph = "electricity";
    const electricityOnClick = () => {
      selectedGraph = "electricity";
    };
    const waterOnClick = () => {
      selectedGraph = "water";
    };
    const costOnClick = () => {
      selectedGraph = "cost";
    };
    return (
      <div className="page-container my-3">
        <div className="page-section-column mx-3" style={{ width: "60%" }}>
          <h1>Utility Usage Graph</h1>
          <br />
          <AnalysisGraph
            waterUsageData={waterUsageData}
            electricityUsageData={electricityUsageData}
            totalUtilitiesCostData={totalUtilitiesCostData}
            selectedGraph={selectedGraph}
          />
          <br />
          <ButtonGroup size="lg" aria-label="Basic example">
            <Button onClick={electricityOnClick} variant="secondary">
              Electricity
            </Button>
            <Button onClick={waterOnClick} variant="secondary">
              Water
            </Button>
            <Button onClick={costOnClick} variant="secondary">
              Cost
            </Button>
          </ButtonGroup>
        </div>
        <div className="page-section-column mx-3" style={{ width: "40%" }}>
          <h1>Utility Usage Table</h1>
          <br />
          <AnalysisTable
            utilitiesDataLastDay={utilitiesDataLastDay}
            utilitiesDataLastWeek={utilitiesDataLastWeek}
            utilitiesDataLastMonth={utilitiesDataLastMonth}
          />
        </div>
      </div>
    );
  }
}
export default AnalysisPage;
