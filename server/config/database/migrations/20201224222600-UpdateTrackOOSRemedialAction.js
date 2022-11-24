import { updateApplicationLookups, deleteApplicationLookups, addApplookupIfNotExist } from "../configurations/applicationlookupslist";

module.exports = {
    async up(){
     console.log('Update Script: Update Remedial Actions');

    await updateApplicationLookups([{listName: "remedialAction", code: "03 notrepaired", compare:"opt1"}]); // update opt1 if item alread exist and not matched
    await deleteApplicationLookups([{listName: "remedialAction", code: "02 trackOOS"}]);
    await addApplookupIfNotExist([{listName: "remedialAction", code: "02 trackOOS"}]);  // add track oos again so we get opt1
    }
};