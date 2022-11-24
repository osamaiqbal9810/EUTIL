"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ServiceLocator = require('../../framework/servicelocator');

let ListSchema = new Schema({
    listName : String,
    settings : String,
    description : String,
    owner : String,
    tenantId: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

ListSchema.pre("save", function(next)  {
    let now = new Date();
    if (this) {
        this.updatedAt = now;
        if (!this.createdAt) {
            this.createdAt = now;
        }
    }
    next();
});
ListSchema.pre("update", function(next) {
    this.update = { $set: { updatedAt: Date.now() } };
    next();
});

module.exports = mongoose.model("List", ListSchema);