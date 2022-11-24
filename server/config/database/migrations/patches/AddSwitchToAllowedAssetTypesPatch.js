import AssetsTypeModel from "../../../../api/assetTypes/assetTypes.model";

module.exports = {
  async apply() {
    console.log("Patch: Add Switch to Allowed Asset Type on Main + button");

    let plannableLocation = await AssetsTypeModel.findOne({ plannable: true, location: true, allowedAssetTypes: { $nin: ["Switch"] } }).exec();
    if (plannableLocation) {
      plannableLocation.allowedAssetTypes.push("Switch");
      await plannableLocation.save();
    }
  },
};
