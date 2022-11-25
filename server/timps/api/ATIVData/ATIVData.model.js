"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../../framework/servicelocator");

let ATIVData = new Schema({
  timestamp: Date,
  title: String,
  milepost: String,
  latitude: String,
  longitude: String,
  properties: Object,
  isRemoved: Boolean,
  workplanId: String,
  unitId: String,
  verified: Boolean,
  verificationProps: Object,
  status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ATIVData.pre("save", function (next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});

ATIVData.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let ativModel = mongoose.model("ATIVData", ATIVData);
ServiceLocator.register("ATIVDataModel", ativModel);
module.exports = ativModel;
