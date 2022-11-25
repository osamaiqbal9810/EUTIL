"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");

let assetsType = new Schema({
  assetType: String,
  assetTypeClassify: String,
  displayName: String,
  lampAttributes: { type: Array, default: null },
  timpsAttributes: { type: Object, default: null },
  diagnosticAttributes: { type: Object, default: null },
  inspectionInstructions: { type: Object, default: null },
  inspectionForms: { type: Object, default: null },
  inspectionFormsObj: { type: Object, default: null },
  defectCodes: { type: Object, default: null },
  defectCodesObj: { type: Object, default: null },
  inspectable: { type: Boolean, default: false }, // is asset inspectable or not in workplan
  plannable: { type: Boolean, default: false }, // is location is injectable or not
  location: { type: Boolean, default: false }, // is this a location asset
  configurationAsset: { type: Boolean, default: false }, // is this a configuration asset --a group of equipments
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  menuFilter: { type: Boolean, default: false },
  markerMilepost: { type: Boolean, default: false },
  allowedAssetTypes: { type: Array, default: [] },
  parentAssetType: { type: String, default: null },
  accessPermission: { type: String, default: null },
  sortOrder: { type: Number, default: 0 },
});

assetsType.pre("save", function (next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});

assetsType.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let AssetsTypeModel = mongoose.model("AssetTypes", assetsType);
module.exports = AssetsTypeModel;
ServiceLocator.register("AssetTypesModel", AssetsTypeModel);
