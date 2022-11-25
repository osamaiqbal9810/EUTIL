//import { timpsSignalApp } from "./config";
import { versionInfo } from "../components/MainPage/VersionInfo";

export function tabTitle() {
  if (!versionInfo.loaded) {
    document.getElementById("tabTitle").innerHTML = "";
    return;
  }
  let timpsSignalApp = versionInfo.isSITE();
  let electricUtilApp = versionInfo.isEUtility();
  document.getElementById("tabTitle").innerHTML = electricUtilApp ? "Electric Utility" : timpsSignalApp ? "SITE" : "TIMPS";
  //document.querySelector("link[rel~='icon']").href = './SCIM 1.png';
  //E:\lamp\LAMP\frontend\public\SCIM_Tab_Logo.png
  // document.getElementById("tabTitle").innerHTML = timpsSignalApp ?
  //   document.querySelector("link[rel~='icon']").href = '%PUBLIC_URL%/SCIM_Tab_Logo.png'
}
