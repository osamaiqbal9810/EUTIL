import AssetsTypeModel from "../../../api/assetTypes/assetTypes.model";
import _ from "lodash";
import AssetsModel from "../../../api/assets/assets.modal";

let ServiceLocator = require("../../../framework/servicelocator");

export async function setAssetTypesToInspectable(execute, system) {
  if (system) {
    if (execute) {
      let assetTypesToInspectable = system == "TIMPS" ? assetTypesListForInspectable : assetTypesForSCIMInspectable;
      let assetTypes = await AssetsTypeModel.find().exec();
      if (assetTypes) {
        for (let aType of assetTypes) {
          let foundAType = _.find(assetTypesToInspectable, { assetType: aType.assetType });
          aType.inspectable = foundAType ? foundAType.inspectable : false;

          await aType.save();
        }
        console.log("Updated " + assetTypes.length + " inspectable value");
      }
      recreateAssetTree();
    }
  } else {
    console.log("Please identify TIMPS or SCIM in method setAssetTypesToInspectable for its execution");
  }
}

export async function setAssetTypesDisplayNameProperty(execute) {
  if (execute) {
    let assetTypes = await AssetsTypeModel.find().exec();
    if (assetTypes) {
      for (let aType of assetTypes) {
        !aType.displayName && (aType.displayName = aType.assetType);
        aType.displayName = aType.displayName.charAt(0).toUpperCase() + aType.displayName.slice(1);
        await aType.save();
      }
      recreateAssetTree();
      console.log("Updated " + assetTypes.length + " display name and capitalized first letter");
    }
  }
}

export async function removeRailsAssetType(execute) {
  if (execute) {
    console.log("Executing Removal Method for Rails related assetTypes and assets");
    await AssetsTypeModel.remove({ $or: [{ assetType: "Rail" }, { assetType: "rail" }] }).exec();
    await AssetsModel.remove({ $or: [{ assetType: "Rail" }, { assetType: "rail" }] }).exec();
    recreateAssetTree();
  }
}

function recreateAssetTree() {
  let assetsTreeService = ServiceLocator.resolve("AssetsTreeService");
  assetsTreeService.createHierarchyTree();
}

const assetTypesListForInspectable = [
  { assetType: "track", inspectable: true },
  { assetType: "Switch", inspectable: true },
  { assetType: "Yard", inspectable: true },
  { assetType: "CWR Track", inspectable: true },
  { assetType: "Side Track", inspectable: true },
  { inspectable: true, assetType: "Yard" },
  { inspectable: true, assetType: "Derail" },
  { assetType: "Yard Track", inspectable: true },
];

const assetTypesForSCIMInspectable = [
  { assetType: "Signal", inspectable: true },
  { assetType: "Bridge", inspectable: true },
  { assetType: "Crossing", inspectable: true },
  { assetType: "Station", inspectable: true },
  // {
  //   inspectable: true,
  //   assetType: "Yard",
  // },
  // {
  //   inspectable: true,
  //   assetType: "Derail",
  // },
  {
    inspectable: true,
    assetType: "Intermediate",
  },
  {
    inspectable: true,
    assetType: "Dragging equipment detector",
  },
  {
    inspectable: true,
    assetType: "Wheel impact load detector",
  },
  {
    inspectable: true,
    assetType: "Land slide detector",
  },
  {
    inspectable: true,
    assetType: "T-bogie/ bogies geometry",
  },
  {
    inspectable: true,
    assetType: "Repeater",
  },
  {
    inspectable: true,
    assetType: "Accoustic bearing detector",
  },
  {
    inspectable: true,
    assetType: "Hot Box detector",
  },
  {
    inspectable: true,
    assetType: "Wheel profile",
  },
  {
    inspectable: true,
    assetType: "Interlocking",
  },
  // {
  //     inspectable : true,
  //     assetType : "Switch"
  // },
  {
    inspectable: true,
    assetType: "Control Point",
  },
  { inspectable: true, assetType: "Weather Station" },
];
