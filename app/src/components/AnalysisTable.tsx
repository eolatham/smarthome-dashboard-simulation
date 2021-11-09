import { Table } from "react-bootstrap";
import NumberFormat from "react-number-format";
import {
  LOCAL_AVG_GALLONS_PER_DAY,
  LOCAL_AVG_WATTS_PER_DAY,
} from "../common/constants";

export type RowData = {
  waterUsage: number;
  electricityUsage: number;
  totalUtilitiesCost: number;
};

type PrettyNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  integer?: boolean;
};
const PrettyNumber = (props: PrettyNumberProps) => (
  <NumberFormat
    value={props.value}
    type="text"
    displayType="text"
    prefix={props.prefix}
    suffix={props.suffix}
    thousandSeparator={true}
    thousandsGroupStyle="thousand"
    decimalSeparator="."
    decimalScale={props.integer ? 0 : 2}
  />
);

type PercentOfAverageProps = {
  utility: "water" | "electricity";
  value: number;
  days: number;
};
const PercentOfAverage = (props: PercentOfAverageProps) => {
  const { utility, value, days } = props;
  const avgRate =
    utility === "water" ? LOCAL_AVG_GALLONS_PER_DAY : LOCAL_AVG_WATTS_PER_DAY;
  const avgValue = days * avgRate;
  const percent = Math.round((value / avgValue) * 100);
  return (
    <div>
      <small
        style={{ color: value <= avgValue ? "green" : "red" }}
      >{`${percent}% of local average`}</small>
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
          <PrettyNumber
            value={utilitiesData.waterUsage}
            suffix=" gallons"
            integer
          />
        </div>
        <PercentOfAverage
          utility="water"
          value={utilitiesData.waterUsage}
          days={days}
        />
      </th>
      <th>
        <div style={{ fontWeight: "bold" }}>
          <PrettyNumber
            value={utilitiesData.electricityUsage}
            suffix=" watts"
            integer
          />
        </div>
        <PercentOfAverage
          utility="electricity"
          value={utilitiesData.electricityUsage}
          days={days}
        />
      </th>
      <th>
        <div style={{ fontWeight: "bold" }}>
          <PrettyNumber value={utilitiesData.totalUtilitiesCost} prefix="$" />
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
