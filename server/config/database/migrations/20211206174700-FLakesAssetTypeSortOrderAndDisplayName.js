import AssetsTypeModel from "../../../api/assetTypes/assetTypes.model";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
import { RARTrack } from "../../../template/railRoadLocationsTemplate";
import AssetsModel from "../../../api/assets/assets.modal";
import AssetsService from "../../../api/assets/assets.service";
import AssetsTreeService from "../../../api/assetsTree/assetsTreeService";
import _ from "lodash";
var ObjectId = require("mongodb").ObjectID;
module.exports = {
  async up() {
    let assetService = new AssetsService();
    let assetTreeService = new AssetsTreeService();
    let locationsChildrenToUpdate = {};
    await addRARTrackAssetType();
    await sortAndDisplayNameAssetTypes();
    await setMainTrackInLanguageDic();
    let auburnYardLoc = await addAuburnYardLocation(assetService);
    let rarTrackList = await convertTracksToRAR(assetService, auburnYardLoc, locationsChildrenToUpdate);
    await createNewAssetsOfType(rarTrackList, assetService);
    console.log("Following tracks are added as RAR tracks");
    console.log(rarTrackList);
    let yardTracks = await convertTracksToYardTrack(assetService, auburnYardLoc, locationsChildrenToUpdate);
    await createNewAssetsOfType(yardTracks, assetService);
    console.log("Following tracks are added as Yard tracks");
    console.log(yardTracks);
    await moveAndCreateSwitchAssets(assetService, auburnYardLoc, locationsChildrenToUpdate);
    await moveAndCreateRARSwitchAssets(assetService, auburnYardLoc, locationsChildrenToUpdate);
    // await moveAssetsToLoc(locationsChildrenToUpdate, auburnYardLoc); no need for this as when they are recreated their parent childAsset list is updated
    await removeLocationChildrens(auburnYardLoc);
    console.log("Recreating asset hierarchy Tree");
    await assetTreeService.createHierarchyTree();
  },
  attributes: { applicationType: "TIMPS", customer: "Finger Lakes" },
};

let order = { Switch: 0, track: 1, "RAR Track": 2, "Yard Track": 3, Crossing: 4, Bridge: 5, Derail: 6, Frog: 7, Station: 8 };
let displayName = { track: "Main Track" };

async function sortAndDisplayNameAssetTypes() {
  console.log("Setting Fingerlake Asset Type filter sort order for assets screen and Asset type display Name");
  // set the sort order for asset filter list in asset screen and display names fields for asset type
  let allATypes = await AssetsTypeModel.find({ location: false }).exec();
  if (allATypes && allATypes.length > 0) {
    for (let aType of allATypes) {
      if (order[aType.assetType]) {
        aType.sortOrder = order[aType.assetType];
        displayName[aType.assetType] && (aType.displayName = displayName[aType.assetType]);
        await aType.save();
      }
    }
  }
}

async function setMainTrackInLanguageDic() {
  // Add main track name in dynamic language
  console.log("adding track name as Main Track in dictionary");
  let enLang = await ApplicationLookupsModel.findOne({ listName: "DynamicLanguage_en" }).exec();
  if (enLang) {
    enLang.opt1["track"] = { en: "Main Track" };
    enLang.markModified("opt1");
    await enLang.save();
  }
}

async function addRARTrackAssetType() {
  // Add AssetType of RAR Track and add to other as allowed assetType.
  let checkRARTrack = await AssetsTypeModel.findOne({ assetType: "RAR Track" }).exec();
  if (!checkRARTrack) {
    let rarTrack = new AssetsTypeModel(RARTrack);
    await rarTrack.save();
    let locs = await AssetsTypeModel.find({ location: true, parentAssetType: { $ne: null } }).exec();
    for (let loc of locs) {
      loc.allowedAssetTypes.push("RAR Track");
      loc.markModified("allowedAssetTypes");
      await loc.save();
    }
    console.log("RAR Track AssetType added");
  }
}

