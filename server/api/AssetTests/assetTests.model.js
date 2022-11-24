"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator.js");

let assetTest = new Schema({
  title: String,
  lastInspection: Date,
  nextInspectionDate: Date,
  inspectionFrequencies: Object,
  startDate: Date,
  active: { type: Boolean, default: true },
  nextDueDate: Date,
  alertHours: Number,
  nextExpiryDate: Date,
  currentPeriodEnd: Date,
  currentPeriodStart: Date,
  currentDueDate: Date,
  currentExpiryDate: Date,
  completion: Object,
  assetType: String,
  assetId: String,
  testCode: String,
  testId: String,
  lineId: String,
  timezone: String,
  completion: Object,
  dayLightActive: Boolean,
  linearProps: Object,
  start: Number,
  end: Number,
  isRemoved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

assetTest.pre("save", function (next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});

assetTest.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

module.exports = mongoose.model("assetTest", assetTest);
let assetTestModel = mongoose.model("assetTest", assetTest);
ServiceLocator.register("AssetTestModel", assetTestModel);

module.exports = assetTestModel;
