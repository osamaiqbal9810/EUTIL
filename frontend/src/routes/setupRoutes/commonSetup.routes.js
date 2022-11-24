import User from "./../../components/User";
import Company from "./../../components/SetupPage/Company/index";
import Settings from "./../../components/Settings/index";
import Alerts from "./../../components/Alerts";
import Line from "./../../components/Line";
import AssetType from "./../../components/AssetType";
import AssetTypeDetail from "./../../components/AssetType/Detail";
import AssetTypeAttributeDetail from "./../../components/AssetType/AttributeDetail";
import ApplicationLists from "./../../components/ApplicationLists";
import Team from "../../components/Team/index";
import LocationSetup from "../../components/LocationSetup/LocationSetup";
import GITestAssetTypes from "../../components/SetupPage/GITestAssetTypes/index"

const commonRoutes = [
  { path: "/setup/staff", component: User, permissionCheckFirstArg: "USER", permissionCheckSecondArg: "view", permissionCheck: true },
  {
    path: "/setup/company",
    component: Company,
    permissionCheckFirstArg: "COMPANY",
    permissionCheckSecondArg: "view",
    permissionCheck: true,
  },
  { path: "/setup/setting", component: Settings, permissionCheck: false },
  { path: "/setup/alerts", component: Alerts, permissionCheck: false },
  { path: "/setup/team", component: Team, permissionCheckFirstArg: "TEAM", permissionCheckSecondArg: "view", permissionCheck: true },
  { path: "/setup/line", component: Line },
  { path: "/setup/assetTypes", component: AssetType },
  { path: "/setup/assetType/:name/:attribute", component: AssetTypeAttributeDetail },
  { path: "/setup/assetType/:name", component: AssetTypeDetail },
  { path: "/setup/applicationLists", component: ApplicationLists, permissionCheck: false },
  { path: "/setup/locationSetup", component: LocationSetup, permissionCheck: false },
  { path: "/setup/assetTypetestForms", component: GITestAssetTypes, permissionCheck: false },

];

export default commonRoutes;
