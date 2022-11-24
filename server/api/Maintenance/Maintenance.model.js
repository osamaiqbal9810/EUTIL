"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../framework/servicelocator");

let MaintenanceSchema = new Schema({
  tenantId: String,
  lineId: String,
  lineName: String, // to shortlist maintenances only for a specific line
  description: String, // set from issue or text entered by user
  images: Array,
  documents: Array,
  voices: Array,
  coordinates: String, // Geographical coordinates
  location: [{ start: { type: Object, default: {} }, end: { type: Object, default: {} }, type: { type: String, default: "none" } }], // string contains type of location e.g. MP, Chaining, Bent/col, while start/end is the range of maintenance
  markedOnSite: Boolean,
  priority: String,
  asset: Object,
  sourceType: String, // createdby: TIMPS_App Or Web
  createdBy: { id: String, name: String, email: String }, // createdby: user
  assignedTo: { id: String, name: String, email: String }, // assigned to user
  dueDate: Date, // planned date
  inspectionRun: String, // reference to WorkplanTemplate that was used to create JP for issue
  inspection: String, // reference to JourneyPlan where the corresponding issue resides
  attributes: Object, // store additional attributes
  timestamp: String, // time, issue was recorded
  status: String, // status: New/Scheduled/Completed etc.
  mwoNumber: String, //maintained just for old data(must be removed once update script has run)
  mrNumber: String, // this is being used as MR (Maintenance Request number)
  workOrderNumber: String, // this is MWO (Maintenance Work Order number)
  workOrderId: String,
  executionDate: Date,
  closedDate: Date,
  maintenanceType: String,
  subdivision: String,
  estimate: Array,
  estimateHistoryRecord: Array,
  maintenanceRole: String,
  defectCodes: Object,
  trackType: String,
  trackNumber: String,
  class: String,
  executions: Array,
  issueId: String, // if maintenance created from issue.
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

MaintenanceSchema.pre("save", function(next) {
  let now = new Date();
  if (this) {
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});
MaintenanceSchema.pre("update", function(next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

let mmodel = mongoose.model("Maintenance", MaintenanceSchema);
ServiceLocator.register("MaintenanceModel", mmodel);
module.exports = mmodel;
