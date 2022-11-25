import AssetsTypeModel from "../api/assetTypes/assetTypes.model";
import AssetsModel from "../api/assets/assets.modal";
import { LampAttributes, inspectionInstructions, switchInspForm, trackInspForm } from "./assetTypeAttributes";
import { defectCodes } from "../config/database/defectCodes";
import { signalApp } from "./config";
import { SingalAppDefectCodes } from "./DefectCodes";
import { etrBridgeATypeDefectCodes } from "../config/database/configurations/DefectCodes/ETR_Bridge";
export async function railRoadLocationsTemplate() {
  let aTypes = await AssetsTypeModel.find().exec();

  if (aTypes.length == 0) {
    console.log("No Asset Types Exist, creating locations");
    let atrr = await AssetsTypeModel.create(railRoad);
    await AssetsModel.create(company);

    let majGeo = await AssetsTypeModel.create({ ...majorGeographical, parentAssetType: atrr._id });
    let minGeo = await AssetsTypeModel.create({ ...minorGeographical, parentAssetType: majGeo._id });
    await AssetsTypeModel.create({ ...locationIdentifier, parentAssetType: minGeo._id });
    // await AssetsTypeModel.create(track);
    // await AssetsTypeModel.create(rail);
    // await AssetsTypeModel.create(thirdRail);
    // await AssetsTypeModel.create(catenaryPower);
    // await AssetsTypeModel.create(switchAssetType);
    // await AssetsTypeModel.create(station);
    // await AssetsTypeModel.create(bridge);
    // await AssetsTypeModel.create(signal);
  }
  if (signalApp.status) {
    await addIfNotExist(AssetsTypeModel, { assetType: track.assetType }, { ...track, inspectable: false });
    await addIfNotExist(AssetsTypeModel, { assetType: signal.assetType }, signal);
    await addIfNotExist(AssetsTypeModel, { assetType: switchAssetType.assetType }, switchAssetType);
    await addIfNotExist(AssetsTypeModel, { assetType: interlockings.assetType }, interlockings);
    await addIfNotExist(AssetsTypeModel, { assetType: crossings.assetType }, crossings);
    await addIfNotExist(AssetsTypeModel, { assetType: IntermediateSignals.assetType }, IntermediateSignals);
    await addIfNotExist(AssetsTypeModel, { assetType: poleLine.assetType }, poleLine);
  } else {
    await addIfNotExist(AssetsTypeModel, { assetType: track.assetType }, track);
    await addIfNotExist(AssetsTypeModel, { assetType: rail.assetType }, rail);
    await addIfNotExist(AssetsTypeModel, { assetType: thirdRail.assetType }, thirdRail);
    await addIfNotExist(AssetsTypeModel, { assetType: catenaryPower.assetType }, catenaryPower);
    await addIfNotExist(AssetsTypeModel, { assetType: switchAssetType.assetType }, switchAssetType);
    await addIfNotExist(AssetsTypeModel, { assetType: station.assetType }, station);
    await addIfNotExist(AssetsTypeModel, { assetType: bridge.assetType }, bridge);
    await addIfNotExist(AssetsTypeModel, { assetType: signal.assetType }, signal);
    await addIfNotExist(AssetsTypeModel, { assetType: interlockings.assetType }, interlockings);
    await addIfNotExist(AssetsTypeModel, { assetType: crossings.assetType }, crossings);
    await addIfNotExist(AssetsTypeModel, { assetType: IntermediateSignals.assetType }, IntermediateSignals);
    await addIfNotExist(AssetsTypeModel, { assetType: poleLine.assetType }, poleLine);
  }
}
async function addIfNotExist(model, criteria, newEntry) {
  if (!model) {
    console.log("model not valid, exitting");
    return;
  }
  if (!criteria || criteria == {}) {
    console.log("Only one entry should be added, provide criteria");
    return;
  }
  if (!newEntry) {
    console.log("Entry to add is null");
    return;
  }

  try {
    let entry = await model.findOne(criteria).exec();
    if (!entry) {
      //  console.log("adding entry ", newEntry);
      await model.create(newEntry);
    }
  } catch (err) {
    console.log("addIfNotExist in Septa-Location.js, err:", err.toString());
  }
}

