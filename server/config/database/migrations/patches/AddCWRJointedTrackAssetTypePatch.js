import { CWRJointedTrack } from "../../../../template/railRoadLocationsTemplate";

let AssetsTypeModel = require("../../../../api/assetTypes/assetTypes.model");

module.exports = {
  async apply() {
    console.log("Add CWR Joint Track asset type");

    await addAssetMethod(CWRJointedTrack);
  }
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
