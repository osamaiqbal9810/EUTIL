import {
  Diamond,
  track,
  SideTrack,
  SpurTrack,
  StorageTrack,
  switchAssetType,
  YardTrack,
  crossings,
  AEIReaders,
  GradeCrossingWarning,
  HighWaterDetector,
  HotboxDetector,
  TrainRadio,
} from "../../../template/railRoadLocationsTemplate";
import { etrBridgeATypeDefectCodes } from "../configurations/DefectCodes/ETR_Bridge";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
import _ from "lodash";
// import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
module.exports = {
  async up() {
    console.log("Add Ontario Northland asset types , update track defect codes and clear appForms tests for Yard Track");
    let aTypesToAdd = [
      Diamond,
      { ...SideTrack, ...{ displayName: "Siding" } },
      SpurTrack,
      StorageTrack,
      { ...switchAssetType, ...{ displayName: "Turnout" } },
      { ...YardTrack, ...{ assetType: "Yard Track 1" } },
      { ...YardTrack, ...{ assetType: "Yard Track 2" } },
      { ...YardTrack, ...{ assetType: "Yard Track 3" } },
      crossings,
      AEIReaders,
      GradeCrossingWarning,
      HighWaterDetector,
      HotboxDetector,
      TrainRadio,
    ];
    for (let aType of aTypesToAdd) {
      let cAType = { ...aType };
      cAType.defectCodes = "";
      cAType.defectCodesObj = etrBridgeATypeDefectCodes;
      await addAssetMethod(cAType);
    }
    await AssetsTypeModel.updateOne(
      { assetType: "track" },
      { $set: { displayName: "Main Track", defectCodesObj: etrBridgeATypeDefectCodes } },
    );
    let appForms = await ApplicationLookupsModel.find({
      listName: "appForms",
      code: { $in: ["inspectionForm1", "inspectionForm2", "inspectionForm3"] },
    });
    for (let appForm of appForms) {
      _.remove(appForm.opt2.config, (item) => item.assetType === "Yard Track");
      appForm.markModified("opt2");
      await appForm.save();
    }
  },
  attributes: { applicationType: "TIMPS", customer: "Ontario Northland" },
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
    let trackAsset = await AssetsTypeModel.findOne({ assetType: "track" }).exec();
    if (trackAsset) {
      let trackCheckExist = false;
      for (let aType of trackAsset.allowedAssetTypes) {
        if (aType === asset.assetType) trackCheckExist = true;
      }
      !trackCheckExist && trackAsset.allowedAssetTypes.push(asset.assetType);
      trackAsset.markModified("allowedAssetTypes");
      await trackAsset.save();
    }
    msg = msg + asset.assetType + " AssetType added";
  }
  console.log(msg);
}
