import React from "react";
import { SetStateFunction } from "../common/types";
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
  setState: SetStateFunction;
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
    return (
      <div>
        <div style={{ whiteSpace: "pre-wrap" }}>
          <AnalysisGraph
            waterUsageData={waterUsageData}
            electricityUsageData={electricityUsageData}
            totalUtilitiesCostData={totalUtilitiesCostData}
          />
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
