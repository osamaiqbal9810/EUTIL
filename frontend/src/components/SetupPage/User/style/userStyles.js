import { basicColors, retroColors, electricColors } from "../../../../style/basic/basicColors";
export const userStyles = {
  staffTopRowStyle: {
    default: {},
    retro: { backgroundColor: retroColors.eleventh },

    electric: { backgroundColor: retroColors.eleventh },
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
    electric: {
      padding: "15px",
      textAlign: "left",
      fontWeight: "600",

      color: electricColors.second,
    },
  },
  addButtonIconStyle: {
    backgroundColor: {
      default: basicColors.first,
      retro: retroColors.first,
      electric: electricColors.first,
    },
    hoverBackground: {
      default: basicColors.fifth,
      retro: retroColors.first,
      electric: electricColors.first,
    },
    hoverBorder: {
      default: "1px solid " + basicColors.fifth,
      retro: "1px solid " + retroColors.first,
      electric: "1px solid " + electricColors.first,
    },
  },

  staffListContainer: {
    default: {
      padding: "0px",
    },
    retro: { padding: "0px 15px", background: retroColors.eleventh },
    electric: { padding: "0px 15px", background: electricColors.eleventh },
  },
};
