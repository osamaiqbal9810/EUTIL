import { getImageOf } from "theme/themeconfig";
import { topBarHeight } from "components/Common/Variables/CommonVariables";

export const itemsStyle = { display: "inline-block", paddingRight: "12px" };
export const lineStyle = { display: "inline-block", paddingRight: "12px" };
export const menuStyle = { marginTop: "7px", display: "inline-block" };
export const backImage = getImageOf("TopBarViewBackground");
export const headerStyle = {
  background: " rgba(64, 118, 179)",
  backgroundImage: "url(" + backImage + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: topBarHeight,
  color: "white",
  position: "fixed",
  Zindex: "10",
  width: "100%",
  zIndex: "100",
};
export const userAreaStyle = {
  margin: "6px",
  float: "right",
  padding: "7px 12px",
  fontFamily: "Myriad Pro",
  fontSize: "16px",
  letterSpacing: "0.4px",
  color: "#D7E0E8",
};
export const ddElementStyle = {
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
};
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
