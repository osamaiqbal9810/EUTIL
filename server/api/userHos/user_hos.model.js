"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const saltRounds = 10;
let crypto = require("crypto");
let bcrypt = require("bcryptjs");
let ServiceLocator = require("../../framework/servicelocator");

let UserHosSchema = new Schema({
  tenantId: String,
  userId: String,
  email: String,
  date: Date,
  data: Array,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Virtuals
 */

/**
 * Validations
 */

// Validate empty email

/**
 * Pre-save hook
 */

UserHosSchema.pre("save", function (next) {
  let now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
UserHosSchema.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});
/**
 * Methods
 */
let userHosModel = mongoose.model("UserHos", UserHosSchema);

module.exports = userHosModel;
