/**
 * Created by zqureshi on 8/30/2018.
 */
'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AttendanceSchema = new Schema({
    userId: { type: String, required: true },
    checkInTime: {type: String},
    checkInStatus: {type: String},
    checkInLocation: [{type:String}],
    checkInIP: {type: String},
    checkOutTime: {type: String},
    checkOutStatus: {type: String},
    checkOutLocation: [{type:String}],
    checkOutIP: {type: String},
    checkOutReason: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

/**
 * Virtuals
 */
AttendanceSchema.pre('save', (next)=> {
    let now = new Date();
    if(this){
        this.updatedAt = now;
        if (!this.createdAt) {
            this.createdAt = now;
        }
    }
    next();
});
AttendanceSchema.pre('update', function (next) {
    this.update = {'$set': {updatedAt: Date.now()}};
    next();
});

module.exports = mongoose.model('Attendance',  AttendanceSchema);
