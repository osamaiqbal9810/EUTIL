import { basicColors, retroColors } from "style/basic/basicColors";
import { themeService } from "theme/service/activeTheme.service";
export const trackReportStyle = {
  mainStyle: {
    default: { padding: "30px", overflow: "hidden" },
    retro: { padding: "30px", overflow: "hidden", background: "#fff" },
  },
  logoStyle: {
    default: { display: "inline-block", padding: "0 5px 5px 5px", maxWidth: "100%", width: "120px" },
    retro: { display: "inline-block", padding: "0 5px 5px 5px", maxWidth: "100%", width: "120px" },
  },
  headingStyle: {
    default: { textTransform: "uppercase", display: "block", textAlign: "center", transform: "translateX(-14%)", marginBottom: "30px" },
    retro: { display: "block", textAlign: "center", transform: "translateX(-12%)", margin: "12px", fontWeight: "bold" },
  },
  boxStyle: {
    default: { border: "1px solid black", height: "200px" },
    retro: { border: "1px solid black", height: "200px" },
  },
  lineStyle: {
    default: { borderBottom: "1px solid black", height: "130px" },
    retro: { borderBottom: "1px solid black", height: "130px" },
  },
  spanStyle: {
    default: { display: "block", textAlign: "center", },
    retro: { display: "block", textAlign: "center", fontWeight: "bold" },
  },
  labelStyle: {
    default: {},
    retro: {
      margin: "5px 5px 5px",
      fontSize: "14px",
      fontWeight: "bold",
      color: "rgb(26, 26, 26)",
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
      background: "#fff",
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
      marginLeft: "10px"
    },
  },
  yardHeadingStyle: {
    default: {},
    retro: { display: "block", margin: "12px", fontWeight: "bold", fontSize: "18px" },
  },
  textAreaStyle: {
    default: {},
    retro: { border: "2px solid #000", width: "100%", margin: "0 10px", height: "400px" },
  },

};
