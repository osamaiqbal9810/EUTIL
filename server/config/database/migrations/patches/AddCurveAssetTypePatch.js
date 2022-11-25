import { addIfNotExist } from "../../dbFunctions/dbHelperMethods";
import AssetsTypeModel from "../../../../api/assetTypes/assetTypes.model";
import { Curve } from "../../../../template/railRoadLocationsTemplate";
import { addApplookupIfNotExist } from "../../configurations/applicationlookupslist";
module.exports = {
  async apply() {
    console.log("Patch: Add Derail Asset Type and app Form");

    let tracks = await AssetsTypeModel.find({
      $or: [{ assetType: "track" }, { assetType: "Customer Track" }, { assetType: "Yard Track" }],
    }).exec();
    if (tracks && tracks.length > 0) {
      for (let track of tracks) {
        let checkExist = false;
        for (let aType of track.allowedAssetTypes) {
          if (aType === "Curve") checkExist = true;
        }
        !checkExist && track.allowedAssetTypes.push("Curve");
        track.save();
      }
    }
    await addIfNotExist(AssetsTypeModel, { assetType: "Curve" }, Curve);
    await addApplookupIfNotExist([{ listName: "appForms", code: "curveTestForm" }]);
  },
};
