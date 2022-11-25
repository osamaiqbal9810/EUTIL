import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
module.exports = {
  async up() {
    console.log("Add TXNW Curve AppForm");
    await addApplookupIfNotExist([{ listName: "appForms", code: "curveTestForm" }]);
    let customer = await ApplicationLookupsModel.findOne({ listName: "Customer" }).exec();
    if (customer && customer.opt2 && customer.opt2[0] && customer.opt2[0].subset) {
      console.log("Adding Curve Report to customer");
      customer.opt2[0].subset.push("Inspection of Curves");
      customer.markModified("opt2");
    }
    if (customer && customer.opt1 && customer.opt1.appearance) {
      console.log("Adding TXNW icon to customer appearence");
      customer.opt1.appearance.logo1 = "txnw";
      customer.opt1.appearance.logo2 = "";
      customer.markModified("opt1");
    }
    await customer.save();
  },
  attributes: { applicationType: "TIMPS", customer: "TXNW" },
};
