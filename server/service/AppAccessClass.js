import AssetsTypeModel from "../api/assetTypes/assetTypes.model";
import { inspectorPermissions } from "../config/database/permissionRoles";
import _ from "lodash";
import { UpdateOrAddIfNotExist, addIfNotExist } from "../config/database/dbFunctions/dbHelperMethods";
let UserGroup = require("../api/userGroup/userGroup.model");
let GroupPermission = require("../api/permission/permission.model");
export default class AppAccessService {
  constructor() {
    this.assetTypeAccessPermission = [
      { name: "SYSTEM_ACCESS_ASSETTYPE_TIMPS", resource: "SYSTEM_ACCESS", action: "ASSETTYPE_TIMPS" },
      { name: "SYSTEM_ACCESS_ASSETTYPE_SCIM", resource: "SYSTEM_ACCESS", action: "ASSETTYPE_SCIM" },
      { name: "SYSTEM_ACCESS_ASSETTYPE_BRIDGE", resource: "SYSTEM_ACCESS", action: "ASSETTYPE_BRIDGE" },
    ];
    this.systemUserGroups = [
      { group_id: "manager", name: "Management", permissions: [], isAdmin: false, level: 1, category: "Role" },
      { group_id: "supervisor", name: "Track Manager", permissions: [], isAdmin: false, level: 2, category: "Role" },
      { group_id: "inspector", name: "Inspection Team", permissions: [], isAdmin: false, level: 3, category: "Role" },
      {
        group_id: "trackSwitch",
        name: "Track And Switch",
        permissions: this.assetTypeAccessPermission[0].name,
        isAdmin: false,
        level: 4,
        category: "Department",
      },
      {
        group_id: "signalCrossing",
        name: "Signal And Crossing",
        permissions: this.assetTypeAccessPermission[1].name,
        isAdmin: false,
        level: 4,
        category: "Department",
      },
      {
        group_id: "bridge",
        name: "Bridge",
        permissions: this.assetTypeAccessPermission[2].name,
        isAdmin: false,
        level: 4,
        category: "Department",
      },
    ];
    this.relations = [
      { assetType: "track", permission: this.assetTypeAccessPermission[0].name },
      { assetType: "Switch", permission: this.assetTypeAccessPermission[0].name },
      { assetType: "Signal", permission: this.assetTypeAccessPermission[1].name },
      { assetType: "Crossing", permission: this.assetTypeAccessPermission[1].name },
      { assetType: "Bridge", permission: this.assetTypeAccessPermission[2].name },
    ];
  }
  async getPermissions(permType) {
    let permissions = await GroupPermission.find({}).exec(); // get all permissions
    let permissionAry = [];

    if (permType == "All") {
      permissionAry = _.map(permissions, (item) => item._id);
    }
    if (permType == "inspector") {
      for (let perm of permissions) {
        if (_.find(inspectorPermissions, { name: perm.name })) {
          permissionAry.push(perm._id);
        }
        if (_.find(this.assetTypeAccessPermission, { name: perm.name })) {
          permissionAry.push(perm._id);
        }
      }
    }
    if (permType == "trackSwitch") {
      for (let perm of permissions) {
        if (!_.find([this.assetTypeAccessPermission[1], this.assetTypeAccessPermission[2]], { name: perm.name })) {
          permissionAry.push(perm._id);
        }
      }
    }
    if (permType == "signalCrossing") {
      for (let perm of permissions) {
        if (!_.find([this.assetTypeAccessPermission[0], this.assetTypeAccessPermission[2]], { name: perm.name })) {
          permissionAry.push(perm._id);
        }
      }
    }
    if (permType == "bridge") {
      for (let perm of permissions) {
        if (!_.find([this.assetTypeAccessPermission[0], this.assetTypeAccessPermission[1]], { name: perm.name })) {
          permissionAry.push(perm._id);
        }
      }
    }
    return permissionAry;
  }

  async initializeDbOperation(customRelations, customPermissions, customGroup) {
    // create / update Permissions
    let permissionsToCheck = customPermissions ? customPermissions : this.assetTypeAccessPermission;
    for (const per of permissionsToCheck) {
      await addIfNotExist(GroupPermission, per, per);
    }
    // create / update user Groups

    if (!customGroup) {
      for (let group of this.systemUserGroups) {
        if (group.category == "Role") {
          if (group.group_id == "inspector") {
            group.permissions = await this.getPermissions(group.group_id);
          } else {
            group.permissions = await this.getPermissions("All");
          }
        }
        if (group.category == "Department") {
          group.permissions = await this.getPermissions(group.group_id);
        }
        await UpdateOrAddIfNotExist(UserGroup, group, group, { group_id: group.group_id });
      }
    }
    // update assetType
    let aTypeRelations = customRelations ? customRelations : this.relations;
    for (let rel of aTypeRelations) {
      let aType = await AssetsTypeModel.findOne({ assetType: rel.assetType });
      if (aType) {
        aType.accessPermission = rel.permission;
        await aType.save();
      }
    }
  }
}
