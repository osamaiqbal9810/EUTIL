import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
import { etrBridgeATypeDefectCodes } from "../configurations/DefectCodes/ETR_Bridge";
let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
module.exports = {
  async up() {
    console.log("Add ETR defect codes to the assetTypes replacing FRA defect codes");

    let aTypes = await AssetsTypeModel.find({ defectCodesObj: { $ne: null } }).exec();

    if (aTypes && aTypes.length > 0) {
      for (let aType of aTypes) {
        aType.defectCodes = "";
        aType.defectCodesObj = etrBridgeATypeDefectCodes;
        aType.markModified("defectCodesObj");
        await aType.save();
      }
    }
    console.log("Adding feature set for non-Fra codes for ETR customer");
    let customer = await ApplicationLookupsModel.findOne({ listName: "Customer" }).exec();
    if (customer && customer.opt2) {
      let nonFraCodeSet = false;
      for (let subset of customer.opt2) {
        if (subset.id == "nonFRACodes") {
          nonFraCodeSet = true;
        }
      }
      if (nonFraCodeSet === false) {
        customer.opt2.push({ id: "nonFRACodes", value: true });
      }
      customer.markModified("opt2");
      customer.save();
    }
  },
  attributes: { applicationType: "TIMPS", customer: "Essex Terminal Railway" },
};
