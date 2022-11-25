import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";

export const maintenaceDetailstyle = {
  dateHeading: {
    default: {
      color: "rgb(94, 141, 143)",
      fontSize: "14px",
      padding: "2em 0em 1em ",
    },
  },
  dateStyle: {
    default: {
      width: "fit-content",
      border: "1px solid #f1f1f1",
      boxShadow: "rgb(238, 238, 238) 1px 1px 1px",
      padding: "10px",
      borderRadius: "5px",
      display: "inline-block",
    },
  },
  copyButtonContainer: { default: { display: "inline-block", marginLeft: "10px" } },
  journeyPlanDateTableContainer: {
    default: {
      marginTop: "30px",
    },
  },

  MaintenanceDetailsContainer: {
    default: {
      background: "var(--fifth)",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "0px 30px  0px 30px",
      padding: "15px",
      textAlign: "left",
      color: "var(--first)",
      fontSize: "12px",
      height: "955px",
      overflow: "auto"
    },
  },
  MaintenanceDescriptionContainer: {
    default: {
      background: "var(--fifth)",
      boxShadow: "1px 1px 2px #cfcfcf",
      padding: "15px",
      textAlign: "left",
      color: "var(--first)",
      fontSize: "12px",
      marginBottom: "20px",

    },
  },
  fieldHeading: {
    default: {
      display: "inline-block",
      color: "rgb(94, 141, 143)",
      fontWeight: "600",
      fontSize: "14px",
      paddingBottom: "0.5em",
      marginRight: "10px",
    },
    retro: {
      display: "inline-block",
      color: retroColors.second,
      fontWeight: "600",
      fontSize: "14px",
      paddingBottom: "0.5em",
      marginRight: "10px",
    },
    electric: {
      display: "inline-block",
      color: electricColors.second,
      fontWeight: "600",
      fontSize: "14px",
      paddingBottom: "0.5em",
      marginRight: "10px",
    },
  },
  fieldText: {
    default: {
      display: "inline-block",
      color: "var(--first)",
      fontSize: "14px",
      paddingBottom: "1em",
    },
    retro: {
      display: "inline-block",
      color: retroColors.second,
      fontSize: "12px",
      paddingBottom: "1em",
    },
    electric: {
      display: "inline-block",
      color: electricColors.second,
      fontSize: "12px",
      paddingBottom: "1em",
    },
  },
  subfieldText: {
    default: {
      color: "var(--first)",
      fontSize: "11px",
      paddingBottom: "0em",
    },
    retro: {
      color: retroColors.second,
      fontSize: "11px",
      paddingBottom: "0em",
    },
    electric: {
      color: electricColors.second,
      fontSize: "11px",
      paddingBottom: "0em",
    },
  },
  fieldGroup: {
    default: {
      marginBottom: "2em",
    },
  },
  gpsIconStyle: {
    default: {
      height: "30px",
      backgroundColor: "var(--first)",
      color: "var(--fifth)",
      fontSize: "12px",
      cursor: "pointer",
      borderRadius: "4px",
      marginRight: "10px",
      border: "none",
      padding: "6px",
    },
    retro: {
      height: "30px",
      backgroundColor: retroColors.first,
      color: "var(--fifth)",
      fontSize: "12px",
      cursor: "pointer",
      borderRadius: "4px",
      marginRight: "10px",
      border: "none",
      padding: "6px",
    },
    electric: {
      height: "30px",
      backgroundColor: electricColors.first,
      color: "var(--fifth)",
      fontSize: "12px",
      cursor: "pointer",
      borderRadius: "4px",
      marginRight: "10px",
      border: "none",
      padding: "6px",
    },
  },
  gpsIconTextStyle: {
    default: { padding: "5px", marginLeft: "1px" },
    retro: { padding: "5px", marginLeft: "1px", color: retroColors.second },
    electric: { padding: "5px", marginLeft: "1px", color: electricColors.second },
  },
};
