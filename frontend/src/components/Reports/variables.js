import tektracking from "../../tekterkking.png";
import fingerLake from "../../logo-fingerlake.png";
import fingerLakeWhiteBk from "../../logo-ferromex.jpeg";
import qnsl from "../../logo-qsnl.png";
import ioc from "../../logo-ioc.png";
import ferromex from "../../logo-ferromex.jpeg";
import ferromexz from "../../logo-ferromexzz.png";
import fingerLake2 from "../../logo-sidebar.png";
import logo from "../../logo.png";
import { versionInfo } from "../MainPage/VersionInfo";
import eventBus from "../../utils/eventBus";
import etr from "../../ETR_Logo.png";
import txnw from "../../logo-TXNW.jpg";
import brc from "../../BRC.png";
import gryr from "../../logo-gryr.jpg";
import onr from "../../logo-ONR.jpg";
import trirail from "../../TriRail Logo.png";
import transdev from "../../Transdev Logo.png";
import septa from "../../SEPTA_Logo.png";
import nopb from "../../logo-nopb.jpg";
import pioneerlines from "../../pioneer-lines-logo-v2.png";

// To add a new key please import the file and add an entry below.
const ICON_MAP = [
  { id: "default", icon: tektracking },
  { id: "fingerlakes", icon: fingerLake },
  { id: "fingerlakesWhite", icon: fingerLakeWhiteBk },
  { id: "qnsl", icon: qnsl },
  { id: "ioc", icon: ioc },
  { id: "ferromex", icon: ferromex },
  { id: "ferromexz", icon: ferromexz },
  { id: "fingerlakes2", icon: fingerLake2 },
  { id: "etr", icon: etr },
  { id: "txnw", icon: txnw },
  { id: "brc", icon: brc },
  { id: "gryr", icon: gryr },
  { id: "ontarionorthland", icon: onr },
  { id: "trirail", icon: trirail },
  { id: "transdev", icon: transdev },
  { id: "septa", icon: septa },
  { id: "nopb", icon: nopb},
  { id: "pioneerlines", icon: pioneerlines},
  { id: "", icon: logo }
];

class IconCustomizer {
  constructor() {
    // load default icons
    this.iconOne = "";
    this.iconTwo = "";
    this.loadVersion(versionInfo);
    this.versionLoaded = this.versionLoaded.bind(this);

    eventBus.on("versionLoaded", this.versionLoaded);
  }
  versionLoaded(vInfo) {
    this.loadVersion(vInfo);
  }
  loadVersion(vInfo) {
    if (vInfo && vInfo.appearance) {
      let defaultIcon = { icon: tektracking };
      let defaultIcon02 = { icon: logo };

      let iconOne = this.findFromMap(vInfo.appearance.logo1);
      let iconTwo = this.findFromMap(vInfo.appearance.logo2);

      if (!iconOne) iconOne = defaultIcon;
      if (!iconTwo || (iconTwo && iconTwo.id === "default")) iconTwo = defaultIcon02;

      iconToShow = { default: iconOne.icon, retro: iconOne.icon, electric: iconOne.icon };
      iconTwoShow = { default: iconTwo.icon, retro: iconTwo.icon, electric: iconTwo.icon };
    }
  }
  findFromMap(id) {
    id = !id ? "" : id;
    let icon = ICON_MAP.find((entry) => {
      return entry.id === id;
    });
    return icon;
  }
  destroy() {
    eventBus.remove("versionLoaded", this.versionLoaded);
  }
}

export const iconCustomizer = new IconCustomizer();

export var iconToShow = {
  default: tektracking,
  retro: tektracking,
  electric: tektracking,
};
export var iconTwoShow = {
  default: tektracking,
  retro: tektracking,
  electric: tektracking,
};
