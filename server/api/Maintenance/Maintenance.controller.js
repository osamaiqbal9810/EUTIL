let ServiceLocator = require("../../framework/servicelocator");
let MaintenanceModel = require("./Maintenance.model");

import MaintenanceService from "./Maintenance.service";

exports.all = async function(req, res, next) {
  let resultObj = { status: 500, errorVal: "default" };
  try {
    let maintenanceService = ServiceLocator.resolve("MaintenanceService");

    resultObj = await maintenanceService.getAll(req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("Maintenance.controller.all.catch:", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.show = async function(req, res, next) {
  let maintenanceService = ServiceLocator.resolve("MaintenanceService");
  let resultObj = { status: 500, errorVal: "default" };

  try {
    resultObj = await maintenanceService.get(req.params.id, req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("cathc", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.createWeb = async function(req, res, next) {
  let resultObj, maintenanceService;
  resultObj = { status: 500, errorVal: "default" };
  maintenanceService = ServiceLocator.resolve("MaintenanceService");
  try {
    resultObj = await maintenanceService.createFromWeb(req.body.maintenance, req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("create Maintenance error", err.toString());
  }
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

// exports.createByIssue = async function(req, res, next)
// {
//   let resultObj, maintenanceService;
//   resultObj = { status: 500, errorVal: "default" };
//   maintenanceService = ServiceLocator.resolve("MaintenanceService");

//   try
//   {
//     //resultObj = await maintenanceService.createFromWeb(req.body.maintenance, req.user);
//     resultObj = await maintenanceService.createNewMaintenance(req.body.issuesReport, req.user);
//     //console.log('createByIssue', req.body.issuesReport);
//     //resultObj.status=200;

//   }
//   catch (err)
//   {
//     resultObj.status = 500;
//     resultObj.errorVal = err.toString();
//     console.log("create Maintenance by issue error", err.toString());
//   }

//   res.status(resultObj.status);
//   if (resultObj.value) res.json(resultObj.value);
//   else res.json(resultObj.errorVal);
// };

exports.updateWeb = async function(req, res, next) {
  let resultObj, maintenanceService;
  resultObj = { status: 500, errorVal: "default" };
  maintenanceService = ServiceLocator.resolve("MaintenanceService");
  try {
    resultObj = await maintenanceService.updateFromWeb(req.body);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("update Maintenance error", err.toString());
  }
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.multiLine = async function(req, res, next) {
  let maintenanceService = ServiceLocator.resolve("MaintenanceService");
  let resultObj = { status: 500, errorVal: "default" };
  let lines = [];
  if (req.query.lines) {
    lines = JSON.parse(req.query.lines);
  }
  try {
    resultObj = await maintenanceService.multiLineMaintenance(lines);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

function handleError(res, err) {
  res.status(500);
  return res.send(err);
}
