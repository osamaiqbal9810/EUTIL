import { SideTrack } from "../../../template/railRoadLocationsTemplate";
let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
let AssetModel = require("../../../api/assets/assets.modal");
module.exports = {
  async up() {
    // Add AssetType of Side Tracks and add to other as allowed assetType.
    let checkSideTrack = await AssetsTypeModel.findOne({ assetType: "Side Track" }).exec();
    if (!checkSideTrack) {
      let sTrack = new AssetsTypeModel(SideTrack);
      await sTrack.save();
      let locs = await AssetsTypeModel.find({ location: true, parentAssetType: { $ne: null } }).exec();
      for (let loc of locs) {
        loc.allowedAssetTypes.push("Side Track");
        loc.markModified("allowedAssetTypes");
        await loc.save();
      }
      console.log("Side Track AssetType added");
    }
  },
};
