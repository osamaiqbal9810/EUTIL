let ServiceLocator = require("../../framework/servicelocator");
let AssetsTreeModel = require("./assetsTreeModel");
var ObjectId = require("mongodb").ObjectID;
var turf = require("@turf/turf");
import moment from "moment";
import _ from "lodash";
class AssetsTreeService {
  async resolveLocation(geoJsonCord, milePost, uom) {
    let _geoJsonCord = geoJsonCord.features ? geoJsonCord.features[0].geometry.coordinates : geoJsonCord.geometry.coordinates;
    let line = turf.lineString(_geoJsonCord, { name: "line 1" });
    let along = turf.along(line, milePost, { units: uom });
    let coordinates = along ? along.geometry.coordinates : [];
    //return coordinates;
    return [coordinates[1], coordinates[0]];
  }

  async createHierarchyTree() {
    let AssetsModel;
    let AssetsTypeModel;

    AssetsModel = ServiceLocator.resolve("AssetsModel");
    AssetsTypeModel = ServiceLocator.resolve("AssetTypesModel");
    let allAssetTypes_Org = await AssetsTypeModel.find().exec();
    let allAssetTypesArray = [...allAssetTypes_Org];
    let allAssetTypes = {};
    allAssetTypesArray.forEach(
      (val) =>
        (allAssetTypes[val.assetType] = {
          assetType: val.assetType,
          inspectable: val.inspectable,
          plannable: val.plannable,
          location: val.location,
          assetTypeClassify: val.assetTypeClassify,
          menuFilter: val.menuFilter,
          displayName: val.displayName ? val.displayName : val.assetType,
        }),
    );
    // try {
    let allAssets_Org = await AssetsModel.find({ isRemoved: false }).exec();
    let allAssets = [...allAssets_Org];
    let assetsTree = {};
    if (allAssets) {
      let startTime = moment();
      let groupedAssets = _.groupBy(allAssets, "parentAsset");
      let groupedKeys = Object.keys(groupedAssets);
      await this.createHighestLevelTree(groupedAssets["null"], assetsTree, allAssetTypes);

      let groupedLength = groupedKeys.length;
      let count = 0;
      let arrayOfFoundFilledNodes = {};
      while (count < groupedLength - 1) {
        for (let gKey of groupedKeys) {
          if (gKey !== "" && gKey !== "null" && !arrayOfFoundFilledNodes[gKey]) {
            let found = await this.findAndCreateAssetIdInPosition(gKey, assetsTree, groupedAssets[gKey], allAssetTypes);
            if (found) {
              groupedAssets[gKey] = [];
              arrayOfFoundFilledNodes[gKey] = {};
            }
          }
        }
        count++;
      }
      //      console.log("groupedAssets", groupedAssets);
      //   console.log("assetsTree", assetsTree);
      let timeNow = moment();
      console.log("time taken in seconds : ", moment.duration(timeNow.diff(startTime)).asSeconds());
      let check = await AssetsTreeModel.findOne({ tag: "AssetTree" }).exec();
      if (!check) {
        let obj = {};

        obj.assetsTreeObj = assetsTree;
        obj.tag = "AssetTree";
        // let newData = new AssetsTreeModel(obj);
        let newData = await AssetsTreeModel.create(obj);
        newData.assetsTreeObj = assetsTree;
        newData.markModified("assetsTreeObj");
        let savedData = await newData.save();
      } else {
        check.assetsTreeObj = assetsTree;
        check.markModified("assetsTreeObj");
        let savedData = await check.save();
        //      console.log("updated existing", savedData);
      }
    }
    // convert the assets and their child array into map objects
    //} catch (err) {
    //  console.log("ERROR in createHierarchyTree: ", err);
    //}
  }
  async recursivelyFindAssetId(id, treeBranch, foundAssetInsideTree, found) {
    try {
      if (!found) {
        let aIds = Object.keys(treeBranch);
        for (let key of aIds) {
          if (found) return found;
          if (typeof treeBranch[key] === "object") {
            // treeBranch.properties &&
            //   (!foundAssetInsideTree[1] || treeBranch.properties.location) &&
            //   (foundAssetInsideTree[1] = { id: treeBranchKey, unitId: treeBranch.properties.unitId });
            if (key == id) {
              foundAssetInsideTree[key] = treeBranch[key];
              found = true;
              return found;
            } else {
              found = await this.recursivelyFindAssetId(id, treeBranch[key], foundAssetInsideTree, found);
            }
          } else {
            return false;
          }
        }
      }
      return found;
    } catch (err) {
      console.log("error in recursivelyFindAssetId : ", err);
    }
  }

  async recursivelyFindAssetIdAndFilter(id, treeBranch, foundAssetInsideTree, found) {
    try {
      if (!found) {
        let aIds = Object.keys(treeBranch);
        for (let key of aIds) {
          if (found) return found;
          if (typeof treeBranch[key] === "object") {
            // treeBranch.properties &&
            //   (!foundAssetInsideTree[1] || treeBranch.properties.location) &&
            //   (foundAssetInsideTree[1] = { id: treeBranchKey, unitId: treeBranch.properties.unitId });
            if (key == id) {
              foundAssetInsideTree[key] = treeBranch[key];
              found = true;
              return found;
            } else {
              found = await this.recursivelyFindAssetId(id, treeBranch[key], foundAssetInsideTree, found);
            }
          } else {
            return false;
          }
        }
      }
      return found;
    } catch (err) {
      console.log("error in recursivelyFindAssetId : ", err);
    }
  }

