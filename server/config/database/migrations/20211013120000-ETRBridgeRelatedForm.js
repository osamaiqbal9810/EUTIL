import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";
import AssetsTreeService from "../../../api/assetsTree/assetsTreeService";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
import { etrBridgeATypeDefectCodes } from "../configurations/DefectCodes/ETR_Bridge";
let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
module.exports = {
  async up() {
    console.log("Add ETR Bridge AppForm");
    await addApplookupIfNotExist([{ listName: "appForms", code: "etrBridgeForm" }]);
    console.log("make ETR Bridge inspectable");
    let bridgeAType = await AssetsTypeModel.findOne({ assetType: "Bridge" }).exec();
    bridgeAType.inspectable = true;
    console.log("add bridge defect codes to bridge assetType");
    bridgeAType.defectCodes = "";
    bridgeAType.defectCodesObj = etrBridgeATypeDefectCodes;
    bridgeAType.markModified("defectCodesObj");
    await bridgeAType.save();
    console.log("Re-creating Asset Tree for Bridge");
    let assetTreeService = new AssetsTreeService();
    await assetTreeService.createHierarchyTree();
    let customer = await ApplicationLookupsModel.findOne({ listName: "Customer" }).exec();
    if (customer && customer.opt2 && customer.opt2[0] && customer.opt2[0].subset) {
      console.log("Adding Bridge Report to customer");
      customer.opt2[0].subset.push("Bridge Inspection Report");
      customer.markModified("opt2");
    }
    if (customer && customer.opt1 && customer.opt1.appearance) {
      console.log("Adding ETR icon to customer appearence");
      customer.opt1.appearance.logo1 = "etr";
      customer.opt1.appearance.logo2 = "";
      customer.markModified("opt1");
    }
    await customer.save();
  },
  attributes: { applicationType: "TIMPS", customer: "Essex Terminal Railway" },
};
