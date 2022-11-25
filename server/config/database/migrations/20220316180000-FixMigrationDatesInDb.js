import MigrationModel from "../../../api/ApplicationLookups/ApplicationLookups.model";

module.exports = {
  async up() {
    console.log("Fix migration name in database");
    await MigrationModel.updateMany(
      { name: "20211111176000-SideTrackAssetType.js" },
      { $set: { name: "20211111180000-SideTrackAssetType.js" } },
    );
    await MigrationModel.updateMany(
      { name: "20211115186000-AddDefaultObserveConfiguration.js" },
      { $set: { name: "20211115190000-AddDefaultObserveConfiguration.js" } },
    );
    await MigrationModel.updateMany(
      { name: "20211117216000-AddAudibleAlertConfiguration.js" },
      { $set: { name: "20211117220000-AddAudibleAlertConfiguration.js" } },
    );
  },
};
