import AssetsTypeModel from "../../../../api/assetTypes/assetTypes.model";
import AssetsTreeService from "../../../../api/assetsTree/assetsTreeService";
module.exports = {
  async apply() {
    console.log("Patch: North Ontario SITE inspectable assettypes");
    await AssetsTypeModel.updateMany({ assetType: { $nin: aTypesSITE }, location: false }, { $set: { inspectable: false } }).exec();
    await AssetsTypeModel.updateMany({ assetType: { $in: aTypesSITE }, location: false }, { $set: { inspectable: true } }).exec();
    let assetTreeService = new AssetsTreeService();
    await assetTreeService.createHierarchyTree();
  },
};

let aTypesSITE = ["Crossing", "AEI Reader", "Grade Crossing Warning", "High Water Detector", "Hotbox Detector", "Train Radio"];