let company = {
  inspectable: false,
  parentAsset: null,
  images: [],
  documents: [],
  childAsset: [],
  isRemoved: false,
  unitId: "Rail Road",
  description: "",
  assetType: "Company",
  frequency: "",
  attributes: {},
};

let railRoad = {
  assetType: "Company",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: {},
  defectCodes: [],
  inspectionInstructions: "",
  inspectionForms: "",
  plannable: false,
  inspectable: false,
  location: true,
  menuFilter: false,
  allowedAssetTypes: ["Major Geographical Identifier"],
  parentAssetType: null,
};
let majorGeographical = {
  assetType: "Major Geographical Identifier",
  assetTypeClassify: "point",
  lampAttributes: LampAttributes["line"],
  timpsAttributes: { code: "0001", description: "line" },
  defectCodes: [],
  inspectionInstructions: "",
  inspectionForms: "",
  plannable: true,
  inspectable: false,
  menuFilter: false,
  location: true,
  allowedAssetTypes: [
    "Minor Geographical Identifier",
    "track",
    "Switch",
    "Station",
    "Bridge",
    "Signal",
    "Crossing",
    "Pole line",
    "Interlockings",
    "Intermediate signals",
    "Yard Track",
  ],
};
let minorGeographical = {
  assetType: "Minor Geographical Identifier",
  assetTypeClassify: "point",
  lampAttributes: LampAttributes["line"],
  timpsAttributes: { code: "0001", description: "line" },
  defectCodes: [],
  inspectionInstructions: "",
  inspectionForms: "",
  plannable: false,
  inspectable: false,
  menuFilter: false,
  location: true,
  allowedAssetTypes: [
    "Location Identifier",
    "track",
    "Switch",
    "Station",
    "Bridge",
    "Signal",
    "Crossing",
    "Pole line",
    "Interlockings",
    "Intermediate signals",
    "Yard Track",
  ],
};
let locationIdentifier = {
  assetType: "Location Identifier",
  assetTypeClassify: "point",
  lampAttributes: LampAttributes["line"],
  timpsAttributes: { code: "0001", description: "line" },
  defectCodes: [],
  inspectionInstructions: "",
  inspectionForms: "",
  plannable: false,
  inspectable: false,
  location: true,
  menuFilter: false,
  allowedAssetTypes: [
    "track",
    "Switch",
    "Station",
    "Bridge",
    "Signal",
    "Crossing",
    "Pole line",
    "Interlockings",
    "Intermediate signals",
    "Yard Track",
  ],
};
export const track = {
  assetType: "track",
  assetTypeClassify: "linear",
  lampAttributes: LampAttributes["track"],
  timpsAttributes: { code: "0006", description: "Track" },
  defectCodes: defectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: trackInspForm,
  plannable: false,
  inspectable: true,
  location: false,
  defectCodesObj: defectCodes,
  inspectionFormsObj: JSON.parse(trackInspForm),
  allowedAssetTypes: ["rail", "3rd Rail", "Catenary Power", "Switch", "SCC", "DED", "Frogs", "Ties", "Bungalow", "Curve"],
};
export const switchAssetType = {
  assetType: "Switch",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0013", description: "Switch" },
  defectCodes: defectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: switchInspForm,
  plannable: false,
  inspectable: true,
  location: false,
  defectCodesObj: defectCodes,
  inspectionFormsObj: JSON.parse(switchInspForm),
  allowedAssetTypes: [],
};
let station = {
  assetType: "Station",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0030", description: "Station" },
  defectCodes: [],
  inspectionInstructions: "",
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};
let bridge = {
  assetType: "Bridge",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0016", description: "Bridge" },
  defectCodes: defectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};
let signal = {
  assetType: "Signal",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0011", description: "Signal" },
  defectCodes: SingalAppDefectCodes,
  defectCodesObj: SingalAppDefectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};
