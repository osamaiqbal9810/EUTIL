import { addIfNotExist } from "../../dbFunctions/dbHelperMethods";
import AssetsTypeModel from "../../../../api/assetTypes/assetTypes.model";
import { YardTrack } from "../../../../template/railRoadLocationsTemplate";

module.exports = {
  async apply() {
    console.log("Patch: Add Yard Track for TIMPS");

    let yardAType = await AssetsTypeModel.findOne({ assetType: "Yard", allowedAssetTypes: { $nin: ["Yard Track"] } }).exec();
    if (yardAType) {
      yardAType.allowedAssetTypes.push("Yard Track");
      yardAType.save();
    }
    let plannableLocation = await AssetsTypeModel.findOne({ plannable: true, allowedAssetTypes: { $nin: ["Yard Track"] } }).exec();
    if (plannableLocation) {
      plannableLocation.allowedAssetTypes.push("Yard Track");
      plannableLocation.save();
    }
    let existingYardTrack = await AssetsTypeModel.findOne({assetType: "Yard Track"}).exec();
    if(existingYardTrack) // if it already exist then update
    {
      existingYardTrack.lampAttributes = YardTrack.lampAttributes;
      existingYardTrack.assetTypeClassify = YardTrack.assetTypeClassify;
      await existingYardTrack.save();
    }

    await addIfNotExist(AssetsTypeModel, { assetType: "Yard Track" }, YardTrack);
  },
};
