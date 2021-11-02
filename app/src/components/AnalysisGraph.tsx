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
    <div
      style={{
        width: "100%",
        height: "500px",
        overflowY: "scroll",
        backgroundColor: "#eeeeeeee",
        whiteSpace: "pre-wrap",
      }}
    >
      {JSON.stringify(props, null, "\t")}
    </div>
  );
};
export default AnalysisGraph;
