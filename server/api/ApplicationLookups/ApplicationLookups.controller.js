/**
 * Created by zqureshi on 10/12/2018.
 */
let _ = require("lodash");
let ServiceLocator = require("../../framework/servicelocator");
let ApplicationLookupsModel = require("./ApplicationLookups.model");
let tenantInfo = require("../../utilities/tenantInfo");

exports.show = async function (req, res, next) {
  //console.log('list names:', req.params.lists);
  let applicationLookupsService = ServiceLocator.resolve("ApplicationLookupsService");

  let resultObj = await applicationLookupsService.getLists(req.params.lists ? req.params.lists : []);
  res.status(resultObj.status);

  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.find = function (req, res, next) {
  ApplicationLookupsModel.findOne({ _id: req.params.id }).exec(function (err, category) {
    if (err) {
      return handleError(res, err);
    }
    res.status(200);
    res.json(category);
  });
};

exports.getCodes = async function (req, res, next) {
  let criteria = {};
  if (req.params.listName && req.params.codes) {
    let codes = req.params.codes.split(",");
    if (codes && codes.length) {
      criteria.listName = req.params.listName;
      criteria.code = { $in: codes };
    }
  }
  ApplicationLookupsModel.find(criteria).exec(function (err, lists) {
    if (err) {
      return handleError(res, err);
    }
    res.status(200);
    res.json(lists);
  });
};

exports.getList = async function (req, res, next) {
  if (req.params.listname == "Subdivision") {
    let applicationLookupsService = ServiceLocator.resolve("ApplicationLookupsService");
    let result = await applicationLookupsService.getSubdivisionService(req.user, req.params.listname);
    res.status(result.status);
    if (result.errorVal && result.status == 500) {
      return res.send(result.errorVal);
    }
    res.json(result.value);
  } else {
    ApplicationLookupsModel.find({ listName: req.params.listname }).exec(function (err, category) {
      if (err) {
        return handleError(res, err);
      }
      res.status(200);
      res.json(category);
    });
  }
};
exports.getAssetTypeTests = async function (req, res, next) {
  let applicationLookupsService = ServiceLocator.resolve("ApplicationLookupsService");
  let resultObj = await applicationLookupsService.getAssetTypeTests(req.params.mode);

  res.status(resultObj.status);

  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.create = async function (req, res, next) {
  let applicationLookupsService = ServiceLocator.resolve("ApplicationLookupsService");
  let resultObj = await applicationLookupsService.create(req);

  res.status(resultObj.status);

  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.update = async function (req, res, next) {
  let applicationLookupsService = ServiceLocator.resolve("ApplicationLookupsService");
  let resultObj = await applicationLookupsService.updateList(req.params.id, req.body);
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.delete = async function (req, res, next) {
  try {
    let applicationLookupsService = ServiceLocator.resolve("ApplicationLookupsService");
    let result = await applicationLookupsService.deleteOne(req.params.id, req);
    res.status(result.status);

    if (result.errorVal && result.status === 500) return res.send(result.errorVal);

    res.json(result.value);
  } catch (err) {
    console.log(err);
  }
};

function handleError(res, err) {
  res.status(500);
  return res.send(err);
}

exports.updateGeoLogging = async function (req, res, next) {
  let applicationLookupsService = ServiceLocator.resolve("ApplicationLookupsService");
  let result = await applicationLookupsService.setGlobalGeoLoggingOption(req.body, req.hostname);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};

exports.updateLanguage = async function (req, res, next) {
  let applicationLookupsService = ServiceLocator.resolve("ApplicationLookupsService");
  let result = await applicationLookupsService.addNewDynamicLanguageWord(req.body);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};

exports.editLanguage = async function (req, res, next) {
  let applicationLookupsService = ServiceLocator.resolve("ApplicationLookupsService");
  let result = await applicationLookupsService.editDynamicLanguageWord(req.body);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
exports.deleteLanguage = async function (req, res, next) {
  let applicationLookupsService = ServiceLocator.resolve("ApplicationLookupsService");
  let result = await applicationLookupsService.deleteDynamicLanguageWord(req.body);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
