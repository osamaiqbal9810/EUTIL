"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");
let Run = new Schema({
  runId: String,
  runName: String,
  runRange: Array,
  runLineName: String,
  runLineID: String,
  lineStart: String,
  lineEnd: String,
  isRemoved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Virtuals
 */
Run.pre("save", function(next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
Run.pre("update", function(next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let RunModel = mongoose.model("run", Run);
ServiceLocator.register("RunModel", RunModel);
module.exports = RunModel;
