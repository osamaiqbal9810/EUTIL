import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
import { etrBridgeATypeDefectCodes } from "../configurations/DefectCodes/ETR_Bridge";
let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
module.exports = {
  async up() {
    console.log("Add ETR defect codes to the assetTypes replacing FRA defect codes");

    let aTypes = await AssetsTypeModel.find({ inspectable: true }).exec();

    if (aTypes && aTypes.length > 0) {
      for (let aType of aTypes) {
        aType.defectCodes = "";
        aType.defectCodesObj = etrBridgeATypeDefectCodes;
        aType.markModified("defectCodesObj");
        await aType.save();
      }
    }
  },
  attributes: { applicationType: "TIMPS", customer: "Essex Terminal Railway" },
};