import React from "react";
import { SetStateFunction } from "../common/types";
import AnalysisGraph, { DataPoint, AnalysisGraphMode } from "./AnalysisGraph";
import AnalysisTable, { RowData } from "./AnalysisTable";

export type AnalysisPageState = {
  // For graph
  graphMode: AnalysisGraphMode;
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
  setState: SetStateFunction;
};
class AnalysisPage extends React.Component<
  AnalysisPageProps,
  AnalysisPageState
> {
  static getInitialState(): AnalysisPageState {
    return {
      graphMode: "waterUsage",
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
    const { state, setState } = this.props;
    const {
      graphMode,
      waterUsageData,
      electricityUsageData,
      totalUtilitiesCostData,
      utilitiesDataLastDay,
      utilitiesDataLastWeek,
      utilitiesDataLastMonth,
    } = state;
    return (
      <div className="page-container my-3">
        <div className="page-section-column mx-3" style={{ width: "60%" }}>
          <h1>Utility Usage Graph</h1>
          <br />
          <AnalysisGraph
            mode={graphMode}
            setMode={(mode: AnalysisGraphMode) => setState({ graphMode: mode })}
            waterUsageData={waterUsageData}
            electricityUsageData={electricityUsageData}
            totalUtilitiesCostData={totalUtilitiesCostData}
          />
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
