import { commonStyles } from "../../../theme/commonStyles";
import { basicColors, retroColors } from "style/basic/basicColors";
export const commonStylesDashboard = {
  summaryHeading: {
    default: { margin: "5px 0px 5px", color: basicColors.first, padding: "0px 7.5px" },
    retro: { margin: "5px 0px 5px", color: retroColors.second, padding: "0px 7.5px", fontWeight: 600 },
  },
  tableHeadings: {
    default: { margin: "5px -15px", color: basicColors.first },
    retro: { margin: "5px -15px", color: retroColors.second, fontWeight: 600 },
  },
  zeroMarginRow: commonStyles.zeroMarginRow,
  zeroPaddingCol: commonStyles.zeroPaddingCol,
  innerContainerCol: {
    default: { padding: "0px 7.5px" },
  },
  tableContainerMargin: {
    default: { margin: "10px  0px" },
  },
};
