let ServiceLocator = require("../../framework/servicelocator");
let DashboardModel = require("./dashboard.model");
exports.all = async function(req, res, next) {
  let dashboardService = ServiceLocator.resolve("DashboardService");
  let result = await dashboardService.getDashboardData(req.user, req.query);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