let rail = {
  lampAttributes: [
    {
      name: "section",
      type: "string",
      order: 1,
    },
    {
      name: "railType",
      type: "array",
      values: ["CWR", "Jointed"],
      order: 2,
    },
    {
      name: "railSide",
      type: "array",
      values: ["ER", "WR", "SR", "NR", "CR"],
      order: 3,
    },
    {
      name: "nearestStation",
      type: "string",
      order: 4,
    },
    {
      name: "stationSide",
      type: "array",
      values: ["East", "West", "South", "North", "Platform", "Shop", "Yard"],
      order: 5,
    },
  ],
  timpsAttributes: {
    code: "0007",
    description: "rail",
  },
  inspectable: true,
  plannable: false,
  location: false,
  menuFilter: false,
  allowedAssetTypes: [],
  parentAssetType: null,
  assetType: "rail",
  assetTypeClassify: "linear",
};
let thirdRail = {
  lampAttributes: [
    {
      name: "section",
      type: "string",
      order: 1,
    },
    {
      name: "railType",
      type: "array",
      values: ["CWR", "Jointed"],
      order: 2,
    },
    {
      name: "railSide",
      type: "array",
      values: ["ER", "WR", "SR", "NR", "CR"],
      order: 3,
    },
    {
      name: "nearestStation",
      type: "string",
      order: 4,
    },
    {
      name: "stationSide",
      type: "array",
      values: ["East", "West", "South", "North", "Platform", "Shop", "Yard"],
      order: 5,
    },
  ],
  timpsAttributes: {
    code: "0031",
    description: "3rd Rail",
  },
  inspectable: true,
  plannable: false,
  location: false,
  menuFilter: false,
  allowedAssetTypes: [],
  parentAssetType: null,
  assetType: "3rd Rail",
  assetTypeClassify: "linear",
};
let catenaryPower = {
  lampAttributes: [],
  timpsAttributes: {
    code: "0051",
    description: "Catenary Power",
  },
  inspectable: true,
  plannable: false,
  location: false,
  menuFilter: false,
  allowedAssetTypes: [],
  parentAssetType: null,
  assetType: "Catenary Power",
  assetTypeClassify: "linear",
};
export const crossings = {
  assetType: "Crossing",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0021", description: "Crossing" },
  defectCodes: SingalAppDefectCodes,
  defectCodesObj: SingalAppDefectCodes,
  inspectionInstructions: "",
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};
let interlockings = {
  assetType: "Interlockings",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0023", description: "Interlockings" },
  defectCodes: defectCodes,
  inspectionInstructions: "",
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};
let poleLine = {
  assetType: "Pole line",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0024", description: "Pole line" },
  defectCodes: defectCodes,
  inspectionInstructions: "",
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: ["Cable", "Fiber", "Transformers", "Regulators"],
};
let IntermediateSignals = {
  assetType: "Intermediate signals",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0025", description: "Intermediate signals" },
  defectCodes: defectCodes,
  inspectionInstructions: "",
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};
export let YardTrack = {
  assetType: "Yard Track",
  assetTypeClassify: "linear",
  lampAttributes: LampAttributes["YardTrack"],
  timpsAttributes: { code: "0026", description: "Yard Track" },
  defectCodesObj: defectCodes,
  inspectionInstructions: "",
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  markerMilepost: true,
  allowedAssetTypes: ["Curve"],
};
export const Curve = {
  assetType: "Curve",
  assetTypeClassify: "point",
  lampAttributes: LampAttributes["Curve"],
  timpsAttributes: { code: "0027", description: "Curve" },
  defectCodesObj: defectCodes,
  inspectionInstructions: "",
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};

export const SideTrack = {
  assetType: "Side Track",
  assetTypeClassify: "linear",
  lampAttributes: LampAttributes["sideTrack"],
  timpsAttributes: { code: "0006", description: "SideTrack" },
  defectCodes: defectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: trackInspForm,
  plannable: false,
  inspectable: true,
  location: false,
  defectCodesObj: defectCodes,
  inspectionFormsObj: JSON.parse(trackInspForm),
  allowedAssetTypes: ["Switch"],
};

