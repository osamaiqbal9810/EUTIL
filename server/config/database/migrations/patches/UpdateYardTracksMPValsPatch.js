import AssetsModel from "../../../../api/assets/assets.modal";
import _ from "lodash";
module.exports = {
  async apply() {
    console.log("Patch: Set MP from markers values to Yard Track start/end");
    let yardAssets = await AssetsModel.find({ assetType: "Yard Track", isRemoved: false }).exec();
    let sAssets = await AssetsModel.find({ assetType: "Switch", isRemoved: false }).exec();
    for (let yAsset of yardAssets) {
      let startMarker = yAsset && yAsset.attributes && yAsset.attributes["Marker Start"];
      let endMarker = yAsset && yAsset.attributes && yAsset.attributes["Marker End"];
      let startSwitch = _.find(sAssets, (asset) => {
        return asset.unitId === startMarker;
      });
      let endSwitch = _.find(sAssets, (asset) => {
        return asset.unitId === endMarker;
      });

      if (startSwitch) {
        yAsset.start = startSwitch.start;
        yAsset.end = endSwitch ? endSwitch.start : startSwitch.start;
      }

      await yAsset.save();
    }
  },
};
