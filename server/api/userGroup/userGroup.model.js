"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let GroupPermission = require("./../permission/permission.model");
let ServiceLocator = require("../../framework/servicelocator");
let UserGroupSchema = new Schema({
  group_id: { type: String, lowercase: true, unique: true, required: true },
  name: String,
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "GroupPermission" }],
  level: Number,
  category: String,
  active: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Virtuals
 */

// Public profile information
UserGroupSchema.virtual("profile").get(function() {
  return {
    id: this.group_id,
    name: this.name,
    permissions: this.permissions,
  };
});

UserGroupSchema.pre("save", function(next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
UserGroupSchema.pre("update", function(next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let model = mongoose.model("UserGroup", UserGroupSchema);
ServiceLocator.register("UserGroupModel", model);
module.exports = model;
