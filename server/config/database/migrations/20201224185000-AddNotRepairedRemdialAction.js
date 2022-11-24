import { addApplookupIfNotExist, updateApplicationLookups } from "../configurations/applicationlookupslist";

module.exports = {
    async up(){
     let notRepairedRACriterion={listName: "remedialAction", code: "03 notrepaired"};
     console.log('Update Script: Add Not Repaired Remedial Action');

    await updateApplicationLookups([{...notRepairedRACriterion, compare:"opt1"}]); // update opt1 if item alread exist and not matched
    await addApplookupIfNotExist([notRepairedRACriterion]);
    }
};