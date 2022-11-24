"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");
let AssetsTree = new Schema({
  assetsTreeObj: { type: Object, default: null },
  tag: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Virtuals
 */
AssetsTree.pre("save", function(next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
AssetsTree.pre("update", function(next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let AssetsTreeModel = mongoose.model("assetsTree", AssetsTree);
ServiceLocator.register("AssetsTreeModel", AssetsTreeModel);
module.exports = AssetsTreeModel;
