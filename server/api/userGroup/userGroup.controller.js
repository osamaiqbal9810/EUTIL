let UserGroup = require("./userGroup.model");
let async = require("async");
let ServiceLocator = require("../../framework/servicelocator");

exports.index = function(req, res) {
  if (req.user.isAdmin) {
    UserGroup.find().exec(function(err, userGroup) {
      if (err) {
        return handleError(res, err);
      }
      res.status(200);
      res.json(userGroup);
    });
  } else {
    UserGroup.find({ level: { $gte: req.user.userGroup.level } }).exec(function(err, userGroup) {
      if (err) {
        return handleError(res, err);
      }
      res.status(200);
      res.json(userGroup);
    });
  }
};

function handleError(res, err) {
  res.status(500);
  return res.send(err);
}

exports.update = async function(req, res, next) {
  let userGroupService = ServiceLocator.resolve("UserGroupService");
  let result = await userGroupService.updateGroupPermission(req.body);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
