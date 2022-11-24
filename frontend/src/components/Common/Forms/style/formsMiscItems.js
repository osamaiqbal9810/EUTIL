import { basicColors, retroColors } from "style/basic/basicColors";
export const NavElementStyle = {
  NavElement: {
    default: {
      display: "inline-block",
      width: "100%",
      background: "rgba(55, 139, 119,0.3)",
      marginBottom: "1px",
    },
    retro: {
      color: retroColors.second,
      width: "100%",
      marginBottom: "1px",
    },
  },
  NavIcon: {
    default: {
      display: "inline-flex",
      width: "20%",
      fontSize: "24px",
    },
    retro: {
      display: "inline-flex",
      width: "20%",
      fontSize: "24px",
      verticalAlign: "middle",
      color: retroColors.third,
    },
  },
  NavText: {
    default: {
      textTransform: "uppercase",
      width: "70%",
      lineHeight: "26px",
    },
    retro: {
      textTransform: "uppercase",
      width: "70%",
      lineHeight: "26px",
      fontWeight: "bold",
      textTransform: "Capitalize",
      verticalAlign: "middle",
    },
  },
};
export const commonFieldsStyles = {
  checkBoxInput: {
    default: { fontSize: "14px", verticalAlign: "top", color: " rgba(64, 118, 179)" },
    retro: { fontSize: "14px", verticalAlign: "top", color: retroColors.second },
  },
};
