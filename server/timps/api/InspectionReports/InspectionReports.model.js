"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../../framework/servicelocator");

let AssetsReports = new Schema({
  supervisor: String,
  user: { id: String, name: String, email: String, signature: Object, profile_img: Object, },
  date: Date,
  title: String,
  subdivision: String,
  roadMaster: { id: String, name: String, email: String },
  lineId: String,
  lineName: String,
  inspectionCompleted: Boolean,
  safetyBriefing: Object,
  workplanTemplateId: String,
  tasks: Array,
  startDateTime: String,
  startLocation: String,
  endDateTime: String,
  endLocation: String,
  status: String,
  serverObject: Object,
  safetyBriefing: Object,
  jobBriefings:Array,
  intervals: Array,
  privateKey: String,
  inspection_type:String,                   
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AssetsReports.pre("save", function (next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});

AssetsReports.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

module.exports = mongoose.model("AssetsReports", AssetsReports);
let jpModel = mongoose.model("AssetsReports", AssetsReports);
ServiceLocator.register("AssetsReportsModel", jpModel);

module.exports = jpModel;
