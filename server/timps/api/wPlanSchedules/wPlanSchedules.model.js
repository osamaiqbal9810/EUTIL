"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../../framework/servicelocator");

let wPlanSchedules = new Schema({
  user: { _id: String, name: String, email: String },
  startDate: Date,
  lineId: String,
  title: String,
  inspectionSchedules: Array,
  templateId: String,
  toRecalculate: { type: Boolean, default: false },
  dateRange: Object,
  inspection_type:String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

wPlanSchedules.pre("save", function (next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});

wPlanSchedules.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

module.exports = mongoose.model("WPlanSchedules", wPlanSchedules);
let wpSchedulesModel = mongoose.model("WPlanSchedules", wPlanSchedules);
ServiceLocator.register("WPlanSchedulesModel", wpSchedulesModel);

module.exports = wpSchedulesModel;
