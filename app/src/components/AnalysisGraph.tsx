import React from "react";
import { ResponsiveLine } from "@nivo/line";

export type DataPoint = {
  x: string; // The time that this data point corresponds to
  y: number; // The total value for the time period between the previous data point and this one
};
export type AnalysisGraphProps = {
  waterUsageData: DataPoint[];
  electricityUsageData: DataPoint[];
  totalUtilitiesCostData: DataPoint[];
};
const AnalysisGraph = (props: AnalysisGraphProps) => {
  // TODO: use ResponsiveLine with data from props (https://nivo.rocks/line/canvas/)
  return (
    <div>
      <h1>Utility Usage Graph</h1>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(props, null, "\t")}
      </div>
    </div>
  );
};
export default AnalysisGraph;
