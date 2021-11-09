import { ResponsiveLine } from "@nivo/line";

export type DataPoint = {
  x: number; // The time that this data point corresponds to in days
  y: number; // The total value for the time period between the previous data point and this one
};
export type AnalysisGraphProps = {
  waterUsageData: DataPoint[];
  electricityUsageData: DataPoint[];
  totalUtilitiesCostData: DataPoint[];
  selectedGraph: string;
};

export type GraphComponentProps = {
  data: DataPoint[];
  id: string;
  legend: string;
};
const GraphComponent = (props: GraphComponentProps) => {
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
      <ResponsiveLine
        data={[
          {
            id: props.id,
            data: props.data,
          },
        ]}
        margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
        xScale={{ type: "linear" }}
        xFormat=" >-"
        yScale={{ type: "linear", stacked: true }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={{
          //tickValues: [0, 500, 1000, 1500, 2000, 2500],
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: ".2s",
          legend: "",
          legendOffset: 0,
        }}
        axisBottom={{
          //tickValues: [0, 20, 40, 60, 80, 100, 120],
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: ".2f",
          legend: "Time",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          //tickValues: [0, 500, 1000, 1500, 2000, 2500],
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: ".2s",
          legend: props.legend,
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={false}
        colors={{ scheme: "spectral" }}
        lineWidth={1}
        enablePoints={false}
        pointSize={4}
        pointColor={{ theme: "background" }}
        pointBorderWidth={1}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        //gridXValues={[0, 20, 40, 60, 80, 100, 120]}
        //gridYValues={[0, 500, 1000, 1500, 2000, 2500]}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 140,
            translateY: 0,
            itemsSpacing: 2,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 12,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

const AnalysisGraph = (props: AnalysisGraphProps) => {
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
      {props.selectedGraph === "electricity" && (
        <GraphComponent
          data={props.electricityUsageData}
          id="Electricity Usage"
          legend="Total Usage (Watts)"
        ></GraphComponent>
      )}
      {props.selectedGraph === "water" && (
        <GraphComponent
          data={props.waterUsageData}
          id="Water Usage"
          legend="Total Usage (Gallons)"
        ></GraphComponent>
      )}
      {props.selectedGraph === "cost" && (
        <GraphComponent
          data={props.electricityUsageData}
          id="Total Utilities Cost"
          legend="Total Cost (USD)"
        ></GraphComponent>
      )}
    </div>
  );
};
export default AnalysisGraph;
