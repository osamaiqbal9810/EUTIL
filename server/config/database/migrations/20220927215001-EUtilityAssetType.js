import {
    DistributionOverheadFac,
    Transmission,
    UndergroundFacilitiesPadmountSwitchgear,
    PadmountTransformers,
    Streetlight,
  } from "../../../template/ElectricUtility/AssetTypes/EutilAssetTypes";
  import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
  let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
  
  module.exports = {
    async up() {
      console.log("Add Electric Utility Asset types and remedial action");
      await addAssetMethod(UndergroundFacilitiesPadmountSwitchgear);
      let priorityActionType = await ApplicationLookupsModel.findOne({ listName: "remedialAction", code: "CategoryPriority" });
      if (priorityActionType) {
        priorityActionType.code = "01 Priority";
        priorityActionType.description = "Priority";
        priorityActionType.opt1 = [
          {
            id: "prioritylev",
            fieldName: "Level",
            fieldType: "list",
            required: true,
            options: ["Level I", "Level II", "Level III", "Level IV"],
          },
        ];
        priorityActionType.markModified("opt1");
        await priorityActionType.save();
        console.log("Updated Priority remedial action");
      }
      let repairedRemAction = await ApplicationLookupsModel.findOne({ listName: "remedialAction", code: "02 repaired" });
      if (!repairedRemAction) {
        let repairedRem = new ApplicationLookupsModel({
          tenantId: "ps19",
          listName: "remedialAction",
          code: "02 repaired",
          description: "Repaired",
          opt1: [
            {
              id: "fixDescribe",
              fieldName: "Describe",
              fieldType: "text",
            },
          ],
        });
        await repairedRem.save();
        console.log("added Repaired remedial action");
      }
      let noRepairedReqRemAction = await ApplicationLookupsModel.findOne({ listName: "remedialAction", code: "00 No Repair Required" });
      if (!noRepairedReqRemAction) {
        let noRepairReqRem = new ApplicationLookupsModel({
          tenantId: "ps19",
          listName: "remedialAction",
          code: "00 No Repair Required",
          description: "No Repair Required or N/A",
        });
        await noRepairReqRem.save();
        console.log("added No Repair Required remedial action");
      }
    },
    attributes: { applicationType: "EUtility" },
  };
  
  async function addAssetMethod(asset) {
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
  