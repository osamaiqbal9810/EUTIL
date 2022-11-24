"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require('../../framework/servicelocator');

let SODSchema = new Schema({
    employee : String,
    location : String,
    endLocation: String,
    day : Date,
    start : Date,
    end : Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

SODSchema.pre("save", function(next) {
    let now = new Date();
    if (this) {
        this.updatedAt = now;
        if (!this.createdAt) {
            this.createdAt = now;
        }
    }
    next();
});
SODSchema.pre("update", function(next) {
    this.update = { $set: { updatedAt: Date.now() } };
    next();
});


let model = mongoose.model("SOD", SODSchema);
ServiceLocator.register('SODModel', model);
module.exports = model;