  async findAndCreateAssetIdInPosition(id, assetsTree, groupedAssets, allAssetTypes) {
    let foundAssetInsideTree = [];
    let found = false;

    found = await this.recursivelyFindAssetId(id, assetsTree, foundAssetInsideTree, found);
    if (found) {
      for (let g_asset of groupedAssets) {
        let locationParameters = {};
        let key = Object.keys(foundAssetInsideTree)[0];
        if (foundAssetInsideTree[key].properties.location) {
          locationParameters = { locationId: id, locationName: foundAssetInsideTree[key].properties.unitId };
        } else {
          locationParameters = {
            locationId: foundAssetInsideTree[key].properties.locationId,
            locationName: foundAssetInsideTree[key].properties.locationName,
          };
        }
        let assetTypes = allAssetTypes[g_asset.assetType];
        if (assetTypes) {
          foundAssetInsideTree[key][g_asset._id] = {
            properties: {
              unitId: g_asset.unitId,
              assetType: assetTypes.assetType,
              inspectable: assetTypes.inspectable,
              plannable: assetTypes.plannable,
              location: assetTypes.location,
              menuFilter: assetTypes.menuFilter,
              assetTypeClassify: assetTypes.assetTypeClassify,
              displayName: assetTypes.displayName ? assetTypes.displayName : assetTypes.assetType,
              ...locationParameters,
            },
          };
        } else {
          console.log("Asset Type '" + g_asset.assetType + "' not found");
          assetsTree[g_asset._id] = { properties: {} };
        }
      }
    }
    return found;
  }

  async createHighestLevelTree(pObj, assetsTree, allAssetTypes) {
    for (let obj of pObj) {
      let assetTypes = allAssetTypes[obj.assetType];
      if (assetTypes) {
        assetsTree[obj._id] = {
          properties: {
            unitId: obj.unitId,
            assetType: assetTypes.assetType,
            inspectable: assetTypes.inspectable,
            plannable: assetTypes.plannable,
            location: assetTypes.location,
            menuFilter: assetTypes.menuFilter,
            assetTypeClassify: assetTypes.assetTypeClassify,
            displayName: assetTypes.displayName ? assetTypes.displayName : assetTypes.assetType,
          },
        };
      } else {
        assetsTree[obj._id] = { properties: {} };
      }
    }
  }

  async getAllPlannableLocations() {
    let user = { _id: "admin", assignedLocation: await this.getTreeTopMostNodeId() };

    return await this.getPlannableLocations(user);
  }

