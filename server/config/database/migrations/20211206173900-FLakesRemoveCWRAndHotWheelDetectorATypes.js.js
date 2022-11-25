import AssetsTypeModel from "../../../api/assetTypes/assetTypes.model";

module.exports = {
  async up() {
    console.log("Delete CWR Track and hot wheel detector asset type from FL db");
    await AssetsTypeModel.deleteMany({ assetType: { $in: ["CWR Track", "Hot wheel detector", "Side Track"] } });
  },
  attributes: { applicationType: "TIMPS", customer: "Finger Lakes" },
};
