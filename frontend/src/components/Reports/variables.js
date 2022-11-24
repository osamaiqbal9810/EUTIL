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
import ElectricalLogo from "../../EUIS_Logo_Reports.png";


// To add a new key please import the file and add an entry below.
const ICON_MAP = [
    { id: "default", icon: ElectricalLogo },
    { id: "fingerlakes", icon: fingerLake },
    { id: "fingerlakesWhite", icon: fingerLakeWhiteBk },
    { id: "qnsl", icon: qnsl },
    { id: "ioc", icon: ioc },
    { id: "ferromex", icon: ferromex },
    { id: "ferromexz", icon: ferromexz },
    { id: "fingerlakes2", icon: fingerLake2 },
    { id: "", icon: logo }
];

class IconCustomizer {
    constructor() // load default icons
    {
        this.iconOne = "";
        this.iconTwo = "";
        this.loadVersion(versionInfo);
        this.versionLoaded = this.versionLoaded.bind(this);

        eventBus.on('versionLoaded', this.versionLoaded);
    }
    versionLoaded(vInfo) {
        this.loadVersion(vInfo);
    }
    loadVersion(vInfo) {
        if (vInfo && vInfo.appearance) {
            let defaultIcon = { icon: ElectricalLogo };

            let iconOne = this.findFromMap(vInfo.appearance.logo1);
            let iconTwo = this.findFromMap(vInfo.appearance.logo2);

            if (!iconOne) iconOne = defaultIcon;
            if (!iconTwo) iconTwo = defaultIcon;

            iconToShow = { default: iconOne.icon, retro: iconOne.icon };
            iconTwoShow = { default: iconTwo.icon, retro: iconTwo.icon };
        }
    }
    findFromMap(id) {
        id = !id ? "" : id;
        let icon = ICON_MAP.find(entry => { return entry.id === id; });
        return icon;
    }
    destroy() {
        eventBus.remove('versionLoaded', this.versionLoaded);
    }
};

export const iconCustomizer = new IconCustomizer();

export var iconToShow = {
    default: tektracking,
    retro: tektracking,
};
export var iconTwoShow = {
    default: tektracking,
    retro: tektracking,
};