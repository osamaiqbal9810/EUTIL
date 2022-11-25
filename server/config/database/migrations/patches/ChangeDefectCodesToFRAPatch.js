let AssetsTypeModel = require("../../../../api/assetTypes/assetTypes.model.js");
let {defectCodes} = require("../../defectCodes");
module.exports = {
    async apply(){
       
       // change in existing assetTypes collection
       console.log('ChangeDefectCodesToFRAPatch: Change asset types with defectCodesObj to FRA defect codes.');
        let criteria = { defectCodesObj:{$ne: null} };
        let assettypesCount = await AssetsTypeModel.countDocuments(criteria);

        if (assettypesCount) {
            console.log(`ChangeDefectCodesToFRAPatch: Changing ${assettypesCount} types.`);
            await AssetsTypeModel.updateMany(criteria, {$set:{defectCodesObj: defectCodes}});
        }
}
}