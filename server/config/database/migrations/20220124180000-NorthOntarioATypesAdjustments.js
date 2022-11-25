import _ from "lodash";
import AssetsModel from "../../../api/assets/assets.modal";
let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
var ObjectId = require("mongodb").ObjectID;
module.exports = {
  async up() {
    console.log("Add Ontario Northland asset types allowed adjustments and remove Yard Tracks");
    await AssetsTypeModel.update(
      { assetType: "track" },
      {
        $set: {
          allowedAssetTypes: [
            "Switch",
            "Diamond",
            "Crossing",
            "Grade Crossing Warning",
            "Hotbox Detector",
            "Train Radio",
            "AEI Reader",
            "High Water Detector",
          ],
        },
      },
    ).exec();
    await AssetsTypeModel.updateMany(
      { location: true, parentAssetType: { $ne: null } },
      {
        $set: {
          allowedAssetTypes: [
            "track",
            "Switch",
            "Station",
            "Bridge",
            "Signal",
            "Crossing",
            "Pole line",
            "Interlockings",
            "Intermediate signals",
            "Yard Track",
            "Side Track",
            "Diamond",
            "Spur",
            "Storage Track",
            "Yard Track 1",
            "Yard Track 2",
            "Yard Track 3",
            "Grade Crossing Warning",
            "Hotbox Detector",
            "Train Radio",
            "AEI Reader",
            "High Water Detector",
          ],
        },
      },
    ).exec();
  },
  attributes: { customer: "Ontario Northland" },
};
