let ServiceLocator = require("../../framework/servicelocator");

export default class PermissionService {
  async getAllPermissions() {
    let resultObj = {};
    let PermissionModel = ServiceLocator.resolve("PermissionModel");
    try {
      const permission = await PermissionModel.find().exec();
      resultObj = { value: permission, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err, status: 500 };
    }
    return resultObj;
  }

  async createPermission(permission) {
    let resultObj = {};

    let PermissionModel = ServiceLocator.resolve("PermissionModel");
    let newPermission = new PermissionModel(permission);
    try {
      const permission = await newPermission.save();
      resultObj = { value: permission, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err, status: 500 };
    }
    return resultObj;
  }
  async updatePermission(permission) {
    let resultObj = {};
    let PermissionModel = ServiceLocator.resolve("PermissionModel");
    let newPermission = new PermissionModel(permission);
    try {
      let objToUpdate = await PermissionModel.findById(permission._id).exec();
      objToUpdate.resource = permission.resource;
      objToUpdate.action = permission.action;
      objToUpdate.name = permission.name;
      try {
        const permission = await objToUpdate.save();
        resultObj = { value: permission, status: 200 };
      } catch (err) {
        resultObj = { errorVal: err, status: 500 };
      }
      resultObj = { value: permission, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err, status: 500 };
    }
    return resultObj;
  }
}
