import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { SetStateFunction } from "../common/types";
import {
  LOCAL_AVG_GALLONS_PER_PUBLISH_ANALYSIS_INTERVAL,
  LOCAL_AVG_WATTS_PER_PUBLISH_ANALYSIS_INTERVAL,
} from "../common/constants";
import AnalysisGraph, { DataPoint, AnalysisGraphProps } from "./AnalysisGraph";
import AnalysisTable, { RowData } from "./AnalysisTable";
import "./AnalysisPage.css";

export type AnalysisGraphMode =
  | "waterUsage"
  | "electricityUsage"
  | "totalUtilitiesCost";
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
    const modes: AnalysisGraphMode[] = [
      "waterUsage",
      "electricityUsage",
      "totalUtilitiesCost",
    ];
    const modeButtonVariant = (mode: AnalysisGraphMode) =>
      graphMode === mode ? "dark" : "outline-dark";
    const graphProps: { [Property in AnalysisGraphMode]: AnalysisGraphProps } =
      {
        waterUsage: {
          title: "Water Usage",
          yLabel: "Usage Rate (gallons)",
          data: waterUsageData,
          averageY: LOCAL_AVG_GALLONS_PER_PUBLISH_ANALYSIS_INTERVAL,
          colorScheme: "category10",
        },
        electricityUsage: {
          title: "Electricity Usage",
          yLabel: "Usage Rate (watts)",
          data: electricityUsageData,
          averageY: LOCAL_AVG_WATTS_PER_PUBLISH_ANALYSIS_INTERVAL,
          colorScheme: "set1",
        },
        totalUtilitiesCost: {
          title: "Total Utilities Cost",
          yLabel: "Cost Rate (dollars)",
          data: totalUtilitiesCostData,
          colorScheme: "set2",
        },
      };
    return (
      <div className="page-container my-3">
        <div className="page-section-column mx-3" style={{ width: "60%" }}>
          <div className="page-section-header">
            <h1>Utility Usage Graph</h1>
            <ButtonGroup size="lg">
              {modes.map((mode) => (
                <Button
                  key={mode}
                  onClick={() => setState({ graphMode: mode })}
                  variant={modeButtonVariant(mode)}
                >
                  {graphProps[mode].title}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <AnalysisGraph {...graphProps[graphMode]} />
        </div>
        <div className="page-section-column mx-3" style={{ width: "40%" }}>
          <div className="page-section-header">
            <h1>Utility Usage Table</h1>
          </div>
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
