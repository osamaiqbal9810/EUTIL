let ServiceLocator = require("../../framework/servicelocator");

export default class UserGroupService {
  async updateGroupPermission(group) {
    let resultObj = {};
    let UserGroupModel = ServiceLocator.resolve("UserGroupModel");
    let newPermission = new UserGroupModel(group);
    try {
      let objToUpdate = await UserGroupModel.findById(group._id).exec();
      objToUpdate.permissions = group.permissions;
      try {
        const group = await objToUpdate.save();
        resultObj = { value: group, status: 200 };
      } catch (err) {
        resultObj = { errorVal: err, status: 500 };
      }
      resultObj = { value: group, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err, status: 500 };
    }
    return resultObj;
  }

  async all(user, req) {
    let groups = [];
    let criteria = {};
    
    let UserGroupModel = ServiceLocator.resolve("UserGroupModel");
    let userGroup = await UserGroupModel.findById(req.user.userGroup);

    if (!user.isAdmin) {
      criteria = { level: { $gte: userGroup.level }};
    }

    groups = await UserGroupModel.find(criteria).exec();

    return groups;
  }
}
