let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");

module.exports = {
  async up() {
    const CUSTOMER_TRACK_AT_NAME = 'Customer Track';
    const CUSTOMER_SWITCH_AT_NAME = 'Customer Switch';

    console.log("GRYR Add Customer Switch and Customer Track based on existing Switch and Track types");
    const fieldsToCopy = 'lampAttributes,timpsAttributes,diagnosticAttributes,inspectionInstructions,inspectionForms,inspectionFormsObj,defectCodes,defectCodesObj,inspectable,plannable,location,menuFilter,markerMilepost,allowedAssetTypes,parentAssetType,accessPermission,assetTypeClassify,sortOrder'.split(',');
    const trackAT = await AssetsTypeModel.findOne({assetType:'track'});
    const switchAT = await AssetsTypeModel.findOne({assetType: 'Switch'});

    let customerTrackAT = { assetType:CUSTOMER_TRACK_AT_NAME, displayName: CUSTOMER_TRACK_AT_NAME };
    fieldsToCopy.forEach(v => { customerTrackAT[v] = trackAT[v]});
    let customerSwitchAT = { assetType: CUSTOMER_SWITCH_AT_NAME, displayName: CUSTOMER_SWITCH_AT_NAME};
    fieldsToCopy.forEach(v => { customerSwitchAT[v] = switchAT[v] });
    
    if(!customerTrackAT.allowedAssetTypes.includes(CUSTOMER_SWITCH_AT_NAME)) customerTrackAT.allowedAssetTypes.push(CUSTOMER_SWITCH_AT_NAME);
    
    await addAssetTypeMethod(customerTrackAT);
    await addAssetTypeMethod(customerSwitchAT);
  },
  attributes: { customer: "Grenada Railroad" },
};

async function addAssetTypeMethod(asset) {
  let checkAssetExist = await AssetsTypeModel.findOne({ assetType: asset.assetType }).exec();
  let msg = "";
  if (!checkAssetExist) {
    let newAsset = new AssetsTypeModel(asset);
    await newAsset.save();
    let locs = await AssetsTypeModel.find({ location: true, parentAssetType: { $ne: null } }).exec();
    for (let loc of locs) {
      let checkExist = false;
      for (let aType of loc.allowedAssetTypes) {
        if (aType === asset.assetType) checkExist = true;
      }
      !checkExist && loc.allowedAssetTypes.push(asset.assetType);
      loc.markModified("allowedAssetTypes");
      await loc.save();
    }
    msg = msg + asset.assetType + " AssetType added";
  } else {
    msg = asset.assetType + " already exist";
  }
  console.log(msg);
}
