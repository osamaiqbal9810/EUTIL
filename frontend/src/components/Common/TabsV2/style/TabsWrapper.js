import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
export const TabWrapperStyle = {
  tabCompStyle: {
    default: { backgroundColor: "#e3e9ef", borderRadius: "8px" },
    retro: { backgroundColor: "#e3e9ef", borderRadius: "0px" },
    electric: { backgroundColor: "#e3e9ef", borderRadius: "0px" },
  },
  dbLabelStyle: {
    default: {
      color: basicColors.fourth,
      backgroundColor: basicColors.first,
    },
    retro: {
      color: retroColors.second,
      backgroundColor: retroColors.fifth,
      borderWidth: "1px 1px 3px",
      borderStyle: "solid",
      borderColor: "rgb(216, 216, 216)",

      paddingTop: "10px",
      marginRight: "0",
    },
    electric: {
      color: electricColors.second,
      backgroundColor: electricColors.fifth,
      borderWidth: "1px 1px 3px",
      borderStyle: "solid",
      borderColor: "rgb(216, 216, 216)",

      paddingTop: "10px",
      marginRight: "0",
    },
  },
  barDisplayStyle: {
    default: { color: "var(--fifth)", fontSize: "12px", float: "right", padding: "5px 10px 0 0" },
    retro: { color: retroColors.second, fontSize: "12px", float: "right", padding: "5px 10px 0 0" },
    electric: { color: electricColors.second, fontSize: "12px", float: "right", padding: "5px 10px 0 0" },
  },
  summaryColor: {
    default: { color: basicColors.first },
    retro: { color: "" },
    electric: { color: "" },
  },
};
