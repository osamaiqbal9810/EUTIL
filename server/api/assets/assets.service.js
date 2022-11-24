import { templateSettings } from "../../template/config";
import AssetsTypeModel from "../assetTypes/assetTypes.model";
import _ from "lodash";
let ServiceLocator = require("../../framework/servicelocator");
var ObjectId = require("mongodb").ObjectID;
var turf = require("@turf/turf");
class AssetsService {
  async getInspectableAssets(user) {
    // modelToFetch = "MaintenanceModel";
    // KeyToSearch = "lineId";
    let AssetsModel, assetsResultObj, treeToArray;
    assetsResultObj = { value: {} };

    try {
      AssetsModel = ServiceLocator.resolve("AssetsModel");

      treeToArray = await this.getFilteredAssetsIds(user, { inspectable: true }, true);
      if (treeToArray.assetIds && treeToArray.assetIds.length > 0) {
        let criteria = { _id: { $in: treeToArray.assetIds } };
        let data = await AssetsModel.find(criteria).exec();

        assetsResultObj.status = 200;
        assetsResultObj.value.assets = data;
      }
    } catch (err) {
      assetsResultObj = { errorVal: err, status: 500 };
    }

    return assetsResultObj;
  }

  async getFilteredAssetsIds(user, filterCriteria, userAsset) {
    // modelToFetch = "MaintenanceModel";
    // KeyToSearch = "lineId";
    let AssetsTreeModel, assetTree, resultObj, AssetsTreeService, AssetsModel, AssetTypesModel;
    resultObj = { assetIds: [] };

    try {
      AssetsTreeModel = ServiceLocator.resolve("AssetsTreeModel");
      AssetTypesModel = ServiceLocator.resolve("AssetTypesModel");
      AssetsModel = ServiceLocator.resolve("AssetsModel");
      assetTree = await AssetsTreeModel.findOne({ tag: "AssetTree" }).exec();
      if (assetTree.assetsTreeObj) {
        const USER_ASSET = user.assignedLocation;
        AssetsTreeService = ServiceLocator.resolve("AssetsTreeService");
        let foundAssetInsideTree = [];
        let found = false;
        found = await AssetsTreeService.recursivelyFindAssetIdAndFilter(USER_ASSET, assetTree.assetsTreeObj, foundAssetInsideTree, found);
        let treeToArray = [];
        if (found) {
          if (foundAssetInsideTree[Object.keys(foundAssetInsideTree)[0]]) {
            treeToArray = await convertTreeToFlatArrayKeys(foundAssetInsideTree, filterCriteria); //[Object.keys(foundAssetInsideTree)[0]]

            if (userAsset) {
              let userAssetObject = await AssetsModel.findOne({ _id: user.assignedLocation }).exec();
              let assetType = await AssetTypesModel.findOne({ assetType: userAssetObject.assetType }).exec();
              let critKeys = Object.keys(filterCriteria);
              let criteriaCheck = true;
              for (let key of critKeys) {
                filterCriteria[key] !== assetType[key] && (criteriaCheck = false);
              }
              if (criteriaCheck) {
                treeToArray.push(ObjectId(userAssetObject._id));
              }
            }

            resultObj.assetIds = treeToArray;
          }
        } else {
          console.log("getUserLampAssets: Assigned asset to User is not found in Asset Tree");
        }
      }
    } catch (err) {
      resultObj = { errorVal: err, status: 500 };
    }
    return resultObj;
  }

