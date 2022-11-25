"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");
let Assets = new Schema(
  {
    subdivision: String,
    start: {
      type: Number,
      set: function (n) {
        return n.toFixed(2);
      },
    },
    end: {
      type: Number,
      set: function (n) {
        return n.toFixed(2);
      },
    },
    name: String,
    assetLength: {
      type: Number,
      set: function (n) {
        return n.toFixed(2);
      },
    },
    coordinates: Array,
    unitId: String,
    description: String,
    assetType: String,
    railRoad: String,
    inspectable: { type: Boolean, default: false },
    frequency: Number,
    attributes: { type: Object, default: {} },
    systemAttributes: Object,
    parentAsset: { type: String, default: null },
    images: Array,
    documents: Array,
    childAsset: Array,
    lineId: String,
    trackId: String,
    timeZone: String,
    equipments: Array,
    start_lat: Number,
    end_lat: Number,
    start_long: Number,
    end_long: Number,
    inspectionDates: Object,
    location_type: String,
    assetsLocArray: Array,
    nextInspDateFieldName: String,
    lastInspDateFieldName: String,
    locationTypeStatus: String,
    inspectionCheckboxes: Object,
    inspectionsStatus: Object,
    assetIsInInspection: { type: Object, default: {flag:false} },
    inspectionInfo: { type: Object, default: {} },
    levels: { type: Object, default: { 1: null, 2: null, 3: null, currentLevel: null } },
    isRemoved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { minimize: false },
);

/**
 * Virtuals
 */
Assets.pre("save", function (next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
Assets.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let AssetsModel = mongoose.model("assets", Assets);
ServiceLocator.register("AssetsModel", AssetsModel);
module.exports = AssetsModel;
