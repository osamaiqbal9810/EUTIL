/**
 * Created by zqureshi on 10/12/2018.
 */
let _ = require("lodash");
let ServiceLocator = require("../../framework/servicelocator");
let SODModel = require("./SOD.model");

exports.show = function(req, res, next) {
  let query = req.query.query;
  if (query == "latestSodEachUser") {
    SODModel.aggregate(
      [
        {
          $group: {
            _id: "$employee",
            day: { $max: "$day" },
            start: { $last: "$start" },
            end: { $last: "$end" },
            location: { $last: "$location" },
            endLocation: { $last: "$endLocation" },
          },
        },
        {
          $project: {
            employee: "$_id",
            day: "$day",
            start: "$start",
            end: "$end",
            location: "$location",
            endLocation: "$endLocation",
          },
        },
        {
          $sort: {
            day: -1,
          },
        },
      ],
      function(err, sods) {
        if (err) {
          return handleError(res, err);
        }
        res.status(200);
        res.json(sods);
      },
    );
  }
  if (!query) {
    SODModel.find().exec((err, sods) => {
      if (err) {
        return handleError(res, err);
      }
      res.status(200);
      res.json(sods);
    });
  }
};

exports.destroy = function(req, res, next) {
  if (!req.params.hasOwnProperty("id")) {
    res.status(200);
    return res.json("id param is required");
  }

  let id = req.params.id;

  SODModel.findByIdAndDelete(id, err => {
    if (err) {
      res.status(200);
      return res.json(err);
    }

    res.status(200);
    return res.json("success");
  });
};

function handleError(res, err) {
  res.status(500);
  return res.send(err);
}
