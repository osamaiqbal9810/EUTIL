let ServiceLocator = require("../../framework/servicelocator");
let GpsLogModel = require("./GpsLog.model");

exports.all = async function(req, res, next) {
  let GpsLogService = ServiceLocator.resolve("GpsLogService");
  let resultObj = { status: 500, errorVal: "default" };
  try {
    resultObj = await GpsLogService.getAll(
      req.user,
      req.params.line ? req.params.line : ""
    );
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.show = async function(req, res, next) {
  let GpsLogService = ServiceLocator.resolve("GpsLogService");
  let resultObj = { status: 500, errorVal: "default" };

  try {
    resultObj = await GpsLogService.get(req.params.id, req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("cathc", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

function handleError(res, err) {
  res.status(500);
  return res.send(err);
}