  async getUserLampAssets(user, query) {
    let AssetsTreeModel, assetTree, resultObj, AssetsModel, AssetsTreeService;
    resultObj = { value: {} };
    let location = query.location;

    try {
      AssetsModel = ServiceLocator.resolve("AssetsModel");
      AssetsTreeModel = ServiceLocator.resolve("AssetsTreeModel");
      assetTree = await AssetsTreeModel.findOne({ tag: "AssetTree" }).exec();
      if (assetTree.assetsTreeObj) {
        //   console.log(assetTree.assetsTreeObj);
        const USER_ASSET = user.assignedLocation;
        AssetsTreeService = ServiceLocator.resolve("AssetsTreeService");
        let foundAssetInsideTree = {}; // [];
        let found = false;
        found = await AssetsTreeService.recursivelyFindAssetId(USER_ASSET, assetTree.assetsTreeObj, foundAssetInsideTree, found);
        let treeToArray = [];
        if (found) {
          let key = Object.keys(foundAssetInsideTree)[0];
          if (foundAssetInsideTree[key]) {
            treeToArray = await convertTreeToFlatArrayKeys(foundAssetInsideTree); //[key]);
            resultObj.value.assetTree = foundAssetInsideTree; //[key];
            resultObj.status = 200;
          }
          if (treeToArray.length > 0) {
            let criteria = { _id: { $in: treeToArray } };
            let AssetTypesService = ServiceLocator.resolve("AssetsTypeService");
            let assetsToReturn = await AssetsModel.find(criteria).exec();
            let assetsTypes = await AssetTypesService.get_AssetTypes();

            resultObj.status = 200;
            resultObj.value.assetsList = assetsToReturn;
            resultObj.value.assetsTypes = assetsTypes.value;
          }
        } else {
          console.log("getUserLampAssets: Assigned asset to User is not found in Asset Tree");
        }
      }
    } catch (err) {
      resultObj = { errorVal: err, status: 500 };
    }
    return resultObj;
  }
  async getLineCriteriaByUser(user) {
    let assetTreeService = ServiceLocator.resolve("AssetsTreeService");
    let result = await assetTreeService.getPlannableLocations(user);
    let plannableLocations = result.value ? result.value : [];
    return { $in: plannableLocations };
  }

  async getTimezones(assets) {
    let criteria = { _id: { $in: assets } };
    let assetModel = ServiceLocator.resolve("AssetsModel");
    let assetsCollection = await assetModel.find(criteria).select("_id attributes").exec();
    let assetTimezone = [];
    if (assetsCollection && assetsCollection.length) {
      for (let asset of assetsCollection) {
        if (asset.attributes && asset.attributes.timezone) assetTimezone[asset._id] = asset.attributes.timezone;
        else assetTimezone[asset._id] = "";
      }
    }

    return assetTimezone;
  }

  async getAssetsLamp(requestUser, lineId) {
    let resultObj,
      AssetsModel,
      adminCheck,
      subdivisionUser,
      assetsList,
      criteria = { lineId: lineId };
    /*
      CHANGE: DATE : Nov, 05, 2019
      REASON: 
    */
    criteria.lineId = this.getLineCriteriaByUser(user);

    resultObj = {};
    AssetsModel = ServiceLocator.resolve("AssetsModel");
    adminCheck = requestUser.isAdmin;
    subdivisionUser = requestUser.subdivision;
    try {
      if (!adminCheck && subdivisionUser !== "All") {
        //criteria.subdivision = subdivisionUser;
        assetsList = await AssetsModel.find(criteria).exec();
        resultObj = { value: assetsList, status: 200 };
      } else {
        assetsList = await AssetsModel.find(criteria).exec();
        resultObj = { value: assetsList, status: 200 };
      }
    } catch (e) {
      resultObj = { errorVal: e, status: 500 };
    }
    return resultObj;
  }

