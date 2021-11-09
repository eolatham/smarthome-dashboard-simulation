import { Table } from "react-bootstrap";
import {
  AVG_WATER_USAGE_RATE,
  AVG_ELECTRICITY_USAGE_RATE,
} from "../common/constants";
import "./AnalysisTable.css";

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
    <tr>
      <th>
        <h5>{title}</h5>
      </th>
      <th>
        <div style={{ fontWeight: "bold" }}>
          {Math.round(utilitiesData.waterUsage)} gallons
        </div>
        <PercentOfAverage
          utility="water"
          value={utilitiesData.waterUsage}
          days={days}
        />
      </th>
      <th>
        <div style={{ fontWeight: "bold" }}>
          {Math.round(utilitiesData.electricityUsage)} watts
        </div>
        <PercentOfAverage
          utility="electricity"
          value={utilitiesData.electricityUsage}
          days={days}
        />
      </th>
      <th>
        <div style={{ fontWeight: "bold" }}>
          ${utilitiesData.totalUtilitiesCost.toFixed(2)}
        </div>
      </th>
    </tr>
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
    <Table bordered>
      <thead>
        <tr>
          <th>
            <h4>Timeframe</h4>
          </th>
          <th>
            <h4>Water Usage</h4>
          </th>
          <th>
            <h4>Power Usage</h4>
          </th>
          <th>
            <h4>Total Cost</h4>
          </th>
        </tr>
      </thead>
      <tbody>
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
      </tbody>
    </Table>
  );
};
export default AnalysisTable;