async function convertTracksToRAR(assetService, auburnYard, locsChildToUpdate) {
  // to fetch tracks that have Runarround in them to convert them to RAR track asset Type.
  console.log("fetching tracks named Runaround tracks and deleting them and gathering them to be created as RAR Track asset type");
  let rarToBeAdded = [];
  let rarToBeAssets = await AssetsModel.find({
    unitId: /.*Runaround.*/i,
    $and: [{ isRemoved: false }, { $or: [{ assetType: /.*track.*/i }, { assetType: /.*Yard Track.*/i }] }],
  });
  if (rarToBeAssets && rarToBeAssets.length > 0) {
    for (let rarAsset of rarToBeAssets) {
      let retObj = checkForLocUpdateForAsset(trackAssetsToMoveToOtherLocation, rarAsset, auburnYard);
      // if (retObj.pass) {
      //   for (let key in retObj.locList) {
      //     if (key && !locsChildToUpdate[key]) {
      //       locsChildToUpdate[key] = retObj.locList[key];
      //     } else if (key) {
      //       locsChildToUpdate[key] = [...locsChildToUpdate[key], ...retObj.locList[key]];
      //     }
      //   }
      // }
      let rarAttr = rarAttrCal(rarAsset);
      let newRARtrack = newTrackMaker(rarAsset, "RAR Track", rarAttr, retObj.parentAsset, retObj.lineId);
      rarToBeAdded.push(newRARtrack);
      await assetService.deleteAsset(rarAsset.id, true);
    }
  }
  return rarToBeAdded;
}

function newTrackMaker(track, assetType, attributes, parentAsset, lineId) {
  let lineIdVal = lineId ? lineId : track.lineId;
  let parent = parentAsset ? parentAsset : track.parentAsset;
  let newTrack = {
    coordinates: track.coordinates,
    inspectable: track.inspectable,
    parentAsset: parent,
    images: track.images,
    documents: track.documents,
    childAsset: track.childAsset,
    levels: track.levels,
    isRemoved: false,
    subdivision: track.subdivision,
    unitId: track.unitId,
    description: track.description,
    start: track.start,
    end: track.end,
    assetLength: track.assetLength,
    assetType: assetType,
    frequency: track.frequency,
    attributes: attributes,
    name: track.name,
    lineId:lineIdVal,
  };
  return newTrack;
}

function rarAttrCal(track) {
  let attr = {
    geoJsonCord: track.attributes.geoJsonCord,
    geoJsonCordFile: track.attributes.geoJsonCordFile,
    "Marker End": "",
    "Marker Start": "",
  };
  return attr;
}

async function createNewAssetsOfType(list, assetService) {
  for (let asset of list) {
    let result = await assetService.createAssetsLamp(asset, true);

    if (!result.errorVal) {
      let childAssets = await AssetsModel.find({ _id: { $in: asset.childAsset } }).exec();
      if (childAssets && childAssets.length > 0) {
        for (let child of childAssets) {
          child.isRemoved = false;
          child.parentAsset = result.value._id;
          await child.save();
          await assetService.assetCreateAssetTests(child);
        }
      }
    }
  }
}

async function convertTracksToYardTrack(assetService, auburnYard, locsChildToUpdate) {
  // to fetch tracks that have Runarround in them to convert them to RAR track asset Type.
  console.log(
    "fetching tracks that are not Main line or Runarround tracks and deleting them and gathering them to be created as Yard Track asset type",
  );
  let yTrackToBeAdded = [];
  let yTrackToBeAssets = await AssetsModel.find({
    $and: [{ unitId: { $not: /.*Main.*/i } }, { unitId: { $not: /.*Runaround.*/i } }],
    assetType: "track",
    isRemoved: false,
  });
  if (yTrackToBeAssets && yTrackToBeAssets.length > 0) {
    for (let yTrackAsset of yTrackToBeAssets) {
      let retObj = checkForLocUpdateForAsset(trackAssetsToMoveToOtherLocation, yTrackAsset, auburnYard);
      // if (retObj.pass) {
      //   for (let key in retObj.locList) {
      //     if (key && !locsChildToUpdate[key]) {
      //       locsChildToUpdate[key] = retObj.locList[key];
      //     } else if (key) {
      //       locsChildToUpdate[key] = [...locsChildToUpdate[key], ...retObj.locList[key]];
      //     }
      //   }
      // }
      let yTAttr = rarAttrCal(yTrackAsset);
      let newYTrack = newTrackMaker(yTrackAsset, "Yard Track", yTAttr, retObj.parentAsset, retObj.lineId);
      yTrackToBeAdded.push(newYTrack);
      await assetService.deleteAsset(yTrackAsset.id, true);
    }
  }
  return yTrackToBeAdded;
}

