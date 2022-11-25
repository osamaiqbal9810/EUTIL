import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
export const inspectionAssetStatusViewStyles = {
  container: { margin: "10px 15px", overflow: "scroll", height: "50vh" },
};

export const inspectionStatusDisplayTableStyles = {
  dataCell: { padding: "0px", height: "25px" },
  yAxisRowStyle: { height: "25px" },
  yAxisHeadingStyle: { background: "#fbfbfb", fontWeight: "100", minWidth: "280px", position: "sticky", left: "0px" },
  xAxisHeadingStyle: { minWidth: "120px", background: retroColors.fourth, position: "sticky", top: "0px" },
  tableStyle: { background: "var(--fifth)", marginBottom: "0px" },
  xAxisRowStyle: { height: "35px" },
  mainHeadingStyle: { width: "150px", background: retroColors.fourth, position: "sticky", top: "0px", left: "0px", zIndex: 10 },
};
