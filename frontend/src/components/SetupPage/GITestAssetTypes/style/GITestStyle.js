import { basicColors, retroColors } from "../../../../style/basic/basicColors";
export const GITestStyle = {
  TopRowStyle: {
    default: {},
    retro: { backgroundColor: retroColors.eleventh, marginBottom: "30px" },
  },
  ListHeadingStyle: {
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
  cardBodyHeight: {
    default: {},
    retro: {
      height: "25vh",
      overflow: "auto",

    }
  },
  cardBodyHeader: {
    default: {},
    retro: {
      backgroundColor: retroColors.first,
      color: retroColors.fifth,
      fontWeight: "bold",
      letterSpacing: "1px"
    }
  },
  assetListStyle: {
    default: {},
    retro: {
      display: "inline-block",
      width: "100%",
      marginBottom: "5px",
      padding: "5px 10px",
      borderBottom: "1px solid",
      cursor: "pointer"
    }
  },
  iconPlus: {
    default: {},
    retro: {
      float: "right",
      cursor: "pointer"
    }
  }
};
