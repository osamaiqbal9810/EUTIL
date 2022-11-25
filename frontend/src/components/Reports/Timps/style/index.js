import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import { themeService } from "theme/service/activeTheme.service";
export const trackReportStyle = {
  mainStyle: {
    default: { padding: "30px", overflow: "hidden" },
    retro: { padding: "30px", overflow: "hidden", background: "var(--fifth)" },
    electric: { padding: "30px", overflow: "hidden", background: "var(--fifth)" },
  },
  logoStyle: {
    default: { display: "inline-block", padding: "0 5px 5px 5px", maxWidth: "100%", width: "120px" },
    retro: { display: "inline-block", padding: "0 5px 5px 5px", maxWidth: "100%", width: "100%" },
    electric: { display: "inline-block", padding: "0 5px 5px 5px", maxWidth: "100%", width: "120px" },
  },
  headingStyle: {
    default: { textTransform: "uppercase", display: "block", textAlign: "center", transform: "translateX(-14%)", marginBottom: "30px" },
    retro: { display: "block", textAlign: "center", transform: "translateX(-12%)", margin: "12px", fontWeight: "bold" },
    electric: { display: "block", textAlign: "center", transform: "translateX(-12%)", margin: "12px", fontWeight: "bold" },
  },
  boxStyle: {
    default: { border: "1px solid black", height: "200px" },
    retro: { border: "1px solid black", height: "200px" },
    electric: { border: "1px solid black", height: "200px" },
  },
  lineStyle: {
    default: { borderBottom: "1px solid black", height: "130px" },
    retro: { borderBottom: "1px solid black", height: "130px" },
    electric: { borderBottom: "1px solid black", height: "130px" },
  },
  spanStyle: {
    default: { display: "block", textAlign: "center" },
    retro: { display: "block", textAlign: "center", fontWeight: "bold" },
    electric: { display: "block", textAlign: "center", fontWeight: "bold" },
  },
  labelStyle: {
    default: {},
    retro: {
      margin: "5px 5px 5px",
      fontSize: "14px",
      fontWeight: "bold",
      color: "var(--second)",
      float: "none",
    },
    electric: {
      margin: "5px 5px 5px",
      fontSize: "14px",
      fontWeight: "bold",
      color: "var(--second)",
      float: "none",
    },
  },
  dateStyle: {
    default: {},
    retro: {
      display: "inline-block",
      margin: "0 5px",
      border: "1px solid #ccc",
      padding: "6px 14px",
      background: "var(--fifth)",
      fontSize: "14px",
    },
    electric: {
      display: "inline-block",
      margin: "0 5px",
      border: "1px solid #ccc",
      padding: "6px 14px",
      background: "var(--fifth)",
      fontSize: "14px",
    },
  },
  labelSpanStyle: {
    default: {},
    retro: {
      display: "inline-block",
      width: "50%",
      borderBottom: "1px solid #000",
      float: "none",
      marginLeft: "10px",
      textAlign: "center",
    },
    electric: {
      display: "inline-block",
      width: "50%",
      borderBottom: "1px solid #000",
      float: "none",
      marginLeft: "10px",
      textAlign: "center",
    },
  },
  yardHeadingStyle: {
    default: {},
    retro: { display: "block", margin: "12px", fontWeight: "bold", fontSize: "18px" },
    electric: { display: "block", margin: "12px", fontWeight: "bold", fontSize: "18px" },
  },
  textAreaStyle: {
    default: {},
    retro: { border: "2px solid #000", width: "100%", margin: "0 10px", height: "400px" },
    electric: { border: "2px solid #000", width: "100%", margin: "0 10px", height: "400px" },
  },
};
