import UserGroupModel from "../../../api/userGroup/userGroup.model";

module.exports = {
    async up() {
      console.log("update user group");
      await UserGroupModel.updateOne({ group_id: "supervisor" }, { $set: { name: "Manager" } });
    },
    attributes: { applicationType: "EUtility" },
  };