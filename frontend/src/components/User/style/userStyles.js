import { basicColors, retroColors } from "../../../style/basic/basicColors";
export const userStyles = {
  staffTopRowStyle: {
    default: {},
    retro: { backgroundColor: retroColors.eleventh },
  },
  staffListHeadingStyle: {
    default: {
      padding: "15px",
      textAlign: "left",
      fontWeight: "600",
      color: basicColors.first,
    },
    retro: {
      padding: "15px",
      textAlign: "left",
      fontWeight: "600",

      color: retroColors.second,
    },
  },
  addButtonIconStyle: {
    backgroundColor: {
      default: basicColors.first,
      retro: retroColors.first,
    },
    hoverBackground: {
      default: basicColors.fifth,
      retro: retroColors.first,
    },
    hoverBorder: {
      default: "1px solid " + basicColors.fifth,
      retro: "1px solid " + retroColors.first,
    },
  },

  staffListContainer: {
    default: {
      padding: "0px",
    },
    retro: { padding: "0px 15px", background: retroColors.eleventh },
  },
};
