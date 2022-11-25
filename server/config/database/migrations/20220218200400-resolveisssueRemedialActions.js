import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
module.exports = {
  async up() {
    console.log("update remedial action config for issue resolve");
    await ApplicationLookupsModel.updateOne({ listName: "config", code: "issueResolveRemedialAction" }, { $set: { opt2: false } });
    await ApplicationLookupsModel.updateOne(
      { listName: "resolveIssueRemedialAction", code: "resolveIssuesOnRemedialAction" },
      { $push: { opt1: "No Repair Required or N/A" } },
    );
  },
  attributes: { applicationType: "EUtility" },
};