  async getAllAssetsLamp(requestUser) {
    let resultObj,
      AssetsModel,
      adminCheck,
      subdivisionUser,
      assetsList,
      criteria = {};
    resultObj = {};
    AssetsModel = ServiceLocator.resolve("AssetsModel");
    adminCheck = requestUser.isAdmin;
    subdivisionUser = requestUser.subdivision;
    try {
      if (!adminCheck && subdivisionUser !== "All") {
        //criteria.subdivision = subdivisionUser;
        assetsList = await AssetsModel.find(criteria).exec();
        resultObj = { value: assetsList, status: 200 };
      } else {
        assetsList = await AssetsModel.find(criteria).exec();
        resultObj = { value: assetsList, status: 200 };
      }
    } catch (e) {
      resultObj = { errorVal: e, status: 500 };
    }
    return resultObj;
  }
  async createAssetsLampWizard(asset) {
    let sampleobj = {
      wizard: true,
      parentAsset: {
        _id: "5e8640addcba88429077afc5",
      },
      trackAssets: [
        {
          unitId: "track 1",
          assetType: "track",
          start: 0,
          end: 13.35,
        },
        {
          unitId: "rail E @track 1",
          assetType: "rail",
          start: 0,
          end: 13.35,
          length: 13.35,
        },
        {
          unitId: "rail W @track 1",
          assetType: "rail",
          start: 0,
          end: 13.35,
          length: 13.35,
        },
        {
          unitId: "3rd Rail @track 1",
          assetType: "rail",
          start: 0,
          end: 13.35,
          length: 13.35,
        },
      ],
      trackData: {
        primaryTrack: true,
        trackNumber: 1,
        description: "track",
        mpStart: 0,
        mpEnd: 13.35,
        electrified: true,
        electValue: "3rdRail",
        railOrientation: "EW",
      },
    };
    let resultObj, AssetsModel, trackAssetObj, parentAsset, trackData, primaryTrack;
    resultObj = {};
    AssetsModel = ServiceLocator.resolve("AssetsModel");

    let utils = ServiceLocator.resolve("utils");

    let AssetsTreeService = ServiceLocator.resolve("AssetsTreeService");
    trackData = asset.trackData;
    let mpStart = utils.toFixed(trackData.mpStart);
    let mpEnd = utils.toFixed(trackData.mpEnd);
    let assetLength = utils.toFixed(trackData.mpEnd - trackData.mpStart);
    let geoJsonCord = asset.geoJsonCord;
    let trackJsonCord = trackData.geoJsonCord ? JSON.stringify(trackData.geoJsonCord) : null;
    try {
      // add track asset
      parentAsset = asset.parentAssetObj._id;
      primaryTrack = trackData.primaryTrack;
      trackAssetObj = {
        coordinates: [],
        inspectable: true,
        parentAsset: parentAsset,
        images: [],
        documents: [],
        childAsset: [],
        isRemoved: false,
        subdivision: "",
        unitId: trackData.trackName,
        description: trackData.description,
        start: mpStart,
        end: mpEnd,
        assetLength: assetLength,
        assetType: "track",
        frequency: null,
        attributes: {
          "Local Track Name": trackData.localTrackName,
          primaryTrack: primaryTrack,
          railOrientation: trackData.railOrientation,
        },
        name: trackData.description,
        lineId: parentAsset,
        trackId: parentAsset,
      };

      if (trackJsonCord) {
        if (!trackAssetObj.attributes) {
          trackAssetObj.attributes = {};
        }
        trackAssetObj.attributes.geoJsonCord = trackJsonCord;
      }

      let trackAsset = new AssetsModel(trackAssetObj);

      let savedTrackAsset = await trackAsset.save();
      let parent = null;
      if (savedTrackAsset.parentAsset) {
        parent = await AssetsModel.findById(savedTrackAsset.parentAsset).exec();
        await this.manageLevels(savedTrackAsset, parent);
      }
      let trackAssets = asset.trackAssets;
      for (let i = 0; i < trackAssets.length; i++) {
        if (trackAssets[i].assetType != "track") {
          mpStart = utils.toFixed(trackAssets[i].start);
          mpEnd = utils.toFixed(trackAssets[i].end);
          assetLength = utils.toFixed(trackAssets[i].end - trackAssets[i].start);
          let trackChildObj = {
            inspectable: true,
            parentAsset: savedTrackAsset._id,
            isRemoved: false,
            subdivision: "",
            unitId: trackAssets[i].unitId,
            description: trackAssets[i].unitId,
            start: mpStart,
            end: mpEnd,
            assetLength: assetLength,
            assetType: trackAssets[i].assetType,
            frequency: null,
            name: trackAssets[i].assetType,
            lineId: parentAsset,
            trackId: savedTrackAsset._id,
          };
          let trackChild = new AssetsModel(trackChildObj);
          await this.manageLevels(trackChild, savedTrackAsset);
          let saveTrackChild = await trackChild.save();
          savedTrackAsset.childAsset.push(saveTrackChild._id);
        }
      }
      savedTrackAsset.markModified("childAsset");
      if (savedTrackAsset.parentAsset) {
        //parent.childAsset.push(savedTrackAsset._id);
        if (primaryTrack) {
          parent.start = savedTrackAsset.start;
          parent.end = savedTrackAsset.end;
        }
        if (geoJsonCord) {
          if (!parent.attributes) {
            parent.attributes = {};
          }
          parent.attributes.geoJsonCord = geoJsonCord;
        }
        parent.markModified("attributes");
        parent.markModified("childAsset");
        let savedParent = await parent.save();
        if (savedParent.assetType == "track") {
          savedTrackAsset.trackId = savedParent._id;
        } else {
          savedTrackAsset.trackId = savedParent.trackId;
        }

        let finalSavedAsset = await savedTrackAsset.save();
        await AssetsTreeService.createHierarchyTree();

        resultObj = { value: finalSavedAsset, status: 200 };
      } else {
        resultObj = { value: savedTrackAsset, status: 200 };
      }
      await this.assetCreateAssetTests(savedTrackAsset);
    } catch (error) {
      console.log(error);
      resultObj = { errorVal: error, status: 500 };
    }
    return resultObj;
  }
  async createMultipleAssets( multipleAssets ) {
    let resultObj = {}, AssetsModel;
    let utils = ServiceLocator.resolve('utils');
    
    AssetsModel = ServiceLocator.resolve('AssetsModel');
    
    try {
      if(!multipleAssets || !multipleAssets.length )
        return {status: 400, errorVal:'Assets list missing'};
      if(!multipleAssets[0] || !multipleAssets[0].parentAsset)
        return {status: 400, errorVal:{message: 'All assets must have a parent.'}}

      const parentAssetId =  multipleAssets[0].parentAsset;
      const parentAsset = await AssetsModel.findById(parentAssetId).exec();
      // console.log('assets.service.createMultipleAssets: parent id:', parentAssetId);

      for (let asset of multipleAssets) {
        if(asset.parentAsset !== parentAssetId) {
          // console.log('Different parent asset:', asset );
          return {status: 400, errorVal: {message: 'All asssets must have same parent.'}}
        }
      }
      
      for(let asset of multipleAssets) {

        if(asset.start) asset.start = utils.toFixed(asset.start);
        if(asset.end) asset.end = utils.toFixed(asset.end);
        if(asset.assetLength) asset.assetLength = utils.toFixed(asset.assetLength);
          else asset.assetLength = utils.toFixed(asset.end - asset.start);
        // console.log('asset start, end, length:', asset.start, asset.end, asset.assetLength);
        let newAsset = new AssetsModel(asset);
        newAsset.levels = { 1: null, 2: null, 3: null, currentLevel: null } // Todo: Execute actual level calculation if required
        
        if (parentAsset.assetType == "track") {
          newAsset.trackId = parentAsset._id;
        } else {
          newAsset.trackId = parentAsset.trackId;
        }
        let savedAsset = await newAsset.save();
        parentAsset.childAsset.push(savedAsset._id);
        
        // todo optimize the test creation logic 
        // await this.assetCreateAssetTests(savedAsset);
      }
      
      // pushed asset ids to the children list of the parent, so save
      parentAsset.markModified("childAsset");
      let savedParent = await parentAsset.save();
      
      let AssetsTreeService = ServiceLocator.resolve("AssetsTreeService");
      await AssetsTreeService.createHierarchyTree();
      resultObj = { value: savedParent, status: 200 };
    } catch(error) {
       console.log(error);
      resultObj = { errorVal: error, status: 500 };
    }
    
    return resultObj;
  }
  async createAssetsLamp(asset) {
    let resultObj, AssetsModel, adminCheck, subdivisionUser, assetsList;
    resultObj = {};
    AssetsModel = ServiceLocator.resolve("AssetsModel");
    let utils = ServiceLocator.resolve("utils");

    let AssetsTreeService = ServiceLocator.resolve("AssetsTreeService");
    try {
      if (asset.start) asset.start = utils.toFixed(asset.start);

      if (asset.end) asset.end = utils.toFixed(asset.end);

      if (asset.assetLength) asset.assetLength = utils.toFixed(asset.assetLength);

      //await this.copyMarkerFields(asset);

      let newAsset = new AssetsModel(asset);

      let savedAsset = await newAsset.save();

      if (savedAsset.parentAsset) {
        let parent = await AssetsModel.findById(savedAsset.parentAsset).exec();
        parent.childAsset.push(savedAsset._id);
        parent.markModified("childAsset");
        await this.manageLevels(savedAsset, parent);
        let savedParent = await parent.save();

        if (savedParent.assetType == "track") {
          savedAsset.trackId = savedParent._id;
        } else {
          savedAsset.trackId = savedParent.trackId;
        }

        let finalSavedAsset = await savedAsset.save();
        await AssetsTreeService.createHierarchyTree();

        resultObj = { value: finalSavedAsset, status: 200 };
      } else {
        resultObj = { value: savedAsset, status: 200 };
      }
      await this.assetCreateAssetTests(savedAsset);
    } catch (error) {
      console.log(error);
      resultObj = { errorVal: error, status: 500 };
    }
    return resultObj;
  }
  async assetCreateAssetTests(asset, remove) {
    let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
    let assetTestsService = ServiceLocator.resolve("AssetTestsService");
    let AssetTestModel = ServiceLocator.resolve("AssetTestModel");
    let criteria = { listName: "appForms", "opt2.config.assetType": asset.assetType };
    let assetCrit = { _id: asset._id };
    try {
      let appForms = await ApplicationLookupsModel.find(criteria).exec();
      if (appForms && appForms.length > 0) {
        for (let appForm of appForms) {
          let testObject = _.find(appForm.opt2.config, { assetType: asset.assetType });
          if (testObject) {
            if (remove) {
              await AssetTestModel.updateOne({ assetId: asset.id, testCode: appForm.code }, { isRemoved: true });
              let methodCriterias = {
                assetId: asset.id,
              };
              await assetTestsService.updateTestOnTemplateUnits(methodCriterias, appForm.code, "remove");
            } else {
              await assetTestsService.createTestProcess(testObject, appForm, assetCrit);
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getParentLines(user) {
    let resultObj = {},
      assets;

    let AssetsModel = ServiceLocator.resolve("AssetsModel");
    let assetTreeService = ServiceLocator.resolve("AssetsTreeService");
    let result = await assetTreeService.getPlannableLocations(user);
    let plannableLocations = result.value ? result.value : [];
    // let criteria = { assetType: "line" };
    // if (!user.isAdmin) criteria.subdivision = user.subdivision;

    try {
      //assets = await AssetsModel.find(criteria).exec();
      assets = await AssetsModel.find({ _id: { $in: plannableLocations } });
      resultObj = { value: assets, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
    }

    return resultObj;
  }
  async getParentLinesWithSelf(user, criteria) {
    let resultObj = {},
      assets;

    if (!criteria) {
      criteria = { location: true, plannable: true };
    }

    let AssetsModel = ServiceLocator.resolve("AssetsModel");
    // let assetTreeService = ServiceLocator.resolve("AssetsTreeService");
    // let result = await assetTreeService.getPlannableLocations(user);
    // let plannableLocations = result.value ? result.value : [];
    // let criteria = { assetType: "line" };
    // if (!user.isAdmin) criteria.subdivision = user.subdivision;
    let assetIds = await this.getFilteredAssetsIds(user, criteria, true);

    try {
      //assets = await AssetsModel.find(criteria).exec();
      assets = await AssetsModel.find({ _id: { $in: assetIds.assetIds } });
      resultObj = { value: assets, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
    }

    return resultObj;
  }
  async getChildAssets(
    parentId, // recursive function to get all childern
  ) {
    let AssetsModel = ServiceLocator.resolve("AssetsModel");
    let fullList = [];
    let assets = await AssetsModel.find({ parentAsset: parentId }).exec();
    for (const asset of assets) {
      fullList.push(asset);
      let childern = await this.getChildAssets(asset.id);
      fullList = [...fullList, ...childern];
    }

    return fullList;
  }
  async getAssetsForLine(lineName, user) {
    let resultObj = {},
      assets;
    let AssetsModel = ServiceLocator.resolve("AssetsModel");
    let criteria = { assetType: "line", unitId: lineName };

    if (!user.isAdmin) criteria.subdivision = user.subdivision;

    try {
      let line = await AssetsModel.findOne(criteria).exec();
      let assets = await this.getChildAssets(line.id);

      resultObj = { value: assets, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
    }

    return resultObj;
  }
  async getAssetTypeAssets(assetObj) {
    let resultObj, assetType, line_id, AssetsModel;
    assetType = assetObj.assetType;
    line_id = assetObj.lineId;
    AssetsModel = ServiceLocator.resolve("AssetsModel");
    try {
      let assets = await AssetsModel.find({
        lineId: line_id,
        assetType: assetType,
      }).exec();
      resultObj = { value: assets, status: 200 };
    } catch (error) {
      resultObj = { errorVal: error.toString(), status: 500 };
    }
    return resultObj;
  }
  async updateAsset(asset) {
    let resultObj, AssetsModel;
    AssetsModel = ServiceLocator.resolve("AssetsModel");
    let assetTreeService = ServiceLocator.resolve("AssetsTreeService");
    let assetTestsService = ServiceLocator.resolve("AssetTestsService");
    let utils = ServiceLocator.resolve("utils");
    try {
      let query = { _id: asset._id };

      if (asset.start) asset.start = utils.toFixed(asset.start);

      if (asset.end) asset.end = utils.toFixed(asset.end);

      if (asset.assetLength) asset.assetLength = utils.toFixed(asset.assetLength);

      let testRecreateCheck = AssetsModel.findOne({ ...query, $or: [{ start: { $ne: asset.start } }, { end: { $ne: asset.end } }] });
      let savedAsset = await AssetsModel.findOneAndUpdate(query, asset, {
        upsert: true,
        new: true,
      }).exec();
      await assetTreeService.createHierarchyTree();
      if (testRecreateCheck) {
        this.assetCreateAssetTests(savedAsset);
      }

      resultObj = { value: asset, status: 200 };
    } catch (error) {
      resultObj = { errorVal: error.toString(), status: 500 };
    }
    return resultObj;
  }

  async updateMultipleAsset(bodyObj) {
    let resultObj = { errorVal: "No logic found", status: 500 };

    if (bodyObj._id == "multi") {
      let AssetModel = ServiceLocator.resolve("AssetsModel");

      try {
        let result = await AssetModel.updateMany({ _id: { $in: bodyObj.assets } }, { $set: { ...bodyObj.propsToUpdate } });
        resultObj = { value: {}, status: 200 };
      } catch (err) {
        console.log("assets.service.updateMultipleAsset.catch err:", err.toString());
        resultObj = { errorVal: err.toString(), status: 500 };
      }
    }
    return resultObj;
  }
  async getAssetIdsForUnitIds(unitIds) {
    let AssetModel = ServiceLocator.resolve("AssetsModel");
    let result = [];
    try {
      result = await AssetModel.find({ unitId: { $in: unitIds } }, { _id: 1 });
    } catch (err) {
      console.log("assets.service.getAssetIdsForUnitIds.catch err:", err.toString());
    }
    return result.map((r) => {
      return r._id;
    });
  }
  async find(id) {
    let resultObj, AssetsModel;
    let AssetModel = ServiceLocator.resolve("AssetsModel");
    try {
      if (id) {
        let asset = await AssetModel.findById(id).exec();
        resultObj = { value: asset, status: 200 };
      }
    } catch (error) {
      resultObj = { errorVal: error.toString(), status: 500 };
    }

    return resultObj;
  }
  async deleteAsset(id) {
    let AssetModel = ServiceLocator.resolve("AssetsModel");
    let assetsTreeService = ServiceLocator.resolve("AssetsTreeService");
    let AssetsTreeModel = ServiceLocator.resolve("AssetsTreeModel");
    let wPlanTemplate = ServiceLocator.resolve("WorkPlanTemplateModel");
    let result = { errorVal: "default", status: 200 };
    try {
      if (id) {
        let assetsToDelete = await AssetModel.findById(id).exec();
        if (assetsToDelete) {
          let assetArray = await assetsTreeService.getArrayByNode(id);
          let treeNode = await assetsTreeService.getAssetTree(id);
          let plannableLocs = [];
          await assetsTreeService.filterTreeByProperties(treeNode, { location: true, plannable: true }, plannableLocs);
          let criteria = { _id: { $in: [...assetArray] } };
          let assetList = await AssetModel.find(criteria).exec();

          // remove all the plannable location workplans
          let locTemplates = await wPlanTemplate.find({ lineId: { $in: plannableLocs } }).exec();
          if (locTemplates && locTemplates.length > 0) {
            for (let template of locTemplates) {
              template.isRemoved = true;
              await template.save();
            }
          }

          // delete the whole node assets form the template
          // console.log('deleting',assetsToDelete.length, 'assets'); // todo log user and assets being deleted

          let templates = await wPlanTemplate.find({ inspectionAssets: { $in: assetArray } }).exec();
          //[...templates];
          let tLength = templates.length;
          for (let i = 0, l = tLength; i < l; i++) {
            //   console.log(templates[i]._id.toString());
            let template = templates[i];
            if (template.tasks) {
              for (let t = 0, tl = template.tasks.length; t < tl; t++) {
                let units = template.tasks[t].units || [];
                template.tasks[t].units = units.filter((item) => !assetArray.includes(item.id));
              }
            }
            template.markModified("tasks");
            template.markModified("tasks.units");
            // console.log(template);
            template.inspectionAssets = template.inspectionAssets.filter((item) => !assetArray.includes(item));
            await template.save();
          }

          let assetListLength = assetList.length;
          for (let i1 = 0, l1 = assetListLength; i1 < l1; i1++) {
            assetList[i1].isRemoved = true;
            await this.assetCreateAssetTests(assetList[i1], true);
            await assetList[i1].save();
          }
          /*           Promise.all(
            templates.map(item => {
              console.log(item._id);
            }),
          );
 */
          assetsTreeService.createHierarchyTree();
          //   console.log(`Deleting [${assetArray}]`); // console.log('delete result', result.value); // todo: log
          /*           result.value = await AssetModel.remove({
            _id: {
              $in: assetsToDelete.map(a => {
                return a._id;
              }),
            },
          });
 */ result.status = 200;
        } else {
          result.status = 404;
          result.errorVal = "Asset not found";
        }
      } else {
        result.status = 404;
        result.errorVal = "Missing id parameter";
      }
    } catch (err) {
      console.log("asset.service.deleteAsset.catch err:", err.toString());
      result.status = 500;
      result.errorVal = "Internal Server Error: " + err.toString(); // todo log the error string and send back only 'Internal Server Error'
    }

    return result;
  }
  async multiLineAssets(lines) {
    let resultObj = {},
      assets,
      AssetsModel;

    try {
      AssetsModel = ServiceLocator.resolve("AssetsModel");
      let criteria = { lineId: { $in: lines } };
      assets = await AssetsModel.find(criteria);
      resultObj = { value: assets, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("assets.service.multiLineAssets.catch", err.toString());
    }

    return resultObj;
  }
  async getTimezone(assetId) {
    let assetsModel = ServiceLocator.resolve("AssetsModel");
    let asset = await assetsModel.findOne({ _id: assetId, isRemoved: false }, { attributes: true });
    if (asset && asset.attributes && asset.attributes.timezone) {
      return asset.attributes.timezone;
    }

    return null;
  }
  // The intention of the following function was to manually clean a geojson already in database, nevertheless this can in future be operated through frontend after modifications.
  async cleanCoords(assetId) {
    let assetsModel = ServiceLocator.resolve("AssetsModel");
    let asset = await assetsModel.findOne({ _id: assetId, isRemoved: false }, { unitId: true, attributes: true });
    if (asset && asset.attributes && asset.attributes.geoJsonCord) {
      let geojson = JSON.parse(asset.attributes.geoJsonCord);
      let lineString = turf.lineString(geojson.features[0].geometry.coordinates, { name: "l1" });
      let length = turf.length(lineString, { units: "kilometers" });

      console.log(`Asset :${asset.unitId}`);
      console.log(`Size  :${asset.attributes.geoJsonCord.length}`);
      console.log(`Length:${length} kilometers`);
      let str = JSON.stringify(lineString);
      console.log("Size:", str.length);
      //      console.log('Compare:', asset.attributes.geoJsonCord, str);
      console.log("cleaning...");

      let ls1 = turf.cleanCoords(lineString);
      let str1 = JSON.stringify(ls1);
      console.log("Size:", str1.length);
      // let fs=require('fs');
      // fs.writeFileSync('output.json', str1);

      //console.log('Compare:', asset.attributes.geoJsonCord, str);
    } else {
      console.log("this was retured " + asset);
    }
  }
  async manageLevels(asset, parentAsset) {
    if (templateSettings.templateName == "railRoad") {
      let AssetTypesModel = ServiceLocator.resolve("AssetTypesModel");
      let parentAType = await AssetTypesModel.findOne({ assetType: parentAsset.assetType }).exec();
      let assetType = await AssetTypesModel.findOne({ assetType: asset.assetType }).exec();
      if (parentAType && parentAType.location) {
        !asset.levels && (asset.levels = { 1: null, 2: null, 3: null, currentLevel: null });
        // the else statement tells that we are dealing with the first level location asset.

        let firstLevelAsset = !parentAType.parentAssetType;
        let level2Exist = parentAsset.levels["2"];
        let level3Exist = parentAsset.levels["3"];

        if (firstLevelAsset) {
          asset.levels.currentLevel = "1";
          asset.levels["1"] = asset._id;
        } else {
          asset.levels["1"] = parentAsset.levels["1"];
          asset.levels.currentLevel = "1";
          if (level2Exist) {
            asset.levels["2"] = parentAsset.levels["2"];
            asset.levels.currentLevel = "2";
          }
          if (level2Exist && level3Exist) {
            asset.levels["3"] = parentAsset.levels["3"];
            asset.levels.currentLevel = "3";
          }
          if (level2Exist && !level3Exist && assetType.location) {
            asset.levels["3"] = asset._id;
            asset.levels.currentLevel = "3";
          }
          if (!level2Exist && assetType.location) {
            asset.levels["2"] = asset._id;
            asset.levels.currentLevel = "2";
          }
        }
      } else {
        asset.levels = parentAsset.levels;
      }
    }
    //  console.log(asset);
    asset.markModified("levels");
    return asset;
  }
  async getUnAssignedAssets() {
    let AssetTypesModel = ServiceLocator.resolve("AssetTypesModel");
    let AssetsModel = ServiceLocator.resolve("AssetsModel");
    let resultObj = null;
    try {
      let assetTypes = await AssetTypesModel.find().exec();
      let assets = await AssetsModel.find().exec();
      let unAssignedAssets = [];
      for (let asset of assets) {
        let aType = _.find(assetTypes, { assetType: asset.assetType });
        if (aType && !aType.location) {
          let parentAsset = _.find(assets, { id: asset.parentAsset });
          let parentAType = _.find(assetTypes, { assetType: parentAsset ? parentAsset.assetType : "" });
          if (parentAType && parentAType.location && !parentAType.plannable) {
            unAssignedAssets.push(asset);
          }
        }
      }
      resultObj = { status: 200, value: unAssignedAssets };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("assets.service.getUnAssignedAssets.catch", err.toString());
    }
    return resultObj;
  }
  async getLocationTimeZone(locationId) {
    let AssetsModel = ServiceLocator.resolve("AssetsModel");
    try {
      let loc = await AssetsModel.findOne({ id: locationId }).exec();
      if (loc && loc.attributes && loc.attributes.timezone) {
        return loc.attributes.timezone;
      } else {
        return "EST"; // # default timezone
      }
    } catch (err) {
      console.log("err in getLocationTimeZone : ", err);
    }
  }
  updateAssetTestForms(form, prevForm) {}

  /*async copyMarkerFields(asset)
  {
    if(asset.attributes)
    {
      let attributeFields = [{fieldName:"Marker Start", assetField:"markerStart", assetFieldId:"markerStartId"}, 
        {fieldName:"Marker End", assetField:"markerEnd", assetFieldId:"markerEndId"}];
      attributeFields.forEach(async af=>{
        if(asset.attributes[af.fieldName])
        {
          asset[af.assetField] = asset.attributes[af.fieldName];
          asset[af.assetFieldId] = await this.findAssetIdByName(asset.attributes[af.fieldName]);
          console.log('asset marker id', asset[af.assetFieldId]);
        }
      });
    }

  }
  async findAssetIdByName(assetName)
  {
    let retVal="";
    try
    {
        let AssetsModel = ServiceLocator.resolve("AssetsModel");
        let asset = await AssetsModel.findOne({unitId: assetName});
        retVal = asset ? asset._id.toString():"";
    }
    catch(err)
    {
      console.log('assets.service.findAssetIdByName.catch:', err);
    }
    return retVal;
  }*/
}

export default AssetsService;

async function convertTreeToFlatArrayKeys(tree, criteria) {
  let arrayOfKeys = [];
  await recursivelyConvertTree(tree, arrayOfKeys, criteria);
  return arrayOfKeys;
}

async function recursivelyConvertTree(treeObj, arrayOfKeys, criteria) {
  let keys = Object.keys(treeObj);
  for (let key of keys) {
    if (key != "properties") {
      let isCriteriaMeet = true;
      if (criteria) {
        Object.keys(criteria).forEach((criteriaKey) => {
          isCriteriaMeet = treeObj[key].properties[criteriaKey] === criteria[criteriaKey] && isCriteriaMeet;
        });
      }

      if (isCriteriaMeet) {
        arrayOfKeys.push(ObjectId(key));
      }

      await recursivelyConvertTree(treeObj[key], arrayOfKeys, criteria);
    }
  }
}
