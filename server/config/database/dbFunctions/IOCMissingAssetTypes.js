import AssetsModel from "../../../api/assets/assets.modal";
import AssetsTypeModel from "../../../api/assetTypes/assetTypes.model";
let ServiceLocator = require("../../../framework/servicelocator");

export async function addIOCMissingAssetTypes(execute) {
  if (execute) {
    let change = false;
    for (let aType of IOCAssetTypesList) {
      let aTypeToAdd = { ...aTypeGeneric };
      aTypeToAdd.assetType = aType;

      let checkExist = await AssetsTypeModel.findOne({ assetType: aType });
      if (!checkExist) {
        let newAType = await AssetsTypeModel.create(aTypeToAdd);
        await newAType.save();
        change = true;
        console.log("Created for IOC assetType :  " + aType);
      }
    }
  }
}

export async function removeAssetTypesForIOC(execute) {
  if (execute) {
    for (let aType of iocAssetTypeToRemove) {
      await AssetsTypeModel.deleteOne({ assetType: aType });
      console.log("Removed if it existed for IOC assetType : " + aType);
    }
  }
}
const aTypeGeneric = {
  lampAttributes: [],
  timpsAttributes: null,
  diagnosticAttributes: null,
  inspectionInstructions: "{}",
  inspectionForms: "{}",
  inspectionFormsObj: null,
  defectCodes: null,
  defectCodesObj: null,
  inspectable: true,
  plannable: false,
  location: false,
  menuFilter: false,
  allowedAssetTypes: [],
  parentAssetType: null,
  accessPermission: null,
  assetTypeClassify: "point",
  assetType: "",
};

const IOCAssetTypesList = ["Frog", "Hot wheel detector"];
const iocAssetTypeToRemove = ["3rd Rail", "Catenary Power", "Signal", "Interlocking", "Yard", "yard"];
