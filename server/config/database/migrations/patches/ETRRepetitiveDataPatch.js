import JourneyPlanModel from "../../../../timps/api/journeyPlan/journeyPlan.model";
module.exports = {
  async apply() {
    console.log("Running Patch to remove 2 duplicate stuck In Progress status ETR inspections ");
    await JourneyPlanModel.deleteMany({
      status: "In Progress",
      $or: [{ title: "Monthly Switch Inspection - Salt Hill" }, { title: "Ojibway Bi-Weekly Switch Inspection" }],
    });
  },
};
