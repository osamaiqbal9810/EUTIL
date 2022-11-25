import { versionInfo } from "../MainPage/VersionManager";
// import { Nav, NavIcon, NavText } from "react-sidenav";
// import React from "react";
// import SvgIcon from "react-icons-kit";
import { ic_search } from "react-icons-kit/md/ic_search";
// import { ic_tv } from "react-icons-kit/md/ic_tv";
// import { insertTemplate } from "react-icons-kit/icomoon/insertTemplate";
// import { group } from "react-icons-kit/fa/group";
// import { road } from "react-icons-kit/icomoon/road";
// import permissionCheck from "utils/permissionCheck.js";
import { ic_library_books } from "react-icons-kit/md/ic_library_books";
import { ic_build } from "react-icons-kit/md/ic_build";
import { spreadsheet } from "react-icons-kit/iconic/spreadsheet";
import { fileText2 } from "react-icons-kit/icomoon/fileText2";
import { server } from "react-icons-kit/fa/server";
import { stackExchange } from "react-icons-kit/fa/stackExchange";
// import { languageService } from "../../Language/language.service";

// if (!timpsModule) {
//   navItemsReactComp = null;
// }

export const navBarItemsSITE = [
  {
    navId: "inspection",
    navIndex: 2,
    navIcon: ic_search,
    navText: "Inspections",
    permissionCheckFirstArg: "WORKPLAN",
    permissionCheckSecondArg: "view",
    permissionCheck: true,
  },

  {
    navId: "issuereports",
    navIndex: 3,
    navIcon: ic_library_books,
    navText: "Issues",
    permissionCheckFirstArg: "ISSUE",
    permissionCheckSecondArg: "view",
    permissionCheck: true,
  },
  // {
  //   navId: "maintenancebacklog",
  //   navIndex: 4,
  //   navIcon: ic_build,
  //   navText: "Signal Maintainence",
  //   permissionCheckFirstArg: "MAINTENANCE",
  //   permissionCheckSecondArg: "view",
  //   permissionCheck: true,
  // },
  // {
  //   navId: "workorders",
  //   navIndex: 5,
  //   navIcon: spreadsheet,
  //   navText: "Signal WO",
  //   permissionCheckFirstArg: "WORKORDER",
  //   permissionCheckSecondArg: "view",
  //   permissionCheck: false,
  // },
  {
    navId: "reports",
    navIndex: 10,
    navIcon: fileText2,
    navText: "Reports",
    permissionCheck: false,
  },
  {
    navId: "jobBriefing",
    navIndex: 11,
    navIcon: stackExchange,
    navText: "Job Briefing",
    permissionCheck: false,
  },
];

export const navBarItemsTimps = [
  {
    navId: "inspection",
    navIndex: 2,
    navIcon: ic_search,
    navText: "Inspections",
    permissionCheckFirstArg: "WORKPLAN",
    permissionCheckSecondArg: "view",
    permissionCheck: false,
  },
  {
    navId: "ativ-data",
    navIndex: 3,
    navIcon: fileText2,
    navText: "ATIV Data",
    permissionCheckFirstArg: "ATIVData",
    permissionCheckSecondArg: "view",
    permissionCheck: true,
  },
  {
    navId: "issuereports",
    navIndex: 4,
    navIcon: ic_library_books,
    navText: "Issues",
    permissionCheckFirstArg: "ISSUE",
    permissionCheckSecondArg: "view",
    permissionCheck: false,
  },
  {
    navId: "maintenancebacklog",
    navIndex: 5,
    navIcon: ic_build,
    navText: "Work Order",
    permissionCheckFirstArg: "MAINTENANCE",
    permissionCheckSecondArg: "view",
    permissionCheck: true,
  },
  {
    navId: "workorders",
    navIndex: 6,
    navIcon: spreadsheet,
    navText: "Capital Plan",
    permissionCheckFirstArg: "WORKORDER",
    permissionCheckSecondArg: "view",
    permissionCheck: false,
  },
  {
    navId: "reports",
    navIndex: 10,
    navIcon: fileText2,
    navText: "Reports",
    permissionCheckFirstArg: "WORKPLAN",
    permissionCheckSecondArg: "view",
    permissionCheck: true,
  },
  {
    navId: "trackChart",
    navIndex: 7,
    navIcon: server,
    navText: "Track Chart",
    permissionCheckFirstArg: "MAINTENANCE",
    permissionCheckSecondArg: "view",
    permissionCheck: true,
  },
  {
    navId: "jobBriefing",
    navIndex: 11,
    navIcon: stackExchange,
    navText: "Job Briefing",
    permissionCheck: false,
  },
];

export const navBarItemseUtility = [
  {
    navId: "inspection",
    navIndex: 2,
    navIcon: ic_search,
    navText: "Inspections",
    permissionCheckFirstArg: "WORKPLAN",
    permissionCheckSecondArg: "view",
    permissionCheck: false,
  },

  {
    navId: "issuereports",
    navIndex: 3,
    navIcon: ic_library_books,
    navText: "Issues",
    permissionCheckFirstArg: "ISSUE",
    permissionCheckSecondArg: "view",
    permissionCheck: false,
  },
  /*{
    navId: "maintenancebacklog",
    navIndex: 4,
    navIcon: ic_build,
    navText: "Work Order",
    permissionCheckFirstArg: "MAINTENANCE",
    permissionCheckSecondArg: "view",
    permissionCheck: true,
  },
  {
    navId: "workorders",
    navIndex: 5,
    navIcon: spreadsheet,
    navText: "Capital Plan",
    permissionCheckFirstArg: "WORKORDER",
    permissionCheckSecondArg: "view",
    permissionCheck: false,
  },*/

  {
    navId: "reports",
    navIndex: 10,
    navIcon: fileText2,
    navText: "Reports",
    permissionCheckFirstArg: "WORKPLAN",
    permissionCheckSecondArg: "view",
    permissionCheck: false,
  },
];
