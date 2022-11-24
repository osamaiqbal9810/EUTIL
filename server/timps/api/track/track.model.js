"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../../framework/servicelocator");
let Track = new Schema({
  subdivision: String,
  start: String,
  end: String,
  assetGroupLength: String,
  trackType: String,
  trafficType: String,
  weight: String,
  class: String,
  units: Array,
  trackId: String,
  coordinates: Array,
  mp_prefix: String,
  templateCreated : {type : String },
  isRemoved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Virtuals
 */
Track.pre("save", function(next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
Track.pre("update", function(next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let TrackModel = mongoose.model("track", Track);
ServiceLocator.register("TrackModel", TrackModel);
module.exports = TrackModel;
