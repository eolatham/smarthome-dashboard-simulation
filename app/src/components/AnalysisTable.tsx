import React from "react";
import { Table, Col, Row } from "react-bootstrap";
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

  static calcDaily(): void {}
  static calcWeekly(): void {}
  static calcMonthly(): void {}

  render() {
    const { state } = this.props;
    return (
      <div>
        <h1>Utility Usage Table</h1>
        <Table>
          <Row>Utility Usage</Row>
          <Row>
            <Col>&nbsp</Col>
            <Col>Power Usage</Col>
            <Col>Water Usage</Col>
            <Col>Total Cost</Col>
          </Row>
          <Row>
            <Col>Last Day</Col>
            <Col>{state.electricityUsage} Watts</Col>
            <Col>{state.waterUsage} Gals</Col>
            <Col>{state.totalUtilitiesCost} Dollars</Col>
          </Row>
          <Row>
            <Col>Last Week</Col>
            <Col>{state.electricityUsage} Watts</Col>
            <Col>{state.waterUsage} Gals</Col>
            <Col>{state.totalUtilitiesCost} Dollars</Col>
          </Row>
          <Row>
            <Col>Last Month</Col>
            <Col>{state.electricityUsage} Watts</Col>
            <Col>{state.waterUsage} Gals</Col>
            <Col>{state.totalUtilitiesCost} Dollars</Col>
          </Row>
          <Row>
            <Col>Next Month (Projected)</Col>
            <Col>{state.electricityUsage} Watts</Col>
            <Col>{state.waterUsage} Gals</Col>
            <Col>{state.totalUtilitiesCost} Dollars</Col>
          </Row>
        </Table>
      </div>
    );
  }
}
export default AnalysisTable;
