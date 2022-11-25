import MigrationsModel from "../../../../api/migrations/migrations.model";


module.exports = {
  async apply() {
    console.log("Patch: Fix some invalid migration names in the database.");
    await MigrationsModel.updateOne({name:"20211115186000-AddDefaultObserveConfiguration.js"},{$set:{name:"20211115190000-AddDefaultObserveConfiguration.js"}});
    await MigrationsModel.updateOne({name:"20211111176000-SideTrackAssetType.js"},{$set:{name:"20211111180000-SideTrackAssetType.js"}});
    await MigrationsModel.updateOne({name:"20211117216000-AddAudibleAlertConfiguration.js"},{$set:{name:"20211117220000-AddAudibleAlertConfiguration.js"}});
    await MigrationsModel.updateOne({name:"20220531220300-NOPBAddRARTrackYardSwitch.js"},{$set:{name:"20220601193700-NOPBAddRARTrackYardSwitch"}});
    
  },
};