import { retroColors } from "../../style/basic/basicColors";
import { relativeTimeRounding } from "moment";

export const locationListStyle = {
  fieldRowHeading: {
    retro: {
      padding: "10px",
      fontSize: "12px",

      backgroundColor: retroColors.fourth,
      fontWeight: 600,
    },
  },
  fieldRowHeadingv2: {
    retro: {
      padding: "10px",
      fontSize: "12px",
      borderBottom: "1px solid " + retroColors.ten,
      backgroundColor: retroColors.fifth,
      cursor: "pointer",
    },
  },
  addNewField: {
    retro: {
      position: "relative",
      padding: "6px 9px 9px 12px",
      right: 0,
      color: retroColors.first,
      cursor: "pointer",
    },
  },
  mainContainer: {
    retro: {
      backgroundColor: retroColors.fifth,
    },
  },
  addIconStyle: {
    retro: {
      position: "relative",
      left: "90%",
      verticalAlign: "middle",
    },
  },

  addNewInputField: {
    retro: {
      width: "-webkit-calc(100% - 76px)",
      width: " -moz-calc(100% - 76px)",
      width: "      calc(100% - 76px)",
      height: "34px",
      padding: "6px 12px",
      fontSize: "12px",
      lineHeight: "1.42857143",
      color: retroColors.second,
      backgroundColor: retroColors.fifth,
      backgroundImage: "none",
      border: "1px solid " + retroColors.ten,
      borderRadius: "0px",
      WebkitTransition: "border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
      OTransition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s",
      transition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
    },
  },
  saveInputIcon: {
    retro: {
      color: retroColors.first,
      display: "inline-block",
      height: "34px",
      padding: "6px 9px 9px 12px",
      cursor: "pointer",
    },
  },
  customCheckBoxContainer: {
    retro: {
      background: retroColors.fifth,
      cursor: "pointer",
      padding: "0px 2px",
      minHeight: "20px",
      minWidth: "21px",
      borderRadius: "2px",
      border: "1px solid " + retroColors.first,
    },
  },
  editIcon: {
    retro: {
      color: retroColors.second,
      padding: "0px 0px 0px 10px",
      cursor: "pointer",
    },
  },
};
