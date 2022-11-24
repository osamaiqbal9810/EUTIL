import AssetsTreeModel from "../assetsTree/assetsTreeModel";
let ServiceLocator = require("../../framework/servicelocator");
let assetsModal = require("./assets.modal");
exports.all = async function(req, res, next) {
  //console.log("Assets Controller all ");
  let AssetsService = ServiceLocator.resolve("AssetsService");
  //let resultObj = await AssetsService.getAllAssetsLamp(req.user);
  let resultObj = await AssetsService.getUserLampAssets(req.user, req.query);
  if (resultObj.errorVal) {
    return res.send(resultObj.errorVal);
  }
  res.status(200);
  res.json(resultObj.value);
};

exports.getInspectableAssets = async function(req, res) {
  let AssetsService = ServiceLocator.resolve("AssetsService");
  let resultObj = await AssetsService.getInspectableAssets(req.user, "AssetsModel", "_id");
  if (resultObj.errorVal) {
    return res.send(resultObj.errorVal);
  }
  res.status(200);
  res.json(resultObj.value);
};

exports.create = async function(req, res, next) {
  //console.log(req.body);
  let AssetsService = ServiceLocator.resolve("AssetsService");
  let resultObj; //= await AssetsService.createAssetsLamp(req.body.asset);
  if (req.body.asset.wizard && req.body.asset.wizard == true) {
    resultObj = await AssetsService.createAssetsLampWizard(req.body.asset);
  } else {
    resultObj = await AssetsService.createAssetsLamp(req.body.asset);
  }
  if (resultObj.errorVal) {
    return res.send(resultObj.errorVal);
  }
  res.status(200);
  res.json(resultObj.value);
};

exports.createMultiple = async function(req, res, next) {
// createMultipleAssets( multipleAssets )
let AssetsService = ServiceLocator.resolve("AssetsService");
  let resultObj; 
  if (req.body.assetsList) {
    resultObj = await AssetsService.createMultipleAssets(req.body.assetsList);
  } else {
    resultObj = {status: 400, errorVal: 'Assets list missing'};
  }
  if (resultObj.errorVal) {
    return res.send(resultObj.errorVal);
  }
  res.status(200);
  res.json(resultObj.value);
};

exports.find = async function(req, res) {
  //console.log(req.body);
  let AssetsService = ServiceLocator.resolve("AssetsService");
  let resultObj = await AssetsService.find(req.params.id);
  if (resultObj.errorVal) {
    return res.send(resultObj.errorVal);
  }
  res.status(200);
  res.json(resultObj.value);
};

exports.getParentLinesWithSelf = async function(req, res, next) {
  let assetService = ServiceLocator.resolve("AssetsService");

  let resultObj = await assetService.getParentLinesWithSelf(req.user, req.body.criteria); // TODO: pass filter such as, Railroad, Division, Subdivision

  res.status(resultObj.status);

  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.getParentLines = async function(req, res, next) {
  let assetService = ServiceLocator.resolve("AssetsService");

  let resultObj = await assetService.getParentLines(req.user); // TODO: pass filter such as, Railroad, Division, Subdivision

  res.status(resultObj.status);

  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.getAssetsForLine = async function(req, res, next) {
  let assetService = ServiceLocator.resolve("AssetsService");
  let resultObj = {};
  if (req.query && req.query.lineName) {
    try {
      let lineName = req.query.lineName;
      resultObj = await assetService.getAssetsForLine(lineName, req.user);
    } catch (err) {
      resultObj.status = 500;
      resultObj.errVal = err;
    }
  } else {
    resultObj.status = 404;
    resultObj.errorVal = "Missing parameter, lineName";
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.getAssetTypeAssets = async function(req, res, next) {
  let assetService = ServiceLocator.resolve("AssetsService");
  let assetObj = JSON.parse(req.params.assetObj);
  let resultObj = await assetService.getAssetTypeAssets(assetObj);
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.update = async function(req, res, next) {
  let assetService = ServiceLocator.resolve("AssetsService");

  let resultObj = await assetService.updateAsset(req.body);
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.updateMultipleAssets = async function(req, res, next) {
  let assetService = ServiceLocator.resolve("AssetsService");

  let resultObj = await assetService.updateMultipleAsset(req.body);
  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};
exports.delete = async function(req, res, next) {
  let assetService = ServiceLocator.resolve("AssetsService");

  let resultObj = await assetService.deleteAsset(req.params.id);
  res.status(resultObj.status);

  if (resultObj.value) {
    res.json(resultObj.value);
  } else {
    res.json(resultObj.errorVal);
  }
};
exports.multiLine = async function(req, res, next) {
  let assetService = ServiceLocator.resolve("AssetsService");
  let resultObj = { status: 500, errorVal: "default" };
  let lines = [];
  if (req.query.lines) {
    lines = JSON.parse(req.query.lines);
  }
  try {
    resultObj = await assetService.multiLineAssets(lines);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.getLocationSetup = async function(req, res) {
  let locationService = ServiceLocator.resolve("LocationService");
  let resultObj = await locationService.getLocations(req.params.id);
  res.status(resultObj.status);

  if (resultObj.value) {
    res.json(resultObj.value);
  } else {
    res.json(resultObj.errorVal);
  }
};

exports.updateLocationSetup = async function(req, res) {
  let locationService = ServiceLocator.resolve("LocationService");
  let resultObj = await locationService.updateLocations(req.params.id, req.body);
  res.status(resultObj.status);
  if (resultObj.value) {
    res.json(resultObj.value);
  } else {
    res.json(resultObj.errorVal);
  }
};

exports.getUnAssignedAssets = async function(req, res) {
  let assetService = ServiceLocator.resolve("AssetsService");
  let resultObj = await assetService.getUnAssignedAssets();
  res.status(resultObj.status);
  if (resultObj.value) {
    res.json(resultObj.value);
  } else {
    res.json(resultObj.errorVal);
  }
};

exports.getAssetTree = async function(req, res) {
  try {
    let assetTree = await AssetsTreeModel.findOne({ tag: "AssetTree" }).exec();
    res.status(200);
    res.json(assetTree);
  } catch (err) {
    res.status(500);
    return res.send(err);
  }
};
