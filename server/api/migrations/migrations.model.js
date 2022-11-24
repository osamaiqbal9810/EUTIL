"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");
let Migration = new Schema({
  timestamp: String,
  name: String,
  type: String,
  result: String,
  status: Boolean,
  createdAt: { type: Date, default: Date.now }
});

/**
 * Virtuals
 */
Migration.pre("save", function(next) {
  let now = new Date();
  if (this) {
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
// Migration.pre("update", function(next) {
//   this.update = { $set: { updatedAt: Date.now() } };
//   next();
// });

let  MigrationModel = mongoose.model("migrations", Migration);
ServiceLocator.register("MigrationModel", MigrationModel);
module.exports = MigrationModel;
