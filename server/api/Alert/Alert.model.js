"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");

let AlertSchema = new Schema({
  cronJobId: {
    type: String,
    unique: true
  },
  destinations: [String],
  event: {
    type: String,
    enum: ['before', 'after', 'exact'],
    default: 'exact'
  },
  eventExactDate: Date,
  timeDifference: String,
  alertTime: String,
  unitOfTime: String,
  reference: {
    modelId: String,
    model: String,
    field: String,
    fieldDisplayText: String,
    issueId: String,
    jPlanId: String,
  },
  type: {
    type: Array,
  },
  title: {type: String},
  message: {type: String},
  status: {
    type: String,
    enum: ['pending', 'generated'],
    default: 'pending'
  },
  disableRecalculate: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  isClone: {
    type: Boolean,
    default: false
  },
  retry: {type: Boolean},
  timezone: String,
  retryCount: {type: Number},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const alert = mongoose.model("Alert", AlertSchema);
ServiceLocator.register("AlertModel", alert);
module.exports = alert;
