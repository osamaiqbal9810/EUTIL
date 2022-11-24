/**
 * Created by zqureshi on 8/30/2018.
 */

let Attendance = require("./attendance.model");
let moment = require('moment');

exports.index = function (req, res) {};
exports.create = function (req, res) {
    //let userId = '5b8950f78aae6dadfc2721c5';
    //req.body.userId = userId;
    //console.log(req.body);
    req.body.checkInIP = req.headers.origin;

    let attendance = new Attendance (req.body);
    attendance.save(function (err, savedData) {
        if (err) {
            return handleError(res, err);
        }
        //console.log("Successfully checkIn");
        res.status(201);
        return res.json(savedData);
    })
    // Attendance.create({
    //     userId: userId,
    //     checkInTime: req.body.checkInTime,
    //     checkInStatus: req.attendance.checkInStatus
    // }, function (err, savedData) {
    //     if (err) {
    //         return handleError(res, err);
    //     }
    //     //console.log("Successfully checkIn");
    //     res.status(201);
    //     return res.json(savedData);
    // })
};
exports.customQuery = function (req, res) {
    //userId = '5b8950f78aae6dadfc2721c5';
    let lastDate = new Date();
    lastDate = lastDate.setDate(lastDate.getDate() - parseInt(req.query.days));
    Attendance.find({userId: req.params.id, checkInTime: {$gte:lastDate , $lte: new Date()}}).sort([['createdAt', -1]]).exec(function (err, record){
        if (err) {
            console.log(err);
            return handleError(res, err);
        }
        //console.log("Successfully fetched");
        res.status(201);
        return res.json(record);

    })

};
exports.read = function (req, res) {
    //console.log("in read method");
    //userId = '5b8950f78aae6dadfc2721c5';
    Attendance.find({userId: req.params.id}).sort([['createdAt', -1]]).exec(function (err, record){
        if (err) {
            //console.log(err);
            return handleError(res, err);
        }
        //console.log("Successfully fetched");
        res.status(201);
        return res.json(record[0]);

    })

};
exports.update = function (req, res) {
    /*if(req.body.checkOutStatus==="Web"){

    } else if(req.body.checkOutStatus==="Auto"){

    }*/
    req.body.checkOutIP = req.headers.origin;
    Attendance.findById(req.params.id, function(err, attendance){
        if (err) {
            //console.log(err);
            return handleError(res, err);
        }
        attendance.checkOutStatus = req.body.checkOutStatus;
        attendance.checkOutTime = req.body.checkOutTime;
        attendance.save(function (err, savedRecord) {
            if (err) {
                //console.log(err);
                return handleError(res, err);
            }
            //console.log("Successfully Updated");
            res.status(201);
            return res.json(savedRecord);
        })
    });
};
exports.delete = function (req, res) {};

function handleError(res, err) {
    return res.status(500).send(err);
}