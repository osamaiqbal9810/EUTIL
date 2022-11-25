
let ServiceLocator = require("../../../framework/servicelocator");
import InspectionReports from "./InspectionReports.service";
// async function getplanController(req, res, next) {
//   AssetsReports.find().exec(async function(err, plan) {
//     let plans = await getplans(req.user, plan);
//     if (err) {
//       return handleError(res, err);
//     }
//     res.status(200);
//     res.json(plans);
//   });
// }
exports.assetsReports = async function (req, res, next) {
  let resultObj = { status: 500, errorVal: "default" };
  let lines = [];
  if (req.query.lines) {
    lines = JSON.parse(req.query.lines);
  }
  try {
    resultObj = await InspectionReports.getAssetsreports();
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

