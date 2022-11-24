import { getImageOf } from "theme/themeconfig";
import { topBarHeight } from "components/Common/Variables/CommonVariables";
import { basicColors, retroColors } from "style/basic/basicColors";
//itemsStyle, lineStyle, menuStyle, headerStyle, userAreaStyle
import { themeService } from "theme/service/activeTheme.service";
export const backImage = getImageOf("TopBarViewBackground");
export const topBarStyle = {
  itemsStyle: {
    default: { display: "inline-block", paddingRight: "12px" },
    retro: { display: "inline-block", paddingRight: "12px" },
  },
  lineStyle: {
    default: { display: "inline-block", paddingRight: "12px" },
    retro: { display: "inline-block", paddingRight: "12px" },
  },
  menuStyle: {
    default: { marginTop: "7px", display: "inline-block" },
    retro: { marginTop: "7px", display: "inline-block" },
  },
  headerStyle: {
    default: {
      background: basicColors.first,
      backgroundImage: "url(" + backImage + ")",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: topBarHeight,
      color: "white",
      position: "fixed",
      zIndex: "10",
      width: "100%",
      zIndex: "100",
    },
    retro: {
      background: retroColors.sixth,

      height: topBarHeight,
      color: "white",
      position: "fixed",
      zIndex: "10",
      width: "100%",
      zIndex: "100",
      borderBottom: "3px solid",
      borderBottomColor: retroColors.first,
    },
  },
  userAreaStyle: {
    default: {
      margin: "6px",
      float: "right",
      padding: "7px 12px",
      fontFamily: "Myriad Pro",
      fontSize: "16px",
      letterSpacing: "0.4px",
      color: "#D7E0E8",
    },
    retro: {
      margin: "6px",
      float: "right",
      padding: "7px 12px",
      fontFamily: "Myriad Pro",
      fontSize: "16px",
      letterSpacing: "0.4px",
      color: "#D7E0E8",
    },
  },
  iconStyle: {
    default: { borderRadius: "50%" },
    retro: { borderRadius: "5%" },
  },
  logoStyle: {
    default: { float: "right", marginLeft: "10px" },
    retro: {
      float: "none",
      width: "auto",
      marginTop: "8px",
      verticalAlign: "top",
      height: "60px",
    },
  },
  dividerStyle: {
    default: {
      display: "none",
    },
    retro: {
      width: "3px",
      marginTop: "0px",
      overflow: "hidden",
      background: retroColors.fourth,
      height: "67px",
      display: "inline-block",
    },
  },
  coLogoStyle: {
    default: { width: "202px", marginTop: "10px", verticalAlign: "top", padding: "0 10px" },
    retro: { width: "202px", marginTop: "20px", verticalAlign: "top", padding: "0 10px" },
  },
  logoutStyle: {
    default: { color: retroColors.fifth, verticalAlign: "top", marginRight: "10px" },
    retro: { color: retroColors.fifth, verticalAlign: "top", marginRight: "10px" },
  },
  TTLogoStyle: {
    default: { position: "absolute", top: "10px", left: "50%", transform: "translate(-50%,0)" },
    retro: { position: "absolute", top: "10px", left: "50%", transform: "translate(-50%,0)" },
  },
  centerLogoStyle: {
    default: { width: "202px", marginTop: "10px", verticalAlign: "top", padding: "0 10px" },
    retro: { width: "202px", verticalAlign: "top", padding: "0 10px" },
  },
};
//export const itemsStyle = { display: "inline-block", paddingRight: "12px" };
//export const lineStyle = { display: "inline-block", paddingRight: "12px" };
//export const menuStyle = { marginTop: "7px", display: "inline-block" };
// export const headerStyle = {
//   background: " rgba(64, 118, 179)",
//   backgroundImage: "url(" + backImage + ")",
//   backgroundRepeat: "no-repeat",
//   backgroundSize: "cover",
//   height: topBarHeight,
//   color: "white",
//   position: "fixed",
//   Zindex: "10",
//   width: "100%",
//   zIndex: "100",
// };
// export const userAreaStyle = {
//   margin: "6px",
//   float: "right",
//   padding: "7px 12px",
//   fontFamily: "Myriad Pro",
//   fontSize: "16px",
//   letterSpacing: "0.4px",
//   color: "#D7E0E8",
// };
export const ddElementStyle = themeService({
  deafult: {
    backgroundColor: "rgb(255, 255, 255)",
    borderBottom: "1px solid rgb(227, 233, 239)",
    textAlign: "left",
    color: "rgb(64, 118, 179)",
    fontWeight: "normal",
    fontFamily: "Arial",
    fontSize: "13px",
    letterSpacing: "0.35px",
    textTransform: "uppercase",
    fontWeight: "bold",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "rgb(64, 118, 179)",
      color: "rgb(255, 255, 255)",
    },
  },
  retro: {
    backgroundColor: "rgb(255, 255, 255)",
    borderBottom: "1px solid" + retroColors.fourth,
    textAlign: "left",
    color: retroColors.second,
    fontWeight: "normal",
    fontFamily: "Arial",
    fontSize: "13px",
    letterSpacing: "0.35px",
    textTransform: "uppercase",
    fontWeight: "bold",
    cursor: "pointer",
    ":hover": {
      backgroundColor: retroColors.first,
      color: retroColors.second,
    },
  },
});
export const menuStyule = {
  width: "220px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  wordWrap: "normal",
  display: "block",
};

export const hamBurger = {
  font: "inherit",
  display: "inline-block",
  overflow: "visible",
  margin: "0",
  padding: "26px",
  cursor: "pointer",
  transitionTimingFunction: "linear",
  transitionDuration: ".15s",
  transitionProperty: "opacity, filter",
  textTransform: "none",
  color: "inherit",
  border: "0",
  backgroundColor: "transparent",
};
export const hamBurgerBox = {
  position: "relative",
  display: "inline-block",
  width: "30px",
  height: "16px",
};
export const hamBurgerInner = {
  top: "50%",
  position: "absolute",
  display: "block",
  marginTop: "-2px",
  width: "25px",
  height: "3px",
  transitionTimingFunction: "ease",
  transitionDuration: ".15s",
  transitionProperty: "transform",
  borderRadius: "4px",
  backgroundColor: "rgba(227, 233, 239, 1)",
  display: "block",
  marginTop: "-2px",
};
export const hamBurgerBefore = {
  top: "4%",
  position: "absolute",
  display: "block",
  width: "25px",
  height: "3px",
  transitionTimingFunction: "ease",
  transitionDuration: ".15s",
  transitionProperty: "transform",
  borderRadius: "4px",
  backgroundColor: "rgba(227, 233, 239, 1)",
  display: "block",
  marginTop: "-2px",
};
export const hamBurgerAfter = {
  bottom: "0%",
  position: "absolute",
  display: "block",
  marginTop: "-2px",
  width: "25px",
  height: "3px",
  transitionTimingFunction: "ease",
  transitionDuration: ".15s",
  transitionProperty: "transform",
  borderRadius: "4px",
  backgroundColor: "rgba(227, 233, 239, 1)",
  display: "block",
  marginTop: "-2px",
};

export const LandStyle = {
  fontSize: "small",
  fontWeight: "600",
  textDecoration: "none",
};
