import React from "react";
import { SetStateFunction } from "../common/types";

export type AnalysisTableState = {
  electricityUsage: number;
  electricityCost: number;
  waterUsage: number;
  waterCost: number;
  totalUtilitiesCost: number;
};
export type AnalysisTableProps = {
  state: AnalysisTableState;
  setState: SetStateFunction;
};
class AnalysisTable extends React.Component<
  AnalysisTableProps,
  AnalysisTableState
> {
  static getInitialState(): AnalysisTableState {
    return {
      electricityUsage: 0,
      electricityCost: 0,
      waterUsage: 0,
      waterCost: 0,
      totalUtilitiesCost: 0,
    };
  }

  render() {
    const { state } = this.props;
    return (
      <div>
        <h1>Analysis Page</h1>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(state, null, "\t")}
        </div>
      </div>
    );
  }
}
export default AnalysisTable;
