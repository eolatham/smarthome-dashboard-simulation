import { ResponsiveLine } from "@nivo/line";

export type DataPoint = {
  x: number; // The time that this data point corresponds to in days
  y: number; // The total value for the time period between the previous data point and this one
};
export type AnalysisGraphProps = {
  title: string;
  yLabel: string;
  data: DataPoint[];
  averageY?: number;
  colorScheme?: "set1" | "set2" | "category10";
};
const AnalysisGraph = (props: AnalysisGraphProps) => {
  if (props.data.length === 0) return null;
  const timeFormat = " >-.2~f";
  const yFormat = " >-.2~f";
  const data = [{ id: props.title, data: props.data }];
  if (props.averageY !== undefined) {
    const minX = props.data[0].x;
    const maxX = props.data[props.data.length - 1].x;
    data.push({
      id: "Local Average",
      data: [
        { x: minX, y: props.averageY },
        { x: maxX, y: props.averageY },
      ],
    });
  }
  return (
    <div className="graph">
      <ResponsiveLine
        data={data}
        margin={{ top: 30, right: 165, bottom: 60, left: 80 }}
        xScale={{ type: "linear" }}
        yScale={{ type: "linear", stacked: false }}
        xFormat={timeFormat}
        yFormat={yFormat}
        axisTop={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: timeFormat,
          legend: "Time (days)",
          legendOffset: 40,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: yFormat,
          legend: props.yLabel,
          legendOffset: -60,
          legendPosition: "middle",
        }}
        enableGridX={true}
        curve="monotoneX"
        colors={{ scheme: props.colorScheme || "set1" }}
        lineWidth={2}
        enableArea={true}
        enablePoints={false}
        useMesh={false}
        animate={false}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 5,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 12,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
          },
        ]}
        theme={{
          background: "#ffffff",
          textColor: "#000000",
          fontSize: 14,
          axis: {
            domain: {
              line: {
                stroke: "#777777",
                strokeWidth: 1,
              },
            },
            ticks: {
              line: {
                stroke: "#777777",
                strokeWidth: 1,
              },
            },
          },
          grid: {
            line: {
              stroke: "#dddddd",
              strokeWidth: 1,
            },
          },
        }}
      />
    </div>
  );
};
export default AnalysisGraph;
