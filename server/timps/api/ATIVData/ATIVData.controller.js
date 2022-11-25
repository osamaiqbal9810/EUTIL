let ATIVData = require("./ATIVData.model");
let ServiceLocator = require("../../../framework/servicelocator");

exports.getAll = async function (req, res, next) {
  let resultObj = { status: 500, message: "default" };
  try {
    let ativService = ServiceLocator.resolve("ATIVDataService");
    resultObj = await ativService.getNotRemoved();
  } catch (err) {
    resultObj.status = 500;
    resultObj.message = err.message;
  }
  res.status(resultObj.status);
  res.json(resultObj.data);
};
exports.delete = async function (req, res, next) {
  let resultObj = { status: 500, message: "default" };
  try {
    let ativService = ServiceLocator.resolve("ATIVDataService");
    resultObj = await ativService.deleteRecord(req.params.id);
  } catch (err) {
    resultObj.status = 500;
    resultObj.message = err.message;
  }
  res.status(resultObj.status);
  res.json(resultObj.data);
  // req.params.id contains the record to delete
};
exports.create = async function (req, res, next) {
  // console.log(req.body.ATIVData);
  // receives an array of records in the body
  let resultObj = { status: 500, message: "default" };

  try {
    let ativService = ServiceLocator.resolve("ATIVDataService");
    resultObj = await ativService.insertRecords(req.body.ATIVData);
  } catch (err) {
    resultObj.status = 500;
    resultObj.message = err.message;
  }
  res.status(resultObj.status);
  res.json(resultObj.message);
};
exports.addToWorkplan = async function (req, res, next) {
  // req.params.id
  // req.params.workplanId
  let resultObj = { status: 500, message: "default" };

  try {
    let ativService = ServiceLocator.resolve("ATIVDataService");
    resultObj = await ativService.addRecordToWorkplan(req.body);
  } catch (err) {
    resultObj.status = 500;
    resultObj.message = err.message;
  }
  res.status(resultObj.status);
  res.json(resultObj.message);
};
