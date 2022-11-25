import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";

module.exports = {
  async up() {
    console.log("Change Customer version array to string for mobile app");
    let Customer = await ApplicationLookupsModel.findOne({ listName: "Customer" });
    if (Customer && Customer.opt1 && Customer.opt1.compatibleMobileApps && Array.isArray(Customer.opt1.compatibleMobileApps) && Customer.opt1.compatibleMobileApps.length) {
      let val = Customer.opt1.compatibleMobileApps[0];
      Customer.opt1.compatibleMobileApps = val;
      Customer.markModified("opt1");
      await Customer.save();
    }
  },
};
