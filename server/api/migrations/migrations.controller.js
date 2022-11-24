let ServiceLocator = require("../../framework/servicelocator");
let MaintenanceModel = require("./migrations.model");
import MigrationService from "./migrations.service";

exports.all = async function(req, res, next) {
  let resultObj = { status: 500, errorVal: "default" };
  try {
    let migrationService = ServiceLocator.resolve("MigrationsService");

    resultObj = await migrationService.getAllPatchesForAPI(req.user);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("Migration.controller.all.catch:", err.toString());
  }

   res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.execute = async function(req, res, next) {
  let resultObj;
  resultObj = { status: 500, errorVal: "default" };
  let migrationService = ServiceLocator.resolve("MigrationsService");
  try {
    if(req && req.body && req.body.patch && req.body.patch.patchname)
        resultObj = await migrationService.executePatch(req.body.patch.patchname); //.createFromWeb(req.body.maintenance, req.user);
    else console.log("execute patch parameter not provided.");

  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("Migration.controller.execute patch error", err.toString());
  }
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
