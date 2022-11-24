let ServiceLocator = require("../../framework/servicelocator");
let WorkOrderModel = require("./WorkOrder.model");

exports.all = async function(req, res, next) {
  let workorderService = ServiceLocator.resolve("WorkOrderService");
  let resultObj = { status: 500, errorVal: "default" };
  try {
    resultObj = await workorderService.getAll(req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("WorkOrder.controller.all.catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.notStarted = async function(req, res, next) {
  let workorderService = ServiceLocator.resolve("WorkOrderService");
  let resultObj = { status: 500, errorVal: "default" };
  try {
    resultObj = await workorderService.getNotStarted(req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("WorkOrder.controller.all.catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.show = async function(req, res, next) {
  let workorderService = ServiceLocator.resolve("WorkOrderService");
  let resultObj = { status: 500, errorVal: "default" };

  try {
    resultObj = await workorderService.get(req.params.id, req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("WorkOrder.controller.show.catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.create = async function(req, res, next) {
  let resultObj;
  resultObj = { status: 500, errorVal: "default" };
  let workorderService = ServiceLocator.resolve("WorkOrderService");

  try {
    resultObj = await workorderService.create(req.body.workorder, req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("workorder.controller.create.catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.createByMaintenanceRequest = async function(req, res, next) {
  let resultObj;
  resultObj = { status: 500, errorVal: "default" };
  let workorderService = ServiceLocator.resolve("WorkOrderService");

  try {
    resultObj = await workorderService.createByMaintenanceRequest(req.body.maintenanceRequest, req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("workorder.controller.createByMaintenanceRequest.catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.update = async function(req, res, next) {
  let resultObj;
  resultObj = { status: 500, errorVal: "default" };
  let workorderService = ServiceLocator.resolve("WorkOrderService");
  try {
    resultObj = await workorderService.update(req.body, req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("workorder.controller.update.catch", err.toString());
  }
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.delete = async function(req, res, next) {
  let resultObj;
  resultObj = { status: 500, errorVal: "default" };
  let workorderService = ServiceLocator.resolve("WorkOrderService");
  try {
    resultObj = await workorderService.delete(req.params.id, req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("workorder.controller.delete.catch", err.toString());
  }
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.multiLine = async function(req, res, next) {
  let workorderService = ServiceLocator.resolve("WorkOrderService");
  let resultObj = { status: 500, errorVal: "default" };
  let lines = [];
  if (req.query.lines) {
    lines = JSON.parse(req.query.lines);
  }

  try {
    resultObj = await workorderService.multiLineMaintenance(lines);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("workorder.controller.multiLine.catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.locationWO = async function(req, res, next) {
  let workorderService = ServiceLocator.resolve("WorkOrderService");
  let resultObj = { status: 500, errorVal: "default" };
  try {
    resultObj = await workorderService.getLocationWO(req.params.id);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("WorkOrder.controller.all.catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
function handleError(res, err) {
  res.status(500);
  return res.send(err);
}
