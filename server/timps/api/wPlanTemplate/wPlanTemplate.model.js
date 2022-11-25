"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require("../../../framework/servicelocator");

let wPlanTemplate = new Schema({
  supervisor: String,
  user: { _id: String, name: String, email: String },
  date: Date,
  runId: String,
  runRanges: Array,
  dayFreq: String,
  lineId: String,
  lineName: String,
  title: String,
  subdivision: String,
  lastInspection: Date,
  nextInspectionDate: Date,
  inspectionFrequency: Number,
  inspectionFrequencies: Array,
  minMaxAllowable: Object,
  timeFrame: String,
  perTime: String,
  minDays: { type: Number, default: 0 },
  FRAOption: String,
  startDate: Date,
  foulTime: Boolean,
  workZone: Boolean,
  watchmen: Object,
  tasks: Array,
  modifications: Object,
  status: String,
  active: { type: Boolean, default: true },
  assetGroupId: String,
  inspectionRun: String,
  inspectionType: String,
  maxAllowable: Number,
  inspectionAssets: Array,
  nextDueDate: Date,
  alertHours: Number,
  nextExpiryDate: Date,
  currentPeriodEnd: Date,
  currentPeriodStart: Date,
  currentDueDate: Date,
  currentExpiryDate: Date,
  locationTimezone: String,
  completion: Object,
  inspection_type:String,
  inspection_freq:String,
  inspection_date:Date,
  inspectionFormInfo:Object,
  nextInspDateFieldName:String,
  lastInspDateFieldName:String,
  isRemoved: { type: Boolean, default: false },
  type: { type: Number, default: 0 },
  sort_id: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

wPlanTemplate.pre("save", function (next) {
  let now = new Date();
  
  if (this) {
    if(this.isRemoved == false){
    let workPlanTemplate = this;
    if(workPlanTemplate){
      console.log(workPlanTemplate.tasks);
      
      workPlanTemplate.tasks.forEach((task)=>{
        if(task)
        {
          task.units.forEach((unit)=>{
            unit.wPlanId = workPlanTemplate._id;
          })
        }
      })
      console.log(workPlanTemplate);
    }
    }
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
  }
  next();
});

wPlanTemplate.pre("update", function (next) {
  this.update = { $set: { updatedAt: Date.now() } };
  next();
});

module.exports = mongoose.model("WorkPlanTemplate", wPlanTemplate);
let wpModel = mongoose.model("WorkPlanTemplate", wPlanTemplate);
ServiceLocator.register("WorkPlanTemplateModel", wpModel);

module.exports = wpModel;
