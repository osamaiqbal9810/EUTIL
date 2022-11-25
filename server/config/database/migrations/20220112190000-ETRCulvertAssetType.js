import { Culvert } from "../../../template/railRoadLocationsTemplate";
import { etrBridgeATypeDefectCodes } from "../configurations/DefectCodes/ETR_Bridge";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
module.exports = {
  async up() {
    console.log("Add ETR Culvert asset type");

    await addAssetMethod(Culvert);
  },
  attributes: { applicationType: "TIMPS", customer: "Essex Terminal Railway" },
};

async function addAssetMethod(asset) {
  let checkAssetExist = await AssetsTypeModel.findOne({ assetType: asset.assetType }).exec();
  let msg = "";
  if (!checkAssetExist) {
    let newAsset = new AssetsTypeModel(asset);
    newAsset.defectCodes = "";
    newAsset.defectCodesObj = etrBridgeATypeDefectCodes;
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
    let etrBridgeForm = await ApplicationLookupsModel.findOne({ listName: "appForms", code: "etrBridgeForm" }).exec();
    if (etrBridgeForm) {
      etrBridgeForm.opt2.allowedAssetTypes = ["Bridge", "Culvert"];
      etrBridgeForm.markModified("opt2");
      await etrBridgeForm.save();
      msg = msg + ", " + asset.assetType + " AssetType added to etrBridgeForm form";
    }
  }
  console.log(msg);
}
