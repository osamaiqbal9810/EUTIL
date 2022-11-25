import { getImageOf } from "theme/themeconfig";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
let backImage = getImageOf("SideNavBar");

export const SideNavBarStyle = {
  sideNav: {
    default: {
      backgroundImage: "url(" + backImage + ")",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundColor: basicColors.second,
      color: basicColors.fourth,
      height: "100%",
      position: "fixed",
      textAlign: "left",
      top: "70px",
      fontFamily: "Arial",
      fontSize: "14px",
      letterSpacing: "0.35px",
      paddingTop: "30px",
      transition: "all .2s ease-in-out",
    },
    retro: {
      background: retroColors.fifth,
      height: "100%",
      position: "fixed",
      textAlign: "left",
      top: "70px",
      fontFamily: "Arial",
      fontSize: "14px",
      letterSpacing: "0.35px",
      transition: "all .2s ease-in-out",
      borderRight: "3px solid ",
      borderRightColor: retroColors.first,
    },
    electric: {
      background: electricColors.fifth,
      height: "100%",
      position: "fixed",
      textAlign: "left",
      top: "70px",
      fontFamily: "Arial",
      fontSize: "14px",
      letterSpacing: "0.35px",
      transition: "all .2s ease-in-out",
      borderRight: "3px solid ",
      borderRightColor: electricColors.first,
    },
  },
};
