import { retroColors } from "../../../style/basic/basicColors";

export const inspectionSwitchStatusStyle = {
  assetWithIcon: getAssetWithIconStyle,
  inspectionCell: getInspectionCell,
};

function getAssetWithIconStyle(status) {
  return { color: status == 1 ? retroColors.first : status == 2 ? "red" : "#ff9900", height: "25px", margin: "10px 0px" };
}

function getInspectionCell(color) {
  return { background: color, margin: "10px 5px", padding: "5px", textAlign: "center" };
}
