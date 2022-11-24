"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");
let Reports = new Schema({
  data: { type: Object, default: null },
  tag: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Virtuals
 */
Reports.pre("save", function(next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
Reports.pre("update", function(next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let ReportsModel = mongoose.model("reports", Reports);
ServiceLocator.register("ReportModel", ReportsModel);
module.exports = ReportsModel;
