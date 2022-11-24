import { withPlus } from "react-icons-kit/entypo/withPlus";
import { retroColors } from "../style/basic/basicColors";
export const commonStyles = {
  zeroMarginRow: { default: { margin: "0px" } },
  zeroPaddingCol: { default: { padding: "0px" } },
  pageTitleStyle: {
    default: {
      float: "left",
      fontFamily: "Myriad Pro",
      fontSize: "24px",
      letterSpacing: "0.5px",
      color: " rgba(64, 118, 179)",
    },
    retro: {
      display: "none",
    },
  },
  pageTitleDetailStyle: {
    default: { float: "left", fontFamily: "Myriad Pro", fontSize: "24px", letterSpacing: "0.5px", color: " rgba(64, 118, 179)" },
    retro: {
      float: "left",
      fontFamily: "Myriad Pro",
      fontSize: "24px",
      letterSpacing: "0.5px",
      color: retroColors.second,
    },
  },
  pageBorderRowStyle: {
    default: {
      borderBottom: "2px solid #d1d1d1",
      margin: "0px 15px",
      padding: "10px 0px",
    },
    retro: {
      margin: "0px 15px",
    },
  },
};

export function addButtonCircleStyleMethod(props) {
  return {
    default: {
      iconSize: props.iconSize ? props.iconSize : 50,
      icon: props.icon ? props.icon : withPlus,
      backgroundColor: props.backgroundColor ? props.backgroundColor : "#e3e9ef",
      margin: props.margin ? props.margin : "5px 0px 0px 0px",
      borderRadius: props.borderRadius ? props.borderRadius : "50%",
      hoverBackgroundColor: props.hoverBackgroundColor ? props.hoverBackgroundColor : "#e3e2ef",
      hoverBorder: props.hoverBorder ? props.hoverBorder : "0px",
      activeBorder: props.activeBorder ? props.activeBorder : "3px solid #e3e2ef ",
      iconStyle: props.iconStyle
        ? props.iconStyle
        : {
          color: "#c4d4e4",
          background: "#fff",
          borderRadius: "50%",
          border: "3px solid ",
        },
      buttonTitleText: props.buttonTitleText,
      textTitleStyle: props.textTitleStyle,
    },
    retro: {
      iconSize: props.iconSize ? props.iconSize : 50,
      icon: props.icon ? props.icon : withPlus,
      backgroundColor: props.backgroundColor ? props.backgroundColor : "#e3e9ef",
      margin: props.margin ? props.margin : "5px 0px 0px 0px",
      borderRadius: props.borderRadius ? props.borderRadius : "50%",
      hoverBackgroundColor: props.hoverBackgroundColor ? props.hoverBackgroundColor : "#e3e2ef",
      hoverBorder: props.hoverBorder ? props.hoverBorder : "0px",
      activeBorder: props.activeBorder ? props.activeBorder : "3px solid #e3e2ef ",
      iconStyle: props.iconStyle
        ? props.iconStyle
        : {
          color: "#c4d4e4",
          background: "#fff",
          borderRadius: "50%",
          border: "3px solid ",
        },
      buttonTitleText: props.buttonTitleText,
      textTitleStyle: props.textTitleStyle,
      buttonTextColor: retroColors.second,
    },
  };
}
