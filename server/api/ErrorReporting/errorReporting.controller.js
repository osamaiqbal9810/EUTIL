let ErrorReporting = require("./errorReporting.model");
import moment from "moment";
let _ = require("lodash");

exports.show = function (req, res, next) {
  let criteria = {};
  let date1 = req.query["date1"];
  let date2 = req.query["date2"];
  let now = moment().utc();
  if (!date1) {
    date1 = now.startOf("day").toString();
    date2 = now.add(1, "days").toString();
  } else if (!date2) {
    let objDate1 = moment(date1);
    date2 = objDate1.add(1, "days").toString();
  }
  if (date1 && date2) {
    criteria = {
      datetime: { $gte: new Date(date1), $lte: new Date(date2) },
    };
  }
  ErrorReporting.find(criteria, function (err, errorReporting) {
    if (err) return handleError(res, err);
    if (!errorReporting) return res.status(201).send("");
    res.json(errorReporting);
  });
};
exports.update = function (req, res, next) {
  //console.log(req.params.id);
  let errorArray = req.body || [];
  let errorObject = errorArray.length > 0 ? errorArray[0] : {};
  if (errorObject == {}) {
    return handleError(res, new Error("Unable to find error object"));
  }
  let id = req.params.id || req.params["id"];
  if (id && id != "") {
    //Edit
    ErrorReporting.findOne({ _id: id }, function (err, errorReport) {
      if (err) return handleError(res, err);
      errorReport.errorObject = errorObject;
      errorReport.save(function (err, savedData) {
        if (err) return handleError(res, err);
        res.status(200);
        return res.json("success");
      });
    });
  } else {
    // userId: { type: String, required: true },
    // datetime: { type: Date, default: Date.now },
    // errorObject: { type: Object },
    if (errorObject) {
      //let errorObject = JSON.parse(req.body.errorObject);
      let errorReport = new ErrorReporting({
        userId: errorObject.user._id,
        datetime: errorObject.time,
        errorObject: errorObject,
      });
      errorReport.save(function (err, savedData) {
        if (err) {
          return handleError(res, err);
        }
        res.status(201);
        return res.json("success");
      });
    } else {
      return handleError(res, "Unable to find error object");
    }
  }
};
function handleError(res, err) {
  res.status(500);
  return res.send(err);
}
