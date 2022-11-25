import UserGroupModel from "../../../api/userGroup/userGroup.model";

module.exports = {
  async up() {
    console.log("Remove Management Role");
    await UserGroupModel.findOneAndDelete({ group_id: "manager" }, function (err, docs) {
      if (err) {
        console.log(err)
      }
      else {
        console.log("Deleted");
      }
    });
  },
  attributes: { applicationType: "EUtility" },
};