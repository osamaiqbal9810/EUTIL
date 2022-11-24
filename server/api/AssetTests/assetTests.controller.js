let ServiceLocator = require("../../framework/servicelocator");

exports.find = async function (req, res, next) {
  let assetTestsService = ServiceLocator.resolve("AssetTestsService");
  let result = await assetTestsService.findAssetTests(req.params.id);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
