let JplanModel = require("../../../../timps/api/journeyPlan/journeyPlan.model");
let MaintenanceModel = require("../../../../api/Maintenance/Maintenance.model");
module.exports = {
  async apply() {
    console.log("Patch: Remove duplicate jplans with same private key");
    let duplicatePlans = await JplanModel.aggregate([
      { $group: { _id: { privateKey: "$privateKey" }, uniqueIds: { $addToSet: { id: "$_id", status: "$status" } }, count: { $sum: 1 } } },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);
    let idsToRemove = [];
    for (let planGroup of duplicatePlans) {
      let uniqueIds = [];
      let oneFinishedIgnored = false;
      for (let uniqueIdObj of planGroup.uniqueIds) {
        if (oneFinishedIgnored) {
          uniqueIds.push(uniqueIdObj.id);
        } else {
          uniqueIdObj.status === "Finished" && (oneFinishedIgnored = true);
        }
      }
      idsToRemove = [...idsToRemove, ...uniqueIds];
    }

    let idStrings = idsToRemove.map((id) => id.toString());
    await JplanModel.deleteMany({ _id: { $in: idsToRemove } });
    await MaintenanceModel.deleteMany({ inspection: { $in: idStrings } });
  },
};
