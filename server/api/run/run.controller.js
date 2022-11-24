let ServiceLocator = require("../../framework/servicelocator");
let runModal = require("./run.model");
exports.all = async function(req, res, next) {
  //console.log("Assets Controller all ");
  let RunService = ServiceLocator.resolve("LineRunService");
  let resultObj = await RunService.getRuns(req.query.lineName, req.user);
  if (resultObj.errorVal) {
    return res.send(resultObj.errorVal);
  }
  res.status(200);
  res.json(resultObj.value);
};

exports.create = async function(req, res, next) {
  let RunService = ServiceLocator.resolve("LineRunService");
  let resultObj = await RunService.createRun(req.body.runNumber);
  if (resultObj.errorVal) {
    return res.send(resultObj.errorVal);
  }
  res.status(200);
  res.json(resultObj.value);
};

exports.read = async function(req, res, next) {
  let RunService = ServiceLocator.resolve("LineRunService");
  let resultObj = await RunService.findSingleRun(req.params.id);
  if (resultObj.errorVal) {
    return res.send(resultObj.errorVal);
  }
  res.status(200);
  res.json(resultObj.value);
};

exports.lineRuns = async function(req, res, next) {
  //console.log("Assets Controller all ");
  let RunService = ServiceLocator.resolve("LineRunService");
  let resultObj = await RunService.getLineRuns();
  if (resultObj.errorVal) {
    return res.send(resultObj.errorVal);
  }
  res.status(200);
  res.json(resultObj.value);
};

exports.delete = async function(req, res, next) {
  let RunService = ServiceLocator.resolve("LineRunService");
  let resultObj = await RunService.findSingleRun(req.params.id);
  if (resultObj.errorVal) {
    return res.send(resultObj.errorVal);
  }

  let runToRemove = resultObj.value;
  if (!runToRemove) {
    res.status(404);
    res.json("Not found");
  } else {
    if (!runToRemove.runRanges || runToRemove.runRanges.length === 0) {
      runToRemove.isRemoved = true;
      runToRemove.save(() => {
        res.status(200);
        res.json("Success");
      });
      /*       runToRemove.remove(()=>{
        res.status(200);
        res.json('Success');
      });
 */
    } else {
      res.status(500);
      res.json("Run not empty");
    }
  }
};
