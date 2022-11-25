import { switchLHAssetType, switchRHAssetType, SideTrack } from "../../../template/railRoadLocationsTemplate";
import { etrBridgeATypeDefectCodes } from "../configurations/DefectCodes/ETR_Bridge";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
module.exports = {
  async up() {
    console.log("Add ETR Customer LH and RH swtich and track asset type");
    let customerSwitchLH = { ...switchLHAssetType, assetType: "Customer Switch LH", defectCodesObj: etrBridgeATypeDefectCodes };
    let customerSwitchRH = { ...switchRHAssetType, assetType: "Customer Switch RH", defectCodesObj: etrBridgeATypeDefectCodes };
    let customerTrack = {
      ...SideTrack,
      assetType: "Customer Track",
      allowedAssetTypes: ["Customer Switch LH", "Customer Switch RH"],
      defectCodesObj: etrBridgeATypeDefectCodes,
    };
    await addAssetMethod(customerSwitchLH);
    await addAssetMethod(customerSwitchRH);
    await addAssetMethod(customerTrack);
  },
  attributes: { applicationType: "TIMPS", customer: "Essex Terminal Railway" },
};

async function addAssetMethod(asset) {
  let checkAssetExist = await AssetsTypeModel.findOne({ assetType: asset.assetType }).exec();
  let msg = "";
  if (!checkAssetExist) {
    let newAsset = new AssetsTypeModel(asset);
    await newAsset.save();
    let locs = await AssetsTypeModel.find({ location: true, parentAssetType: { $ne: null } }).exec();
    for (let loc of locs) {
      let checkExist = false;
      for (let aType of loc.allowedAssetTypes) {
        if (aType === asset.assetType) checkExist = true;
      }
      !checkExist && loc.allowedAssetTypes.push(asset.assetType);
      loc.markModified("allowedAssetTypes");
      await loc.save();
    }
    msg = msg + asset.assetType + " AssetType added";
  } else {
    msg = asset.assetType + " already exist";
  }
  console.log(msg);
}
