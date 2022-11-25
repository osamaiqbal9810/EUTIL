import AssetsModel from "../assets/assets.modal";
import AssetsTypeModel from "../assetTypes/assetTypes.model";
import _, { head } from "lodash";
import { DataExporterCSV } from "../../service/DataExporterToCSV";
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
  async locationAssetsToCSV(locId) {
    let result = {};
    try {
      let assets = await AssetsModel.find({ parentAsset: locId, isRemoved: false }).exec();
      let dataToWrite = assetDataToCSV(assets);
      let errorVal = await DataExporterCSV(dataToWrite, "./uploads/assetsExports/", "assetExport.csv");
      if (errorVal) {
        result.erroVal = errorVal.message;
        result.status = 500;
      } else {
        result.value = {};
        result.status = 200;
      }
    } catch (err) {
      console.log('location.service.locationAssetsToCSV.catch:', err);
      result.erroVal = err;
      result.status = 500;
    }
    return result;
  }
}

export default LocationService;

// export function assetDataToCSV(assets) {
//    const assetHeaders = "Asset Type,Name,Description,Start Mp,End Mp,Lat,Long";
//   let data = assetHeaders + ", \n";
//   for (let asset of assets) {
//     data = data + `${filterEscapeCharFields(asset.assetType)},`;
//     data = data + `${filterEscapeCharFields(asset.unitId)},`;
//     data = data + `${filterEscapeCharFields(asset.description)},`;
//     data = data + `${filterEscapeCharFields(asset.start)},`;
//     data = data + `${filterEscapeCharFields(asset.end)},`;
//     data = data + `${filterEscapeCharFields(asset.coordinates && asset.coordinates.length > 0 ? asset.coordinates[0] : "")},`;
//     data = data + `${filterEscapeCharFields(asset.coordinates && asset.coordinates.length > 0 ? asset.coordinates[1] : "")},`;
//     data = data + `\n`;
//   }
//   return data;
// }
export function assetDataToCSV( assets ) {
  // Make plain headers
  let headerFields=[], csvData='';
  headerFields = makeHeaders(assets);
  // console.log('final headers', headerFields);
  for(let asset of assets) {
    csvData += makeCSVRow(asset._doc, headerFields) + '\n';
  }
  csvData = headerFields.join(',') + '\n' + csvData;

  return csvData;
}
function makeCSVRow(value, headers) {
  let csvRow = '';

  for(let i=0; i<headers.length; i++) {
    let fieldName = headers[i], fieldLevels=fieldName.split('.'), fieldValue='';

    if( fieldLevels.length > 1 ) // Todo: implement and test multilevel array and objects
      fieldValue = value[fieldLevels[0]][fieldLevels[1]];
    else 
      fieldValue = value[fieldName];
      
      if(fieldValue==null || fieldValue==undefined)
       fieldValue='';

      if(typeof fieldValue==='string') 
      { 
        fieldValue  = fieldValue.replace(/"/g, "'");
        fieldValue = '"' + fieldValue + '"';
      }

      csvRow += `${filterEscapeCharFields(fieldValue)}${i===headers.length-1 ? '':','}`;
  }

  return csvRow;
}
function makeHeaders(assets) {
  const exceptions = ['_id', 'childAsset', 'parentAsset', 'levels', 'isRemoved', 'lineId', 'trackId', 'assetLength', 'createdAt', 'updatedAt', '__v']; // do not export these fields
  let headerFields=[];
  for(let asset of assets) {
    let fields = Object.keys(asset._doc);
    for(let field of fields) {
      if(!exceptions.includes(field)) {
        addHeaderR(field, asset._doc[field], headerFields);
      }
    }
 }
 return headerFields;
}
function addHeaderR(fieldName, fieldValue, headerFields) {
  if(fieldValue && typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
    let attributes = Object.keys(fieldValue);
    for(let attribute of attributes) {
      addHeaderR(fieldName+'.'+attribute, fieldValue[attribute], headerFields);
    }
  }
  else if(Array.isArray(fieldValue)) {
    
    if(fieldValue.length > 0) {
      // if(headerFields.includes(fieldName))
      // { 
      //   let removeIndex = headerFields.findIndex((v)=>{return v===fieldName});
      //   headerFields.splice(removeIndex, 1);
      // }
      for(let index=0; index < fieldValue.length; index++) {
        addHeaderR(fieldName+'.'+index, fieldValue[index], headerFields);
      }
    }
    else 
     addHeaderR(fieldName+'.0','', headerFields);
  }
  else if(!headerFields.includes(fieldName)) {
    headerFields.push(fieldName);
  }
}
function filterEscapeCharFields(value) {
  if (value && typeof value === "string") {
    value = value.replace(/\n/g, "");
  }
  return value;
}
