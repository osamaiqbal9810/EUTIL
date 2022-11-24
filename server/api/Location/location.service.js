import AssetsModel from "../assets/assets.modal";
import AssetsTypeModel from "../assetTypes/assetTypes.model";
import _ from "lodash";
let ServiceLocator = require("../../framework/servicelocator");

class LocationService {
  async getLocations(template) {
    let resultObj;
    try {
      if (template == "railRoad") {
        let locationsTypes = await AssetsTypeModel.find({ location: true }).exec();
        let assetsLocations = [];
        for (let loc of locationsTypes) {
          let als = await AssetsModel.find({ assetType: loc.assetType, isRemoved: !true }).exec();
          assetsLocations = [...assetsLocations, ...als];
        }
        resultObj = { value: { assetTypes: locationsTypes, assets: assetsLocations }, status: 200 };
      } else {
        resultObj = { errorVal: "Template Logic not found", status: 404 };
      }
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
    }
    return resultObj;
  }

  async updateLocations(id, body) {
    let resultObj;
    try {
      if (body.checkBoxChange) {
        let assetsTreeService = ServiceLocator.resolve("AssetsTreeService");
        let majorGeoAType = await AssetsTypeModel.findOne({ _id: body.assetTypes.majorGeoType._id }).exec();
        let company = await AssetsTypeModel.findOne({ _id: majorGeoAType.parentAssetType }).exec();
        let minorGeoAType = await AssetsTypeModel.findOne({ _id: body.assetTypes.minorGeoType._id }).exec();
        let locationAType = await AssetsTypeModel.findOne({ _id: body.assetTypes.locationIdentifier._id }).exec();
        let createTreeCheck = await this.changeAssetsLevel(
          { majorGeoAType: majorGeoAType, minorGeoAType: minorGeoAType, locationAType: locationAType },
          {
            majorGeoAType: body.assetTypes.majorGeoType,
            minorGeoAType: body.assetTypes.minorGeoType,
            locationAType: body.assetTypes.locationIdentifier,
          },
        );
        if (majorGeoAType.plannable != body.assetTypes.majorGeoType.plannable) {
          if (body.assetTypes.majorGeoType.plannable) {
            company.menuFilter = true;
          } else {
            company.menuFilter = false;
          }
          await company.save();
        }
        majorGeoAType.plannable = body.assetTypes.majorGeoType.plannable;
        minorGeoAType.plannable = body.assetTypes.minorGeoType.plannable;
        locationAType.plannable = body.assetTypes.locationIdentifier.plannable;
        majorGeoAType.menuFilter = body.assetTypes.majorGeoType.menuFilter;
        minorGeoAType.menuFilter = body.assetTypes.minorGeoType.menuFilter;
        locationAType.menuFilter = body.assetTypes.locationIdentifier.menuFilter;

        await company.save();
        await majorGeoAType.save();
        await minorGeoAType.save();
        await locationAType.save();

        createTreeCheck && (await assetsTreeService.createHierarchyTree());
        resultObj = await this.getLocations("railRoad");
      } else {
        let assetType = await AssetsTypeModel.findOne({ _id: body._id }).exec();
        let parentAssetType = await AssetsTypeModel.findOne({ _id: assetType.parentAssetType });
        let index = -1;
        for (let pAllowed of parentAssetType.allowedAssetTypes) {
          index++;
          if (pAllowed == assetType.assetType) parentAssetType.allowedAssetTypes[index] = body.assetType;
        }

        await AssetsModel.updateMany({ assetType: assetType.assetType }, { $set: { assetType: body.assetType } });
        assetType.assetType = body.assetType;
        parentAssetType.markModified("allowedAssetTypes");
        await parentAssetType.save();
        await assetType.save();
        resultObj = await this.getLocations("railRoad");
      }
    } catch (err) {
      console.log("Error in updateLocations: " + err.toString());
    }
    return resultObj;
  }
  async changeAssetsLevel(prevAssetType, newAssetType) {
    let createTreeAgainCheck = true;
    let keys = Object.keys(prevAssetType);
    let levelATypes = {
      majorGeoAType: 1,
      minorGeoAType: 2,
      locationAType: 3,
    };
    for (let key of keys) {
      let newAssetTypePlannable = newAssetType[key].plannable == true;
      let notSameAsPrev = prevAssetType[key].plannable != newAssetType[key].plannable;
      let isNewPlannable = newAssetTypePlannable && notSameAsPrev;
      if (isNewPlannable) {
        // await AssetsModel.updateMany({ parentAsset: !null }, { "levels.currentLevel": levelATypes[key] , parentAsset :  });
        let assets = await AssetsModel.find().exec();

        for (let asset of assets) {
          let checkLocationAsset = false;
          let parentLocationAsset = false;
          if (
            asset.assetType == newAssetType.majorGeoAType.assetType ||
            asset.assetType == newAssetType.minorGeoAType.assetType ||
            asset.assetType == newAssetType.locationAType.assetType
          ) {
            checkLocationAsset = true;
          }
          let parentAsset = await _.find(assets, { id: asset.parentAsset });

          if (
            asset.parentAsset &&
            parentAsset &&
            (parentAsset.assetType == newAssetType.majorGeoAType.assetType ||
              parentAsset.assetType == newAssetType.minorGeoAType.assetType ||
              parentAsset.assetType == newAssetType.locationAType.assetType)
          ) {
            parentLocationAsset = true;
          }
          if (asset.parentAsset && !checkLocationAsset && parentLocationAsset) {
            if (asset.levels[levelATypes[key]]) {
              asset.parentAsset = asset.levels[levelATypes[key].toString()];
              asset.levels.currentLevel = levelATypes[key];
              asset.markModified("levels");
              await asset.save();
              createTreeAgainCheck = true;
            }
          }
        }
      }
    }
    return createTreeAgainCheck;
  }
}

export default LocationService;
