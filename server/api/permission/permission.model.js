'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ServiceLocator = require('../../framework/servicelocator');

let GroupPermissionSchema = new Schema({
    name: {type: String, required:true, unique: true},
    resource: {type : String , default: 'NA'},
    action: {type: String , lowercase: true , required: true, default:'read'},// c . u . r . d
    active : {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

/**
 * Virtuals
 */

GroupPermissionSchema.pre('save', function(next) {
    let now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

GroupPermissionSchema.pre('update', function (next) {
    this.update = {'$set': {updatedAt: Date.now()}}
    next();
});

let model = mongoose.model('GroupPermission', GroupPermissionSchema);
ServiceLocator.register('PermissionModel', model);
module.exports = model;
