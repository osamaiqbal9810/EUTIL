"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../../framework/servicelocator");

let JourneyPlan = new Schema({
  supervisor: String,
  user: { id: String, name: String, email: String },
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
  intervals: Array,
  privateKey: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

JourneyPlan.pre("save", function (next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});

JourneyPlan.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

module.exports = mongoose.model("JourneyPlan", JourneyPlan);
let jpModel = mongoose.model("JourneyPlan", JourneyPlan);
ServiceLocator.register("JourneyPlanModel", jpModel);

module.exports = jpModel;
