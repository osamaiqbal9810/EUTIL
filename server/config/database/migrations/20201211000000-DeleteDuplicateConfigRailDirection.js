
let ApplicationLookupsModel = require("../../../api/ApplicationLookups/ApplicationLookups.model");
import { countDocuments } from "../dbFunctions/dbHelperMethods";

module.exports={
    async up()
    {
        console.log('Update database: remove duplicate config apprail')
        await deleteDuplicateApplookup({listName:'config', code:'appraildirection'});
    }
}

async function deleteDuplicateApplookup(criteria)
{
    let count = await countDocuments(ApplicationLookupsModel, criteria);

        if(count>1)
        {
            let items = await ApplicationLookupsModel.find(criteria).exec();
            let count = items.length;
            let index=0;
            while(count>1)
            {
                let id = items[index++]._id;
                console.log('RemoveDuplicateConfigUpdateScript: deleting duplicate', id.toString());
                await ApplicationLookupsModel.deleteOne({_id: id});
                count--;
            }
        }
}