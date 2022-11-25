"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require('../../framework/servicelocator');

let LostnfoundSchema = new Schema({
    collectionName : String,
    source : String,
    reason: String,
    obj : Object,
    data0 : Object,
    data1 : Object,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

LostnfoundSchema.pre("save", function(next)  {
    let now = new Date();
    if (this) {
        this.updatedAt = now;
        if (!this.createdAt) {
            this.createdAt = now;
        }
    }
    next();
});

LostnfoundSchema.pre("update", function(next) {
    this.update = { $set: { updatedAt: Date.now() } };
    next();
});

const lnfModel = mongoose.model("Lostnfound", LostnfoundSchema);
ServiceLocator.register("LostnfoundModel", lnfModel);
module.exports = lnfModel;