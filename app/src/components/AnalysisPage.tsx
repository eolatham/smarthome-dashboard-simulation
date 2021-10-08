import React from "react";
import { SetStateFunction } from "../common/types";

export type AnalysisPageState = {
  indoorTemp: number;
  electricityUsage: number;
  electricityCost: number;
  waterUsage: number;
  waterCost: number;
  totalUtilitiesCost: number;
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
      indoorTemp: null,
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
        <h1>Analysis</h1>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(state, null, "\t")}
        </div>
      </div>
    );
  }
}
export default AnalysisPage;
