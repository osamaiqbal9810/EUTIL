import JourneyPlanModel from "../../../../timps/api/journeyPlan/journeyPlan.model";
module.exports = {
  async apply() {
    console.log("Running Patch to remove duplicate stuck In Progress status TXNW inspections ");
    await JourneyPlanModel.deleteMany({
      status: "In Progress",
      $or: [{ title: "Z800 S switch " }, { title: "Z700 switches " }, { title: "Z800 S tracks " }],
    });
  },
};
