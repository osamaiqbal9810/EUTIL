import { defectCodes } from "../defectCodes";
import {RARTrack} from "../../../template/railRoadLocationsTemplate";

let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");

module.exports = {
  async up() {
    console.log("Add RAR Track and Yard Switch");

    await addAssetTypeMethod(RARTrack);
    await addAssetTypeMethod(YardSwitch);
    
  },
  attributes: { applicationType: "TIMPS", customer: "NOPB" },
};

const YardSwitch = {
  assetType: "Yard Switch",
  assetTypeClassify: "point",
  lampAttributes: [{
    name: "Marker Start",
    type: "text",
    order: 1,
    required: false,
  },
  {
    name: "Marker End",
    type: "text",
    order: 2,
    required: false,
  }],
  timpsAttributes: { code: "0028", description: "Yard Switch" },
  defectCodes: null,
  defectCodesObj: defectCodes,
  inspectionInstructions: null,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  markerMilepost: true,
  freeformMarker: true,
  allowedAssetTypes: [],
};

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
