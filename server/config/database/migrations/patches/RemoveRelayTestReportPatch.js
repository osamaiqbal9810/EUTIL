import { deleteApplicationLookups } from "../../configurations/applicationlookupslist";

module.exports = {
  async apply() {
    console.log("Patch: Remove Relay Test Report form for all clients.");

    await deleteApplicationLookups([{ listName: "appForms", code: "form2" }]);
  },
};
