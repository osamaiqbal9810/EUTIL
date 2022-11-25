/**
 * Created by ajaz.qureshi on 25/11/2021.
 */
"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");

let ErrorReportingSchema = new Schema({
  userId: { type: String, required: true },
  datetime: { type: Date, default: Date.now },
  errorObject: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Virtuals
 */
ErrorReportingSchema.pre("save", function (next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
ErrorReportingSchema.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let errorReportingModel = mongoose.model("ErrorReporting", ErrorReportingSchema);
ServiceLocator.register("ErrorReporting", errorReportingModel);
module.exports = errorReportingModel;
