import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
export const selectedTeamStyle = {
  detailInfoContainer: {
    default: {
      background: "var(--fifth)",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "0px 0px  0px 0px",
      padding: "15px",
      textAlign: "left",

      fontSize: "12px",
      color: basicColors.first,
    },
    retro: {
      background: "var(--fifth)",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "0px 0px  0px 0px",
      padding: "15px",
      textAlign: "left",
      fontSize: "12px",
      color: retroColors.second,
    },
    electric: {
      background: "var(--fifth)",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "0px 0px  0px 0px",
      padding: "15px",
      textAlign: "left",
      fontSize: "12px",
      color: electricColors.second,
    },
  },
};