async function addAuburnYardLocation(assetService) {
  console.log("Adding Auburn Yard location");
  let auburnYardLocation = {
    coordinates: [],
    inspectable: false,
    parentAsset: "5ecdcac6cb55272624770850",
    images: [],
    documents: [],
    childAsset: [],
    levels: {
      1: "5ecdcaa4cb5527262477084f",
      2: "5ecdcac6cb55272624770850",
      3: "",
      currentLevel: "3",
    },
    isRemoved: false,
    unitId: "Auburn Yard",
    description: "Auburn Yard",
    name: "Auburn Yard",
    start: 23,
    end: 27,
    assetType: "Lines",
    attributes: {
      geoJsonCordFile: "",
      geoJsonCord: "",
      timezone: "America/New_York",
    },
    assetLength: 4,
    systemAttributes: {},
  };
  let auburnYardLoc = await AssetsModel.findOne({ unitId: auburnYardLocation.unitId, isRemoved: false }).exec();
  if (!auburnYardLoc) {
    await assetService.createAssetsLamp(auburnYardLocation, true);
    let parentLoc = await AssetsModel.findOne({ _id: ObjectId("5ecdcac6cb55272624770850") }).exec();
    auburnYardLoc = await AssetsModel.findOne({ unitId: auburnYardLocation.unitId, isRemoved: false }).exec();
    parentLoc.childAsset.push(auburnYardLoc.id);
    parentLoc.markModified("childAsset");
    await parentLoc.save();
  }
  return auburnYardLoc;
}

