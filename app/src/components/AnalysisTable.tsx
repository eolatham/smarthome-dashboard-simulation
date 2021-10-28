import React from "react";

export type RowData = {
  waterUsage: number;
  electricityUsage: number;
  totalUtilitiesCost: number;
};
export type AnalysisTableProps = {
  utilitiesDataLastDay: RowData;
  utilitiesDataLastWeek: RowData;
  utilitiesDataLastMonth: RowData;
};
const AnalysisTable = (props: AnalysisTableProps) => {
  // TODO: calculate projected utilities data for next month
  const utilitiesDataNextMonth: RowData = {
    waterUsage: 0,
    electricityUsage: 0,
    totalUtilitiesCost: 0,
  };
  // TODO: render table with projected data and data from props
  return (
    <div>
      <h1>Utility Usage Table</h1>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify({ ...props, utilitiesDataNextMonth }, null, "\t")}
      </div>
    </div>
  );
};
export default AnalysisTable;
