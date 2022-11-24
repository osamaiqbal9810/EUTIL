/* eslint eqeqeq: 0 */
import { basicColors, retroColors } from "style/basic/basicColors";
import { getStatusColor } from "utils/statusColors.js";
export const statusStyle = {
  statusColorStyle: statusColorStyleMethod,
};
function statusColorStyleMethod(status, props) {
  return {
    default: {
      background: getStatusColor(status),
      fontSize: props.forDashboard ? "10px" : "12px",
      padding: props.forDashboard ? "0px" : "5px",
      textAlign: "center",
      margin: "15px",
      borderRadius: "4px",
      color: basicColors.fourth,
    },
    retro: {
      fontSize: props.forDashboard ? "10px" : "12px",
      padding: props.forDashboard ? "0px" : "5px",
      textAlign: "center",
      margin: "15px",
      borderRadius: "0px",
      color: retroColors.second,
      border: "1px solid" + getStatusColor(status),
      borderLeft: "6px Solid" + getStatusColor(status),
      borderImage: "none",
    },
  };
}
