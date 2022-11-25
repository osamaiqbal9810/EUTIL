import { basicColors, retroColors, electricColors } from "style/basic/basicColors";

export const DashboardPageStyle = {
  headingRow: {
    default: { margin: "5px 7.5px 0px", color: basicColors.first },
    retro: { margin: "5px 7.5px 0px", color: retroColors.second, fontWeight: 600 },
    electric: { margin: "5px 7.5px 0px", color: electricColors.second, fontWeight: 600 },
  },
  tablesContainerRow: {
    default: { margin: "0px 0px 30px" },
  },
  mainContainerStyle: {
    default: {},
    retro: { padding: "0px 37.5px" },
    electric: { padding: "0px 37.5px" },
  },
};
