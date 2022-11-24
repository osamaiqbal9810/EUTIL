"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let UserGroup = require("./../userGroup/userGroup.model");
const saltRounds = 10;
let crypto = require("crypto");
let bcrypt = require("bcryptjs");
let ServiceLocator = require("../../framework/servicelocator");

let UserSchema = new Schema({
  tenantId: String,
  name: String,
  department: Array,
  subdivision: { type: String, default: "All" },
  genericEmail: String,
  email: { type: String, lowercase: true, required: true },
  hashedPassword: String,
  phone: String,
  mobile: String,
  address: String,
  active: { type: Boolean, default: true },
  isRemoved: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  assignedLocation: String,
  assignedLocationName: String,
  group_id: String,
  level: Number,
  userGroup: { type: mongoose.Schema.Types.ObjectId, ref: "UserGroup" },
  userGroups: Array,
  userHours: Object,
  resetPasswordToken: String,
  resetPasswordExpires: String,
  signature: Object,
  profile_img: Object,
  teamLead: { type: String, default: "" },
  team: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Virtuals
 */
UserSchema.virtual("UserGroup")
  .set(function (userGroup) {
    this.group_id = userGroup.group_id;
    this.userGroup = userGroup._id;
  })
  .get(function () {
    return this.group_id;
  });

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Public profile information
UserSchema.virtual("profile").get(function () {
  return {
    name: this.name,
  };
});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual("token").get(function () {
  return {
    _id: this._id,
  };
});

/**
 * Validations
 */

// Validate empty email
UserSchema.path("email").validate(function (email) {
  return email.length;
}, "Email cannot be blank");

// Validate empty password
UserSchema.path("hashedPassword").validate(function (hashedPassword) {
  return hashedPassword.length;
}, "Password cannot be blank");

// Validate email is not taken
UserSchema.path("email").validate(function (value) {
  let self = this;
  this.constructor.findOne({ tenantId: this.tenantId, email: value }, function (err, user) {
    if (err) throw err;
    if (user) {
      if (self.id === user.id) return true;
      return false;
    }
    return true;
  });
}, "The specified email address is already in use.");

let validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema.pre("save", function (next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.hashedPassword)) next(new Error("Invalid password"));
  else next();
});
UserSchema.pre("save", function (next) {
  let now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
UserSchema.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});
/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @return {Boolean}
   * @api public
   */
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hashedPassword);
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString("base64");
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password) return "";
    let hashPassword = "";
    return bcrypt.hashSync(password, saltRounds);
  },
};

let userModel = mongoose.model("User", UserSchema);
ServiceLocator.register("userModel", userModel);
module.exports = userModel;
