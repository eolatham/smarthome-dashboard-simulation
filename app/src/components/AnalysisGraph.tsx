import React from "react";
import { Table, Col, Row } from "react-bootstrap";
import { SetStateFunction } from "../common/types";

export type AnalysisGraphState = {
  electricityUsage: number;
  electricityCost: number;
  waterUsage: number;
  waterCost: number;
  totalUtilitiesCost: number;
};
export type AnalysisGraphProps = {
  state: AnalysisGraphState;
  setState: SetStateFunction;
};
class AnalysisGraph extends React.Component<
  AnalysisGraphProps,
  AnalysisGraphState
> {
  static getInitialState(): AnalysisGraphState {
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
        <h1>Utility Usage Graph</h1>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(state, null, "\t")}
        </div>
      </div>
    );
  }
}
export default AnalysisGraph;