function checkForLocUpdateForAsset(assetList, asset, auburnYard) {
  let toRet = {
    locList: {},
    parentAsset: "",
    lineId: "",
    pass: false,
  };
  let newLocAsset = _.find(assetList, (upAsset) => {
    let idToString = upAsset._id.toString();
    let aIdToString = asset._id.toString();
    return idToString === aIdToString;
  });
  if (newLocAsset && newLocAsset.auburnYard) {
    toRet.parentAsset = auburnYard.id;
    toRet.lineId = auburnYard.id;
    toRet.locList[auburnYard.id] = [asset.id];
    toRet.pass = true;
  } else if (newLocAsset) {
    toRet.lineId = newLocAsset.newLineId;
    toRet.parentAsset = newLocAsset.newParentAsset;
    toRet.locList[newLocAsset.newParentAsset] = [asset.id];

    toRet.pass = true;
  }
  return toRet;
}
async function moveAndCreateSwitchAssets(assetService, auburnYard, locsChildToUpdate) {
  let switchIds = [];
  let switchMoved = [];
  for (let sw of switchAssetsToMove) {
    switchIds.push(sw._id);
  }
  let switchAssets = await AssetsModel.find({ _id: { $in: switchIds }, isRemoved: false });
  for (let sAsset of switchAssets) {
    let retObj = checkForLocUpdateForAsset(switchAssetsToMove, sAsset, auburnYard);
    let newSw = newTrackMaker(sAsset, "Switch", sAsset.attributes, retObj.parentAsset, retObj.lineId);
    await assetService.deleteAsset(sAsset.id, true);
    await createNewAssetsOfType([newSw], assetService);
    switchMoved.push(newSw);
  }
  console.log("Following Switch are moved and added to new locations");
  console.log(switchMoved);
}
async function moveAndCreateRARSwitchAssets(assetService) {
  let switchIds = [];
  let switchMoved = [];
  for (let sw of switchAssetToRARTrack) {
    switchIds.push(sw._id);
  }
  let switchAssets = await AssetsModel.find({ _id: { $in: switchIds }, isRemoved: false });
  for (let sAsset of switchAssets) {
    let pAItem = await AssetsModel.findOne({ isRemoved: false, assetType: "RAR Track", unitId: "Industrial Runaround Track" });
    let parentAsset = pAItem.id;
    let newSw = newTrackMaker(sAsset, "Switch", sAsset.attributes, parentAsset);
    await assetService.deleteAsset(sAsset.id, true);
    await createNewAssetsOfType([newSw], assetService);
    switchMoved.push(newSw);
  }
  console.log("Following  Switch are moved from Auburn Industrial and added to new RAR Track Industrial Runaround");
  console.log(switchMoved);
}
async function moveAssetsToLoc(locMoveList) {
  console.log("adding children to the locations that asset have moved to ");
  for (let locId in locMoveList) {
    let loc = await AssetsModel.findOne({ _id: ObjectId(locId) }).exec();
    if (loc) {
      loc.childAsset = [...loc.childAsset, ...locMoveList[locId]];
      loc.markModified("childAsset");
      await loc.save();
    } else {
      console.log("Error : 20211206174700-FLakesAssetTypeSortOrderAndDisplayName : Location to add chilren not found with id : ", locId);
    }
  }
}
async function removeLocationChildrens(auburnYard) {
  console.log("removing children from the locations that asset have been removed from");
  let locsList = {};
  generalMethod(trackAssetsToMoveToOtherLocation, locsList, auburnYard, "parentAsset");
  generalMethod(switchAssetsToMove, locsList, auburnYard, "parentAsset");
  for (let locId in locsList) {
    let loc = await AssetsModel.findOne({ _id: ObjectId(locId) }).exec();
    if (loc) {
      _.remove(loc.childAsset, (id) => {
        let check = _.find(locsList[locId], (cId) => {
          return cId === ObjectId(id);
        });
        return check;
      });
      loc.markModified("childAsset");
      await loc.save();
    } else {
      console.log(
        "Error : 20211206174700-FLakesAssetTypeSortOrderAndDisplayName : Location to remove children not found with id : ",
        locId,
      );
    }
  }
}
function generalMethod(list, locsList, auburnYard, pName, moveMethod) {
  for (let asset of list) {
    if (moveMethod && asset.auburnYard) {
      !locsList[auburnYard.id] && (locsList[auburnYard.id] = []);
      locsList[auburnYard.id] = [...locsList[auburnYard.id], ...[asset._id]];
    } else {
      !locsList[asset[pName]] && (locsList[asset[pName]] = []);
      locsList[asset[pName]] = [...locsList[asset[pName]], ...[asset._id]];
    }
  }
}

