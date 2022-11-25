/**
 * Created by iahmed on 7/3/2022.
 */
 let _ = require("lodash");
 let ServiceLocator = require('../../framework/servicelocator');
 let LostnfoundModel = require("./lostnfound.model");
 
exports.getAll = function (req, res, next) {
    res.status(404);
 }
exports.deleteOne = function (req, res, next) {
    res.status(404);
}
exports.updateOne = function (req, res, next) {
    res.status(404);
}

 function handleError(res, err) {
     res.status(500);
     return res.send(err);
 }