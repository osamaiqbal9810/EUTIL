let UserGroup = require("../../../api/userGroup/userGroup.model");

module.exports = {
  async up() {
    console.log("Update database: update name for Signal manager");
    await UserGroup.updateOne({ group_id: "supervisor" }, { $set: { name: "Signal Manager" } });
  },
  attributes: { applicationType: "SITE" },
};
