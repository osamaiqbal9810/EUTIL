import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";

export const settingStyles = {
  contentContainer: {
    default: { background: "var(--fifth)", margin: "15px", padding: "10px 30px " },
    retro: { background: retroColors.nine, margin: "15px", padding: "10px 30px " },
    electric: { background: electricColors.nine, margin: "15px", padding: "10px 30px " },
  },
  globalUserInputContainer: {
    default: { padding: "15px 20px" },
  },
  heading: headingStyle,
  geoGlobalMainContainer: {
    default: {
      marginTop: "10px",
    },
  },
};

function headingStyle(size) {
  return {
    default: {
      fontFamily: "Myriad Pro",
      fontSize: size == "b" ? "24px" : size == "m" ? "20px" : "16px",
      letterSpacing: "0.5px",
      color: "var(--first)",
    },
    retro: {
      letterSpacing: "0.95px",
      color: "var(--second)",
      fontSize: size == "b" ? "22px" : size == "m" ? "18px" : "16px",
      fontWeight: 600,
    },
    electric: {
      letterSpacing: "0.95px",
      color: "var(--second)",
      fontSize: size == "b" ? "22px" : size == "m" ? "18px" : "16px",
      fontWeight: 600,
    },
  };
}
