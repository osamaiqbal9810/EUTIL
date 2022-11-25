import AssetTypeModel from "../../../api/assetTypes/assetTypes.model";

module.exports = {
  async up() {
    console.log("Remove Management Role");
    await AssetTypeModel.deleteMany({ assetType: ["Frog", "Hot wheel detector"]}, function (err, docs) {
      if (err) {
        console.log(err)
      }
      else {
        console.log("Deleted");
      }
    });
  },
  attributes: { applicationType: "EUtility" },
};