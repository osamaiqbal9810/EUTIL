/**
 * Created by zqureshi on 10/12/2018.
 */
'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Comment = new Schema({
    title: {type: String},
    body: {type: String},
    tenantId: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

/**
 * Virtuals
 */
Comment.pre('save', function(next) {
    let now = new Date();
    if (this) {
        this.updatedAt = now;
        if (!this.createdAt) {
            this.createdAt = now;
        }
    }
    next();
});
Comment.pre('update', function (next) {
    this.update = {'$set': {updatedAt: Date.now()}};
    next();
});

module.exports = mongoose.model('Comment', Comment);
