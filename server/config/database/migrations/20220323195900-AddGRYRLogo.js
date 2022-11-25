import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";
module.exports = {
  async up() {
    console.log("Add Grenada Railroad logo");
    let Customer = await ApplicationLookupsModel.findOne({ listName: "Customer" });
    if(Customer && Customer.opt1 && Customer.opt1.appearance && Customer.opt1.appearance.hasOwnProperty('logo1') && Customer.opt1.appearance.hasOwnProperty('logo2')) {
        Customer.opt1.appearance.logo1 = "gryr";
        Customer.opt1.appearance.logo2 = "gryr";
        Customer.markModified('opt1');
        await Customer.save();
    }
    else 
     throw new Error(`Migration failed: Invalid customer object ${JSON.stringify(Customer)}`);
  },
  attributes: { customer: "Grenada Railroad" },
};
