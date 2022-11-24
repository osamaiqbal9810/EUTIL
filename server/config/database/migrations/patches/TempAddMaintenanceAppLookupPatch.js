import { addApplookupIfNotExist, updateApplicationLookups } from "../../configurations/applicationlookupslist";

module.exports = {
    async apply(){
    console.log('TempAddMaintnanceAppLookup patch');
    await addApplookupIfNotExist([
        { listName: "AppPullList", code: "apl-27" }]);   
  
   // if exist then update once
        await updateApplicationLookups([
          { listName: "AppPullList", code: "apl-27", compare: "op1" }
      ]);
  
      }

    

  
};

