import React from "react";
import { Table, Row, Col } from "react-bootstrap";
import {
  AVG_WATER_USAGE_RATE,
  AVG_ELECTRICITY_USAGE_RATE,
} from "../common/constants";

export type RowData = {
  waterUsage: number;
  electricityUsage: number;
  totalUtilitiesCost: number;
};

type PercentOfAverageProps = {
  utility: "water" | "electricity";
  value: number;
  days: number;
};
const PercentOfAverage = (props: PercentOfAverageProps) => {
  const { utility, value, days } = props;
  const avgRate =
    utility === "water" ? AVG_WATER_USAGE_RATE : AVG_ELECTRICITY_USAGE_RATE;
  const avgValue = days * avgRate;
  const percent = Math.round((value / avgValue) * 100);
  return (
    <div>
      <small
        style={{ color: value <= avgValue ? "green" : "red" }}
      >{`${percent}% of average`}</small>
    </div>
  );
};

type UtilitiesDataRowProps = {
  days: number;
  title: string;
  utilitiesData: RowData;
};
const UtilitiesDataRow = (props: UtilitiesDataRowProps) => {
  const { days, title, utilitiesData } = props;
  return (
    <Row>
      <Col>
        <h5>{title}</h5>
      </Col>
      <Col>
        <b>{Math.round(utilitiesData.waterUsage)} Gallons</b>
        <PercentOfAverage
          utility="water"
          value={utilitiesData.waterUsage}
          days={days}
        />
      </Col>
      <Col>
        <b>{Math.round(utilitiesData.electricityUsage)} Watts</b>
        <PercentOfAverage
          utility="electricity"
          value={utilitiesData.electricityUsage}
          days={days}
        />
      </Col>
      <Col>
        <b>${utilitiesData.totalUtilitiesCost.toFixed(2)}</b>
      </Col>
    </Row>
  );
};

export type AnalysisTableProps = {
  utilitiesDataLastDay: RowData;
  utilitiesDataLastWeek: RowData;
  utilitiesDataLastMonth: RowData;
};
const AnalysisTable = (props: AnalysisTableProps) => {
  const {
    utilitiesDataLastDay,
    utilitiesDataLastWeek,
    utilitiesDataLastMonth,
  } = props;
  // TODO: calculate projected utilities data for next month
  const utilitiesDataNextMonth: RowData = {
    waterUsage: 0,
    electricityUsage: 0,
    totalUtilitiesCost: 0,
  };
  return (
    <div>
      <h1>Utility Usage Table</h1>
      <Table style={{ textAlign: "center" }}>
        <Row>
          <Col></Col>
          <Col>
            <h4>Water Usage</h4>
          </Col>
          <Col>
            <h4>Power Usage</h4>
          </Col>
          <Col>
            <h4>Total Cost</h4>
          </Col>
        </Row>
        <UtilitiesDataRow
          days={1}
          title="Last Day"
          utilitiesData={utilitiesDataLastDay}
        />
        <UtilitiesDataRow
          days={7}
          title="Last Week"
          utilitiesData={utilitiesDataLastWeek}
        />
        <UtilitiesDataRow
          days={30}
          title="Last Month"
          utilitiesData={utilitiesDataLastMonth}
        />
        <UtilitiesDataRow
          days={30}
          title="Next Month (Projected)"
          utilitiesData={utilitiesDataNextMonth}
        />
      </Table>
    </div>
  );
};
export default AnalysisTable;
