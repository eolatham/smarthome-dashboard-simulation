import { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { ResponsiveLine } from "@nivo/line";
import {
  LOCAL_AVG_GALLONS_PER_PUBLISH_ANALYSIS_INTERVAL,
  LOCAL_AVG_WATTS_PER_PUBLISH_ANALYSIS_INTERVAL,
} from "../common/constants";

export type DataPoint = {
  x: number; // The time that this data point corresponds to in days
  y: number; // The total value for the time period between the previous data point and this one
};
export type YOverTimeGraphProps = {
  title: string;
  yLabel: string;
  data: DataPoint[];
  averageY?: number;
  colorScheme?: "set1" | "set2" | "category10";
};
const YOverTimeGraph = (props: YOverTimeGraphProps) => {
  if (props.data.length === 0) return null;
  const timeFormat = " >-.2~f";
  const yFormat = " >-.2~s";
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
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 150, bottom: 50, left: 75 }}
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
        legend: "Time (Days)",
        legendOffset: 40,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: yFormat,
        legend: props.yLabel,
        legendOffset: -50,
        legendPosition: "middle",
      }}
      enableGridX={true}
      colors={{ scheme: props.colorScheme || "set1" }}
      lineWidth={1}
      enableArea={true}
      enablePoints={false}
      useMesh={false}
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
          symbolBorderColor: "rgba(0, 0, 0, .5)",
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

  const graphProps: { [Property in Mode]: YOverTimeGraphProps } = {
    waterUsage: {
      title: "Water Usage",
      yLabel: "Usage Rate (Gallons)",
      data: props.waterUsageData,
      averageY: LOCAL_AVG_GALLONS_PER_PUBLISH_ANALYSIS_INTERVAL,
      colorScheme: "category10",
    },
    electricityUsage: {
      title: "Electricity Usage",
      yLabel: "Usage Rate (Watts)",
      data: props.electricityUsageData,
      averageY: LOCAL_AVG_WATTS_PER_PUBLISH_ANALYSIS_INTERVAL,
      colorScheme: "set1",
    },
    totalUtilitiesCost: {
      title: "Total Utilities Cost",
      yLabel: "Cost Rate (Dollars)",
      data: props.totalUtilitiesCostData,
      colorScheme: "set2",
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
            {graphProps[mode].title}
          </Button>
        ))}
      </ButtonGroup>
      <YOverTimeGraph {...graphProps[selectedMode]} />
    </>
  );
};
export default AnalysisGraph;
