import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";

module.exports = {
  async up() {
    console.log("Ontario NorthLand update appforms to copy allowedInstruction over instructionFile");
    let appForms = await ApplicationLookupsModel.find({listName:"appForms", "opt2.allowedInstruction":{$exists:true}});

    for (let form of appForms) {
      if(form && form.opt2 && form.opt2.config && form.opt2.config[0] && form.opt2.allowedInstruction.length){
        form.opt2.config[0].instructionFile = form.opt2.allowedInstruction;
        form.markModified('opt2');
        await form.save();
        } 
    }
  },
  attributes: { customer: "Ontario Northland", applicationType: "SITE" },
};
