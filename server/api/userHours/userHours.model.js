/**
 * Created by zqureshi on 10/9/2018.
 */
"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");

let UserHoursSchema = new Schema({
  userId: { type: String, required: true },
  userLocLogging: Boolean,
  userHours: [
    {
      checkboxLabel: { type: String, default: "Monday" },
      startTime: { type: String },
      endTime: { type: String },
      toggleBreak: { type: Boolean, default: false },
      breakTag: { type: String },
      breakStartTime: { type: String },
      breakEndTime: { type: String },
    },
    {
      checkboxLabel: { type: String, default: "Tuesday" },
      startTime: { type: String },
      endTime: { type: String },
      toggleBreak: { type: Boolean, default: false },
      breakTag: { type: String },
      breakStartTime: { type: String },
      breakEndTime: { type: String },
    },
    {
      checkboxLabel: { type: String, default: "Wednesday" },
      startTime: { type: String },
      endTime: { type: String },
      toggleBreak: { type: Boolean, default: false },
      breakTag: { type: String },
      breakStartTime: { type: String },
      breakEndTime: { type: String },
    },
    {
      checkboxLabel: { type: String, default: "Thursday" },
      startTime: { type: String },
      endTime: { type: String },
      toggleBreak: { type: Boolean, default: false },
      breakTag: { type: String },
      breakStartTime: { type: String },
      breakEndTime: { type: String },
    },
    {
      checkboxLabel: { type: String, default: "Friday" },
      startTime: { type: String },
      endTime: { type: String },
      toggleBreak: { type: Boolean, default: false },
      breakTag: { type: String },
      breakStartTime: { type: String },
      breakEndTime: { type: String },
    },
    {
      checkboxLabel: { type: String, default: "Saturday" },
      startTime: { type: String },
      endTime: { type: String },
      toggleBreak: { type: Boolean, default: false },
      breakTag: { type: String },
      breakStartTime: { type: String },
      breakEndTime: { type: String },
    },
    {
      checkboxLabel: { type: String, default: "Sunday" },
      startTime: { type: String },
      endTime: { type: String },
      toggleBreak: { type: Boolean, default: false },
      breakTag: { type: String },
      breakStartTime: { type: String },
      breakEndTime: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Virtuals
 */
UserHoursSchema.pre("save", function(next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
UserHoursSchema.pre("update", function(next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let userHoursModel = mongoose.model("UserHours", UserHoursSchema);
ServiceLocator.register("UserHours", userHoursModel);
module.exports = userHoursModel;
