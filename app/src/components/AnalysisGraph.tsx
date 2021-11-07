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
        //data={JSON.stringify(props, null, "\t")}
        data={[
          {
            id: "Water Usage (gal)",
            color: "hsl(310, 70%, 50%)",
            data: props.waterUsageData,
          },
          {
            id: "Electricity Usage (watts)",
            color: "hsl(240, 70%, 50%)",
            data: props.electricityUsageData,
          },
          {
            id: "Total Cost (USD)",
            color: "hsl(295, 70%, 50%)",
            data: props.totalUtilitiesCostData,
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
          legend: "Utility Usage",
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
export default AnalysisGraph;
