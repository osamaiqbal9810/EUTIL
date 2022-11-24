import { retroColors, basicColors } from "../../../style/basic/basicColors";
export const allMemberStyle = {
  tableHeading: {
    default: {
      margin: "5px 0px 5px",
      color: basicColors.first,
    },
    retro: {
      margin: "5px 0px 5px",
      color: retroColors.second,
      fontWeight: 600,
    },
  },
  userHeading: {
    default: {
      color: basicColors.first,
      fontSize: "14px",
      paddingBottom: "1em",
    },
    retro: {
      color: retroColors.second,
      fontSize: "14px",
      paddingBottom: "1em",
    },
  },
};
