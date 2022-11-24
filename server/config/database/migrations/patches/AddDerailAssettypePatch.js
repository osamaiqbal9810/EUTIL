import { addIfNotExist } from "../../dbFunctions/dbHelperMethods";
import AssetsTypeModel from "../../../../api/assetTypes/assetTypes.model";
import { Derail } from "../../../../template/railRoadLocationsTemplate";

module.exports = {
  async apply() {
    console.log("Patch: Add Derail Asset Type");

    let yardAType = await AssetsTypeModel.findOne({ assetType: "track", allowedAssetTypes: { $nin: ["Derail"] } }).exec();
    if (yardAType) {
      yardAType.allowedAssetTypes.push("Derail");
      yardAType.save();
    }
    let plannableLocation = await AssetsTypeModel.findOne({ plannable: true, allowedAssetTypes: { $nin: ["Derail"] } }).exec();
    if (plannableLocation) {
      plannableLocation.allowedAssetTypes.push("Derail");
      plannableLocation.save();
    }
    // let existingYardTrack = await AssetsTypeModel.findOne({assetType: "Derail"}).exec();
    // if(existingYardTrack) // if it already exist then update
    // {
    //   existingYardTrack.lampAttributes = YardTrack.lampAttributes;
    //   existingYardTrack.assetTypeClassify = YardTrack.assetTypeClassify;
    //   await existingYardTrack.save();
    // }

    await addIfNotExist(AssetsTypeModel, { assetType: "Derail" }, Derail);
  },
};
