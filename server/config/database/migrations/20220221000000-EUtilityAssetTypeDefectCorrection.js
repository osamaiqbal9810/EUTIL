import {
  distributionDcodes,
  transmissionDcodes,
  ugroundfacPadmountSwitchgearDcodes,
} from "../../../template/ElectricUtility/DefectCodes/EutilDefectCodes";
let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");

module.exports = {
  async up() {
    console.log("Add Electric Utility Asset types Defect codes correction");
    await aTypeUpdate("Distribution Overhead Facilities", distributionDcodes);
    await aTypeUpdate("Transmission", transmissionDcodes);
    await aTypeUpdate("Pad Mount Switchgear – Switch Modules  ", ugroundfacPadmountSwitchgearDcodes);
  },
  attributes: { applicationType: "EUtility" },
};

async function aTypeUpdate(aType, dCodes) {
  let assetType = await AssetsTypeModel.findOne({ assetType: aType });
  assetType.defectCodesObj = dCodes;
  assetType.markModified("defectCodesObj");
  await assetType.save();
}
