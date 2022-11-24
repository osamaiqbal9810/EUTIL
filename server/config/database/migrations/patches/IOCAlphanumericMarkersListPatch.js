import { addApplookupIfNotExist } from "../../configurations/applicationlookupslist";

module.exports = {
    async apply(){
     console.log('Patch: Add alphanumeric markers list for IOC.');
        await addApplookupIfNotExist([{listName : "alphaNumericMilepostIOC", code : "alphaNumericMilepostIOC"}]);         
    }
};
