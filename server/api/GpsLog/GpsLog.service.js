let ServiceLocator = require("../../framework/servicelocator");
let GpsLogModel = require("./GpsLog.model");

class GpsLogService {
  constructor() {}

  async getAll(user, lineid) {
    let resultObj = {};

    return resultObj;
  }
  async get(id, user) {
    let resultObj = {};

    return resultObj;
  }
}
var maintenanceService = new GpsLogService();
ServiceLocator.register("GpsLogService", GpsLogService);
module.exports = GpsLogService;
