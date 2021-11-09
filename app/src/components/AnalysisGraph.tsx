import { ButtonGroup, Button } from "react-bootstrap";
import { ResponsiveLine } from "@nivo/line";
import { useState } from "react";

export type DataPoint = {
  x: number; // The time that this data point corresponds to in days
  y: number; // The total value for the time period between the previous data point and this one
};
export type GraphProps = {
  id: string;
  legend: string;
  data: DataPoint[];
};
const Graph = (props: GraphProps) => {
  const timeFormat = " >-.2~f";
  const yFormat = " >-.2~s";
  return (
    <ResponsiveLine
      data={[
        {
          id: props.id,
          data: props.data,
        },
      ]}
      margin={{ top: 50, right: 150, bottom: 50, left: 75 }}
      xScale={{ type: "linear" }}
      yScale={{ type: "linear", stacked: true }}
      xFormat={timeFormat}
      yFormat={yFormat}
      axisTop={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: timeFormat,
        legend: "Time (Days)",
        legendOffset: 40,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: yFormat,
        legend: props.legend,
        legendOffset: -50,
        legendPosition: "middle",
      }}
      enableGridX={true}
      colors={{ scheme: "spectral" }}
      lineWidth={1}
      enablePoints={false}
      useMesh={false}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
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
  );
};

export type AnalysisGraphProps = {
  waterUsageData: DataPoint[];
  electricityUsageData: DataPoint[];
  totalUtilitiesCostData: DataPoint[];
};
const AnalysisGraph = (props: AnalysisGraphProps) => {
  type Mode = "waterUsage" | "electricityUsage" | "totalUtilitiesCost";
  const modes: Mode[] = [
    "waterUsage",
    "electricityUsage",
    "totalUtilitiesCost",
  ];
  const [selectedMode, setSelectedMode] = useState(modes[0]);

  const modeButtonVariant = (mode: Mode) =>
    selectedMode === mode ? "dark" : "outline-dark";

  const graphProps: { [Property in Mode]: GraphProps } = {
    waterUsage: {
      id: "Water Usage",
      legend: "Total Usage (Gallons)",
      data: props.waterUsageData,
    },
    electricityUsage: {
      id: "Electricity Usage",
      legend: "Total Usage (Watts)",
      data: props.electricityUsageData,
    },
    totalUtilitiesCost: {
      id: "Total Utilities Cost",
      legend: "Total Cost (USD)",
      data: props.totalUtilitiesCostData,
    },
  };

  return (
    <>
      <ButtonGroup size="lg">
        {modes.map((mode) => (
          <Button
            key={mode}
            onClick={() => setSelectedMode(mode)}
            variant={modeButtonVariant(mode)}
          >
            {graphProps[mode].id}
          </Button>
        ))}
      </ButtonGroup>
      <Graph {...graphProps[selectedMode]} />
    </>
  );
};
export default AnalysisGraph;
