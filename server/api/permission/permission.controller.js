let ServiceLocator = require("../../framework/servicelocator");

exports.all = async function(req, res, next) {
  let permissionService = ServiceLocator.resolve("PermissionService");
  let result = await permissionService.getAllPermissions();
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};

exports.create = async function(req, res, next) {
  let permissionService = ServiceLocator.resolve("PermissionService");
  let result = await permissionService.createPermission(req.body.permission);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};

exports.update = async function(req, res, next) {
  let permissionService = ServiceLocator.resolve("PermissionService");
  let result = await permissionService.updatePermission(req.body);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
