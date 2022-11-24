/* eslint eqeqeq: 0 */
import { thList } from "react-icons-kit/fa/thList";
import { calendar } from "react-icons-kit/fa/calendar";
import { glass } from "react-icons-kit/fa/glass";
import { languageService } from "Language/language.service";
import { ic_event } from "react-icons-kit/md/ic_event";
//import { timpsSignalApp } from "../../config/config";
import { random } from "react-icons-kit/fa/random";
import { road } from "react-icons-kit/icomoon/road";
import { versionInfo } from "../MainPage/VersionInfo";
import { calendarCheckO } from "react-icons-kit/fa/calendarCheckO";
let getListView = () => {
  let timpsSignalApp = versionInfo.isSITE(); // there is no impact on this view. Need to investigate the right way of changing view in TIMPS/SITE

  let singalControl = timpsSignalApp ? { SignalAppView: "SignalAppView" } : {};
  return {
    LIST: "List",
    Calendar: "Calendar",
    // LinearView: "LinearView",
    // SwitchStatusView: "SwitchStatusView",
    AssetCalendar: "AssetCalendar",
    //  ...singalControl,
  };
};

let getListSelectionTIMPS = () => {
  //let signalAppSelectionItem = [];
  let signalAppSelectionItem = [
    // {
    //   title: LIST_VIEW_SELECTION_TYPES.SwitchStatusView,
    //   icon: random,
    //   tooltip: {
    //     show: false,
    //     text: languageService("Fixed Asset Inspection Status"),
    //   },
    // },
  ];

  return [
    {
      title: LIST_VIEW_SELECTION_TYPES.LIST,
      icon: thList,
      tooltip: {
        show: false,
        text: languageService("List of Inspections"),
      },
    },
    {
      title: LIST_VIEW_SELECTION_TYPES.Calendar,
      icon: calendar,
      tooltip: {
        show: false,
        text: languageService("Calendar of Inspections"),
      },
    },
    // {
    //   title: LIST_VIEW_SELECTION_TYPES.LinearView,
    //   icon: road,
    //   tooltip: {
    //     show: false,
    //     text: languageService("Track Inspection Status"),
    //   },
    // },
    {
      title: LIST_VIEW_SELECTION_TYPES.AssetCalendar,
      icon: calendarCheckO,
      tooltip: {
        show: false,
        text: languageService("Asset Inspection Calendar"),
      },
    },

    ...signalAppSelectionItem,
  ];
};

let getListSelectionSITE = () => {
  let signalAppSelectionItem = [];
  //  = [
  //       {
  //         title: LIST_VIEW_SELECTION_TYPES.SwitchStatusView,
  //         icon: random,
  //         tooltip: {
  //           show: false,
  //           text: languageService("Fixed Asset Inspection Status"),
  //         },
  //       },
  //     ];

  return [
    {
      title: LIST_VIEW_SELECTION_TYPES.LIST,
      icon: thList,
      tooltip: {
        show: false,
        text: languageService("List of Inspections"),
      },
    },
    {
      title: LIST_VIEW_SELECTION_TYPES.Calendar,
      icon: calendar,
      tooltip: {
        show: false,
        text: languageService("Calendar of Inspections"),
      },
    },
    {
      title: LIST_VIEW_SELECTION_TYPES.LinearView,
      icon: road,
      tooltip: {
        show: false,
        text: languageService("Track Inspection Status"),
      },
    },

    ...signalAppSelectionItem,
  ];
};
export const LIST_VIEW_SELECTION_TYPES = getListView();
export const TIMPS_LIST_VIEW_SELECTION = getListSelectionTIMPS();
export const SITE_LIST_VIEW_SELECTION = getListSelectionSITE();
