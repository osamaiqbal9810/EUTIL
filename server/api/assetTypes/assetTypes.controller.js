let AssetTypeModel = require("./assetTypes.model");
let ServiceLocator = require("../../framework/servicelocator");

exports.all = async function(req, res, next) {
  let assetsTypeService = ServiceLocator.resolve("AssetsTypeService");
  let result = await assetsTypeService.get_AssetTypes();
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};

exports.find = function(req, res, next) {
  // JourneyPlan.findOne({ _id: req.params.id , isRemoved : !true }).exec(function(err, plan) {
  //   if (err) {
  //     return handleError(res, err);
  //   }
  //   res.status(200);
  //   res.json(plan);
  // });
};

exports.create = async function(req, res, next) {
  let resultObj = {status: 500, errorVal: 'default'};
  let assetsTypeService = ServiceLocator.resolve("AssetsTypeService");


  try {
    resultObj = await assetsTypeService.create_assetTypes(req.body);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log('create assetType error');
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.update = async function(req, res, next) {
  let resultObj = {status: 500, errorVal: 'default'};
  let assetsTypeService = ServiceLocator.resolve("AssetsTypeService");

  try {
    resultObj = await assetsTypeService.update_assetTypes(req.body);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log('update assetType error');
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);

  // JourneyPlan.findOne({ _id: req.params.id }).exec(function(err, plan) {
  //   if (err) {
  //     return handleError(res, err);
  //   }
  //   plan.user = req.body.user;
  //   plan.title = req.body.title;
  //   plan.tasks = req.body.tasks;
  //   plan.subdivision = req.body.subdivision;
  //   plan.save(function(err, plan) {
  //     if (err) {
  //       return next(err);
  //     }
  //     res.status(200);
  //     return res.json(plan);
  //   });
  // });
};
exports.delete = async function(req, res, next) {
  // let assetsTypeService = ServiceLocator.resolve("WorkPlanTemplateService");
  // let result = await assetsTypeService.deleteWorkPlanTemplate(req.params.id);
  // res.status(result.status);
  // if (result.errorVal) {
  //   return res.send(result.errorVal);
  // }
  // res.json(result.value);
};

