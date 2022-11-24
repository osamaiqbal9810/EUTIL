let ServiceLocator = require("../../../framework/servicelocator");

exports.getReportFilter = async function(req, res, next) {
  let testScheduleService = ServiceLocator.resolve("TestScheduleService");
  let result = await testScheduleService.getReportFilter(req.query);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