let trackAssetsToMoveToOtherLocation = [
  {
    _id: ObjectId("5efb8ef50a85e03020e41230"),
    unitId: "Gambee Runaround ",
    parentAsset: "5ece78c1d4cfcc01bc6f08ae",
    newParentAsset: "5ece789ad4cfcc01bc6f08ac",
    newParentName: "Geneva Yard",
  },
  {
    _id: ObjectId("5ed800d62995eb1e9ca00aeb"),
    unitId: "Owens Runaround Track",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed801832995eb1e9ca00aef"),
    unitId: "Owens Stub Track",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed802622995eb1e9ca00af3"),
    unitId: "Auburn Metals Stub Track",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed8066e2995eb1e9ca00b01"),
    parentAsset: "5ece801f7e2b0d04285c727f",
    unitId: "A1 Track",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed808612995eb1e9ca00b0d"),
    parentAsset: "5ece801f7e2b0d04285c727f",
    unitId: "Auburn Team Track",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed807682995eb1e9ca00b07"),
    parentAsset: "5ece801f7e2b0d04285c727f",
    unitId: "Nucor Track",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed806f92995eb1e9ca00b04"),
    parentAsset: "5ece801f7e2b0d04285c727f",
    unitId: "A2 Track",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed807e52995eb1e9ca00b0a"),
    parentAsset: "5ece801f7e2b0d04285c727f",
    unitId: "Auburn Transload Track",
    auburnYard: true,
  },
];
let switchAssetToRARTrack = [
  {
    _id: ObjectId("5ed80e072995eb1e9ca00b1e"),
    parentAsset: "61b0f3c49053ec363c7d70cb",
    parentAssetTyep: "Yard Track",
    parentUnitId: "Auburn Industrial Track",
    unitId: "Industrial Runaround West Switch",
    newParentAssetType: "RAR Track",
    newParentName: "Industrial Runaround Track",
  },
  {
    _id: ObjectId("5ed80c6a2995eb1e9ca00b17"),
    parentAsset: "61b0f3c49053ec363c7d70cb",
    parentAssetTyep: "Yard Track",
    parentUnitId: "Auburn Industrial Track",
    unitId: "Industrial Runaround East Switch",
    newParentAssetType: "RAR Track",
    newParentName: "Industrial Runaround Track",
  },
];
let switchAssetsToMove = [
  {
    _id: ObjectId("5efb822d0a85e03020e41229"),
    unitId: "Gambee Runaround East Switch",
    parentAsset: "5eea8bcc46f88619ec6fb8ab",
    newParentAsset: "5ece789ad4cfcc01bc6f08ac",
    newLineId: "5ece789ad4cfcc01bc6f08ac",
    newParentName: "Geneva Yard",
  },
  {
    _id: ObjectId("5efb824a0a85e03020e4122a"),
    unitId: "Gambee Runaround West Switch",
    parentAsset: "5eea8bcc46f88619ec6fb8ab",
    newParentAsset: "5ece789ad4cfcc01bc6f08ac",
    newLineId: "5ece789ad4cfcc01bc6f08ac",
    newParentName: "Geneva Yard",
  },
  {
    _id: ObjectId("5ed7ec1f01b256262c4a96cc"),
    unitId: "East Crossover Switch",
    parentAsset: "5e4ee10fc77acb0478b26edf",
    newLineId: "5ece78f9d4cfcc01bc6f08b1",
    newParentAsset: "5ece78f9d4cfcc01bc6f08b1",
    newParentName: "Solvay Yard",
  },
  {
    _id: ObjectId("5ed7ec9e01b256262c4a96ce"),
    unitId: "West Crossover Switch",
    parentAsset: "5e4ee10fc77acb0478b26edf",
    newLineId: "5ece78f9d4cfcc01bc6f08b1",
    newParentAsset: "5ece78f9d4cfcc01bc6f08b1",
    newParentName: "Solvay Yard",
  },
  {
    _id: ObjectId("5ed800352995eb1e9ca00ae8"),
    unitId: "Owens Runaround East Switch",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed800a22995eb1e9ca00aea"),
    unitId: "Owens Runaround West Switch",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed8007f2995eb1e9ca00ae9"),
    unitId: "Owens Stub Switch",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed7fffb2995eb1e9ca00ae7"),
    unitId: "Owens Illinois Switch",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed802102995eb1e9ca00af2"),
    unitId: "Auburn Metals Switch",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed803482995eb1e9ca00af9"),
    unitId: "A3 Switch",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed802fb2995eb1e9ca00af7"),
    unitId: "A1 Switch East",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed8037e2995eb1e9ca00afa"),
    unitId: "Nucor Switch",
    auburnYard: true,
    parentAsset: "5ece801f7e2b0d04285c727f",
  },
  {
    _id: ObjectId("5ed803242995eb1e9ca00af8"),
    unitId: "A2 Switch East",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed803f12995eb1e9ca00afc"),
    unitId: "A1 West Switch",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed803b52995eb1e9ca00afb"),
    unitId: "Auburn Transload Switch",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed804102995eb1e9ca00afd"),
    unitId: "Auburn Team Track Switch",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
  {
    _id: ObjectId("5ed804f72995eb1e9ca00aff"),
    unitId: "Auburn Industrial Switch",
    parentAsset: "5ece801f7e2b0d04285c727f",
    auburnYard: true,
  },
];
