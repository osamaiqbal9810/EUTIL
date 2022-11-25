"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../../framework/servicelocator");

let testSchedules = new Schema({
  user: { _id: String, name: String, email: String },
  date: Date,
  lineId: String,
  assetId: String,
  assetType: String,
  assetMP: String,
  assetStart: String,
  assetEnd: String,
  lineName: String,
  assetName: String,
  testCode: String,
  testDescription: String,
  title: String,
  formData: { type: Object, default: null },
  inspectionId: String,
  dueDate: Date,
  status: String,
  expiryDate: Date,
  completed: Boolean,
  childForms: { type: Array, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

testSchedules.pre("save", function (next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});

testSchedules.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

module.exports = mongoose.model("TestSchedules", testSchedules);
let testSchedulesModel = mongoose.model("TestSchedules", testSchedules);
ServiceLocator.register("TestSchedulesModel", testSchedulesModel);

module.exports = testSchedulesModel;
