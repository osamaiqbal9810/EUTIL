import { basicColors, retroColors } from "../../../../style/basic/basicColors";
export const commonFilterStyles = {
  pageSizeStyle: {
    default: { color: basicColors.first, padding: ".25rem 0.75rem", border: "1px solid #ededed", borderRadius: "3px" },
    retro: { color: retroColors.second, padding: ".25rem 0.75rem", border: "1px solid #ededed" },
  },
  pageSizeTogglerStyle: {
    default: {
      background: "#e3e9ef",
      color: basicColors.first,
      borderColor: basicColors.first,
      padding: "0.15rem 0.5rem",
      fontSize: "12px",
      height: "25px",
      width: "40px",
    },
    retro: {
      background: "#e3e9ef",
      color: retroColors.second,
      borderColor: retroColors.second,
      padding: "0.15rem 0.5rem",
      fontSize: "12px",
      height: "25px",
      width: "40px",
    },
  },
  divider: {
    default: { display: "inline-block", color: basicColors.first },
    retro: {
      display: "inline-block",
      color: retroColors.second,
    },
  },
  textFilterStyle: {
    default: {
      display: "inline-block",
      padding: "5px",
      margin: "0px 5px",
      fontSize: "12px",
      color: basicColors.first,

      borderBottom: "1px solid #e3e9ef",
      borderLeft: "1px solid #e3e9ef",
      borderRight: "1px solid #e3e9ef",
      borderRadius: "5px",
    },
    retro: {
      display: "inline-block",
      padding: "5px",
      margin: "0px 5px",
      fontSize: "12px",
      color: retroColors.second,

      borderBottom: "1px solid #e3e9ef",
      borderLeft: "1px solid #e3e9ef",
      borderRight: "1px solid #e3e9ef",
      borderRadius: "5px",
    },
  },
};
