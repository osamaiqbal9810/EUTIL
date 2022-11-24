"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");

let GpsLogSchema = new Schema({
  tenantId: String,
  id: { type: String, required: true }, //
  description: String, // set from issue or text entered by user
  employee: String,
  hourId: { type: Number },
  tzOffset: { type: Number },
  data: Array,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

GpsLogSchema.pre("save", function(next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
GpsLogSchema.pre("update", function(next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});
let model = mongoose.model("GpsLog", GpsLogSchema);
ServiceLocator.register("GpsLogModel", model);

module.exports = model;
