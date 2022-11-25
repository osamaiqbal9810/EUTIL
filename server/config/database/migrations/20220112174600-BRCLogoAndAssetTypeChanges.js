let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
import _ from "lodash";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
import { defectCodes } from "../defectCodes";
module.exports = {
  async up() {
    console.log("BRC Diamond Crossing and Double Diamond Crossing as inspectable assettype");
    let aTypes = await AssetsTypeModel.find({ assetType: { $in: ["Diamond Crossing", "Double Diamond Crossing"] } }).exec();
    if (aTypes && aTypes.length > 0) {
      for (let aType of aTypes) {
        aType.inspectable = true;
        aType.defectCodes = "";
        aType.defectCodesObj = defectCodes;
        await aType.save();
      }
    }
    console.log("BRC logo instead of tektrekking");
    let customer = await ApplicationLookupsModel.findOne({ listName: "Customer" }).exec();
    if (customer) {
      customer.opt1.appearance.logo1 = "brc";
      customer.opt1.appearance.logo2 = "";
      _.remove(customer.opt2[0].subset, (item) => item === "Yard Inspection Report");
      customer.markModified("opt1");
      customer.markModified("opt2");
      await customer.save();
    } else console.log("Customer data not found for BRC logo change ");
  },

  attributes: { applicationType: "TIMPS", customer: "Belt Railway of Chicago" },
};
