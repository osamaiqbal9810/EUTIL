import { UpdateOrAddIfNotExist } from "../../dbFunctions/dbHelperMethods";
import { inspectorPermissions } from "../../permissionRoles";
let UserGroup = require("../../../../api/userGroup/userGroup.model");
let GroupPermission = require("../../../../api/permission/permission.model");
import _ from "lodash";
module.exports = {
  async apply() {
    let permissions = await GroupPermission.find({}).exec(); // get all permissions
    let inspectorPermissionArray = [];
    for (let perm of permissions) {
      if (_.find(inspectorPermissions, { name: perm.name })) {
        inspectorPermissionArray.push(perm._id);
      }
    }
    let grp = {
      group_id: "maintenance",
      name: "Maintenance Team",
      permissions: inspectorPermissionArray,
      isAdmin: false,
      level: 3,
      category: "Role",
    };
    await UpdateOrAddIfNotExist(UserGroup, grp, grp, { group_id: grp.group_id });
  },
};
