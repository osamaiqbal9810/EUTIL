let ServiceLocator = require("../../framework/servicelocator");

exports.all = async function (req, res, next) {
  let alertService = ServiceLocator.resolve("AlertService");
  let resultObj = { status: 500, errorVal: "default" };
  try {
    resultObj = await alertService.all(req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("Alert.controller.all.catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
