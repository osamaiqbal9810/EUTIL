import _ from "lodash";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
import { frmSwitchInspection } from "../configurations/appForms/FingerLake_TIMPS_Forms/fingerLakeSwitchInspectionForm";

var ObjectId = require("mongodb").ObjectID;
module.exports = {
  async up() {
    let checkExist = await ApplicationLookupsModel.findOne({ listName: "appForms", code: frmSwitchInspection.code }).exec();
    if (!checkExist) {
      let newAppForm = new ApplicationLookupsModel(frmSwitchInspection);
      newAppForm.opt2.allowedAssetTypes.push("Turnout");
      newAppForm.opt2.allowedAssetTypes.push("Turnout 1");
      newAppForm.opt2.allowedAssetTypes.push("Turnout 2");
      newAppForm.opt2.allowedAssetTypes.push("Turnout 3");
      newAppForm.opt2.allowedAssetTypes.push("Turnout 4");
      newAppForm.markModified("opt2");
      await newAppForm.save();
    }
    console.log("Add Ontario Northland switch app form");
  },
  attributes: { customer: "Ontario Northland" },
};
