import { etrBridgeATypeDefectCodes } from "../configurations/DefectCodes/ETR_Bridge";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
module.exports = {
  async up() {
    console.log("Add ETR Customer LH and RH swtich and track asset type");

    let aTypes = [
      "AEI Location",
      "Cable Box",
      "Crossing",
      "CTC Control Point",
      "Cut Case",
      "Hand Throw Switch",
      "Hot Box Detector",
      "Inventory Tool House",
      "Maintenance Tool House",
      "PTC Location",
      "Radio Site",
      "RDA Crossing",
      "Signal",
    ];
    let aTypesLength = aTypes.length;
    for (let i = 0; i < aTypesLength; i++) {
      let assetTypeObj = SITEATypesCN(aTypes[i], "002" + i);
      await addAssetTypeMethod(assetTypeObj);
    }
  },
  attributes: { applicationType: "SITE", customer: "Canadian National" },
};

const CNSiteTemplate = {
  assetType: "",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0020", description: "" },
  defectCodes: null,
  defectCodesObj: null,
  inspectionInstructions: null,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};

function SITEATypesCN(aType, code) {
  return {
    ...CNSiteTemplate,
    assetType: aType,
    defectCodesObj: { ...etrBridgeATypeDefectCodes },
    timpsAttributes: { code: code, description: aType },
  };
}

async function addAssetTypeMethod(assetTypeTemplate) {
  let checkAssetExist = await AssetsTypeModel.findOne({ assetType: assetTypeTemplate.assetType }).exec();
  let msg = "";
  if (!checkAssetExist) {
    let newAssetType = new AssetsTypeModel(assetTypeTemplate);
    await newAssetType.save();
    let locs = await AssetsTypeModel.find({ location: true, parentAssetType: { $ne: null } }).exec();
    for (let loc of locs) {
      let checkExist = false;
      for (let aType of loc.allowedAssetTypes) {
        if (aType === assetTypeTemplate.assetType) checkExist = true;
      }
      !checkExist && loc.allowedAssetTypes.push(assetTypeTemplate.assetType);
      loc.markModified("allowedAssetTypes");
      await loc.save();
    }
    msg = msg + assetTypeTemplate.assetType + " AssetType added";
  } else {
    msg = assetTypeTemplate.assetType + " already exist";
  }
  console.log(msg);
}