export const SpurTrack = {
  assetType: "Spur",
  assetTypeClassify: "linear",
  lampAttributes: LampAttributes["sideTrack"],
  timpsAttributes: { code: "0006", description: "Spur" },
  defectCodes: defectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: trackInspForm,
  plannable: false,
  inspectable: true,
  location: false,
  defectCodesObj: defectCodes,
  inspectionFormsObj: JSON.parse(trackInspForm),
  allowedAssetTypes: ["Switch"],
};
export const StorageTrack = {
  assetType: "Storage Track",
  assetTypeClassify: "linear",
  lampAttributes: LampAttributes["sideTrack"],
  timpsAttributes: { code: "0006", description: "Storage Track" },
  defectCodes: defectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: trackInspForm,
  plannable: false,
  inspectable: true,
  location: false,
  defectCodesObj: defectCodes,
  inspectionFormsObj: JSON.parse(trackInspForm),
  allowedAssetTypes: ["Switch"],
};

export const RARTrack = {
  assetType: "RAR Track",
  assetTypeClassify: "linear",
  lampAttributes: LampAttributes["YardTrack"],
  timpsAttributes: { code: "0007", description: "RAR Track" },
  defectCodes: defectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: trackInspForm,
  markerMilepost: true,
  plannable: false,
  inspectable: true,
  location: false,
  defectCodesObj: defectCodes,
  inspectionFormsObj: JSON.parse(trackInspForm),
  allowedAssetTypes: ["Switch"],
};

export const switchLHAssetType = {
  assetType: "Switch LH",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0013", description: "Switch LH" },
  defectCodes: defectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: switchInspForm,
  plannable: false,
  inspectable: true,
  location: false,
  defectCodesObj: defectCodes,
  inspectionFormsObj: JSON.parse(switchInspForm),
  allowedAssetTypes: [],
};

export const switchRHAssetType = {
  assetType: "Switch RH",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0013", description: "Switch LH" },
  defectCodes: defectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: switchInspForm,
  plannable: false,
  inspectable: true,
  location: false,
  defectCodesObj: defectCodes,
  inspectionFormsObj: JSON.parse(switchInspForm),
  allowedAssetTypes: [],
};

export const Culvert = {
  assetType: "Culvert",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0016", description: "Culvert" },
  defectCodes: defectCodes,
  defectCodesObj: defectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};

export const CWRJointedTrack = {
  assetType: "CWR Jointed Track",
  assetTypeClassify: "linear",
  lampAttributes: LampAttributes["CWR Jointed Track"],
  timpsAttributes: { code: "0006", description: "CWR Jointed Track" },
  defectCodes: defectCodes,
  inspectionInstructions: inspectionInstructions,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  defectCodesObj: defectCodes,
  inspectionFormsObj: "",
  allowedAssetTypes: [],
};

export const AEIReaders = {
  assetType: "AEI Reader",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0016", description: "AEI Reader" },
  defectCodes: defectCodes,
  defectCodesObj: defectCodes,
  inspectionInstructions: null,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};
export const GradeCrossingWarning = {
  assetType: "Grade Crossing Warning",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0016", description: "Grade Crossing Warning" },
  defectCodes: defectCodes,
  defectCodesObj: defectCodes,
  inspectionInstructions: null,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};
export const HighWaterDetector = {
  assetType: "High Water Detector",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0016", description: "High Water Detector" },
  defectCodes: defectCodes,
  defectCodesObj: defectCodes,
  inspectionInstructions: null,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};
export const HotboxDetector = {
  assetType: "Hotbox Detector",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0016", description: "High Water Detecto" },
  defectCodes: defectCodes,
  defectCodesObj: defectCodes,
  inspectionInstructions: null,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};
export const TrainRadio = {
  assetType: "Train Radio",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0016", description: "Train Radio" },
  defectCodes: defectCodes,
  defectCodesObj: defectCodes,
  inspectionInstructions: null,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};

export const Diamond = {
  assetType: "Diamond",
  assetTypeClassify: "point",
  lampAttributes: [],
  timpsAttributes: { code: "0016", description: "Diamond" },
  defectCodes: defectCodes,
  defectCodesObj: defectCodes,
  inspectionInstructions: null,
  inspectionForms: "",
  plannable: false,
  inspectable: true,
  location: false,
  allowedAssetTypes: [],
};
