import { retroColors } from "../../../style/basic/basicColors";

export const maintenaceDetailstyle = {
  dateHeading: {
    default: {
      color: "rgba(64, 118, 179)",
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
      background: "#fff",
      boxShadow: "3px 3px 5px #cfcfcf",
      margin: "0px 30px  0px 30px",
      padding: "15px",
      textAlign: "left",
      color: " rgba(64, 118, 179)",
      fontSize: "12px",
    },
  },
  MaintenanceDescriptionContainer: {
    default: {
      background: "#fff",
      boxShadow: "1px 1px 2px #cfcfcf",
      padding: "15px",
      textAlign: "left",
      color: " rgba(64, 118, 179)",
      fontSize: "12px",
      marginBottom: "20px",
    },
  },
  fieldHeading: {
    default: {
      display: "inline-block",
      color: "rgba(64, 118, 179)",
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
  },
  fieldText: {
    default: {
      display: "inline-block",
      color: "rgba(64, 118, 179)",
      fontSize: "14px",
      paddingBottom: "1em",
    },
    retro: {
      display: "inline-block",
      color: retroColors.second,
      fontSize: "12px",
      paddingBottom: "1em",
    },
  },
  subfieldText: {
    default: {
      color: "rgba(64, 118, 179)",
      fontSize: "11px",
      paddingBottom: "0em",
    },
    retro: {
      color: retroColors.second,
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
      backgroundColor: "rgba(64, 118, 179)",
      color: "#fff",
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
      color: "#fff",
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
  },
};