  async getPlannableLocations(user) {
    if (user && user._id && user.assignedLocation) {
      let AssetsTreeModel = ServiceLocator.resolve("AssetsTreeModel");
      let AssetModel = ServiceLocator.resolve("AssetsModel");
      let assetTypeService = ServiceLocator.resolve("AssetsTypeService");

      let assetTree,
        resultObj = { value: {} };

      try {
        assetTree = await AssetsTreeModel.findOne({ tag: "AssetTree" }).exec();

        if (assetTree.assetsTreeObj) {
          //   console.log(assetTree.assetsTreeObj);
          const userAssignedLocation = user.assignedLocation;
          let foundAssetInsideTree = [];
          let found = false;

          found = await this.recursivelyFindAssetId(userAssignedLocation, assetTree.assetsTreeObj, foundAssetInsideTree, found);

          let treeToArray = [];

          if (found) {
            let key = Object.keys(foundAssetInsideTree)[0];
            if (foundAssetInsideTree[key]) {
              treeToArray = convertTreeToFlatArrayKeys(foundAssetInsideTree); //[key]);
              //resultObj.value.assetTree = foundAssetInsideTree[key];
              //resultObj.status = 200;
            }
            if (treeToArray.length > 0) {
              let criteria = { _id: { $in: treeToArray } };

              let result = await assetTypeService.getPlannableLocationTypes();
              let plannableLocationTypes = result.value ? result.value : null;

              if (plannableLocationTypes && plannableLocationTypes.length) {
                plannableLocationTypes = plannableLocationTypes.map((type, index) => {
                  return type.assetType;
                });

                criteria.assetType = plannableLocationTypes;

                // console.log('criteria', criteria);

                let assetsToReturn = await AssetModel.find(criteria).exec();
                assetsToReturn = assetsToReturn.map((asset, index) => {
                  return asset._id;
                });
                resultObj.status = 200;
                resultObj.value = assetsToReturn;
              } else {
                resultObj.status = 200;
                resultObj.value = []; // no plannable location asset types
                console.log("assetsTreeService.getPlannableLocations: No plannable location asset type found");
              }
            } else {
              resultObj.status = 200;
              resultObj.value = []; // no element in tree
              console.log("assetsTreeService.getPlannableLocations: No element found in tree");
            }
          } else {
            console.log("assetsTreeService.getPlannableLocations: Location Assigned to User not found in Asset Tree");

            resultObj.status = 200;
            resultObj.value = []; // no plannable location asset types
          }
        }
      } catch (err) {
        resultObj = { errorVal: err, status: 500 };
      }
      return resultObj;
    }
    return { errorVal: "assetsTreeService.getPlannableLocations: Invalid user", status: 500 };
  }
  async getTreeTopMostNodeId() {
    let AssetsTreeModel = ServiceLocator.resolve("AssetsTreeModel");
    let assetTree;
    assetTree = await AssetsTreeModel.findOne({ tag: "AssetTree" }).exec();

    let topAsset = [...assetTree];
    if (assetTree.assetsTreeObj) {
      return Object.keys(assetTree.assetsTreeObj)[0];
    }
  }
  async getAssetTree(nodeId) {
    let AssetsTreeModel = ServiceLocator.resolve("AssetsTreeModel");
    let assetTree;
    let foundAssetInsideTree = [];
    try {
      assetTree = await AssetsTreeModel.findOne({ tag: "AssetTree" }).exec();
      if (assetTree.assetsTreeObj) {
        const userAssignedLocation = nodeId;
        let found = false;
        found = await this.recursivelyFindAssetId(userAssignedLocation, assetTree.assetsTreeObj, foundAssetInsideTree, found);
      }
    } catch (ex) {
      console.error(ex.toString());
    }
    return foundAssetInsideTree;
  }
  async getArrayByNode(nodeId) {
    let foundAssetInsideTree = [];
    foundAssetInsideTree = await this.getAssetTree(nodeId);
    let key = Object.keys(foundAssetInsideTree)[0];
    if (foundAssetInsideTree[key]) {
      foundAssetInsideTree = this.treeToArray(foundAssetInsideTree[key]);
    }
    return [nodeId].concat(foundAssetInsideTree);
  }
  treeToArray(treeBranch) {
    let resultArray = [];
    let aIds = Object.keys(treeBranch);
    for (let key of aIds) {
      if (key !== "properties") {
        if (typeof treeBranch[key] === "object") {
          resultArray.push(key);
          let retArray = this.treeToArray(treeBranch[key]);
          if (retArray) {
            resultArray = resultArray.concat(retArray);
          }
        }
      }
    }
    return resultArray;
  }
  async findAssetFlat(nodeId) {
    let foundAssetInsideTree = [];
    foundAssetInsideTree = await this.getAssetTree(nodeId);
    let key = Object.keys()[0];
    if (foundAssetInsideTree[key]) {
      return convertTreeToFlatArrayKeys(foundAssetInsideTree); //[key]);
    }
    return [];
  }
  async filterTreeGetLineOtherAssets(treeObj, ofilteredTreeArray) {
    //don't itterate track assets
    let keys = Object.keys(treeObj);
    let properties = treeObj["properties"];
    let retValue = false;

    if (properties) {
      retValue = isObjectContain(properties, { assetType: "track" });
      if (retValue) {
        return false;
      } else {
        retValue = true;
      }
    }
    let v;
    for (let key of keys) {
      if (key != "properties") {
        v = await this.filterTreeGetLineOtherAssets(treeObj[key], ofilteredTreeArray);
        if (v) {
          if (key != "0") ofilteredTreeArray.push(key);
        }
      }
    }
    return retValue;
  }
  async filterTreeByProperties(treeObj, propertiesObj, ofilteredTreeArray) {
    let keys = Object.keys(treeObj);
    let properties = treeObj["properties"];
    let retValue = false;

    if (properties) {
      retValue = isObjectContain(properties, propertiesObj);
    }
    let v;
    for (let key of keys) {
      if (key != "properties") {
        v = await this.filterTreeByProperties(treeObj[key], propertiesObj, ofilteredTreeArray);
        if (v) {
          if (key != "0") ofilteredTreeArray.push(key);
        }
      }
    }
    return retValue;
  }
}
export default AssetsTreeService;

function convertTreeToFlatArrayKeys(tree) {
  let arrayOfKeys = [];
  recursivelyConvertTree(tree, arrayOfKeys);
  return arrayOfKeys;
}
function isObjectContain(objOne, objTwo) {
  return !!_([objOne]).filter(objTwo).size();
}
function recursivelyConvertTree(treeObj, arrayOfKeys) {
  let keys = Object.keys(treeObj);
  for (let key of keys) {
    if (key != "properties") {
      arrayOfKeys.push(ObjectId(key));
      recursivelyConvertTree(treeObj[key], arrayOfKeys);
    }
  }
}

// for self understanding , not in use
let asset1 = { asset2, asset10 };
let asset2 = { asset3: { asset4: { asset5: {}, asset6: {} }, asset7: {} }, asset8: { asset9: {} } };
let asset10 = {
  asset11: { asset12: {}, asset13: { asset14: { asset15: {}, asset16: {} } } },
  asset17: {
    asset18: {},
    asset19: {},
  },
  asset20: {},
};
