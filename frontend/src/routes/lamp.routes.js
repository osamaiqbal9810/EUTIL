import AddAssetsContainer from "components/AssetType/index";
import AssetsLampult from "components/LampAssets/index";
import LineSelectionWrapper from "components/TrackLineSelect/LineSelectionWrapper";
import LangSelectionOptions from "components/Language/LangSelectionOptions";
import AssetType from "components/AssetType";
const lampRoutes = [
  { path: "/assetType", component: AddAssetsContainer },
  { path: "/assets", component: AssetsLampult },
  { path: "/assetTypes", component: AssetType },
  { path: "/line/:caller/:subcaller", component: LineSelectionWrapper },
  { path: "/line/:caller", component: LineSelectionWrapper },
  { path: "/line", component: LineSelectionWrapper },
  { path: "/lang/:caller/:subcaller", component: LangSelectionOptions },
  { path: "/lang/:caller", component: LangSelectionOptions },
  { path: "/lang", component: LangSelectionOptions },
];
export default lampRoutes;
