import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
module.exports = {
  async up() {
    console.log("Add ETR Switch AppForm");
    await addApplookupIfNotExist([{ listName: "appForms", code: "etrLHSwitchForm" }]);
    await addApplookupIfNotExist([{ listName: "appForms", code: "etrRHSwitchForm" }]);
    await ApplicationLookupsModel.updateOne(
      { listName: "Customer" },
      {
        $set: {
          "opt2.0.subset": [
            "Line Inspection Report",
            "Switch Report",
            "Track Disturbance Report",
            "Yard Inspection Report",
            "Detailed Switch Inspection",
            "Bridge Inspection Report",
            "Turnout Inspection Report",
          ],
        },
      },
    );
  },
  attributes: { applicationType: "TIMPS", customer: "Essex Terminal Railway" },
};
