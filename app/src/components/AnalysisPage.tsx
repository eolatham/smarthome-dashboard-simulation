import React from "react";
import { SetStateFunction } from "../common/types";
import AnalysisGraph from "./AnalysisGraph";
import AnalysisTable from "./AnalysisTable";

export type AnalysisPageState = {
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
        <div style={{ whiteSpace: "pre-wrap" }}>
          <AnalysisGraph
            state={this.state}
            setState={this.setState}
            {...this.props}
          />
          <AnalysisTable
            state={this.state}
            setState={this.setState}
            {...this.props}
          />
        </div>
      </div>
    );
  }
}
export default AnalysisPage;
