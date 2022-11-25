let AssetsTypeModel = require("../../../../api/assetTypes/assetTypes.model.js");
let {septaDefectCodes} = require("../../configurations/DefectCodes/Septa");
module.exports = {
    async apply(){

        // change in existing assetTypes collection
        console.log('UpdateSeptaDefectCodesPatch: Update the existing defect codes for Septa.');
        let criteria = { defectCodesObj:{$ne: null} };
        let assetTypesCount = await AssetsTypeModel.countDocuments(criteria);

        if (assetTypesCount) {
            console.log(`UpdateSeptaDefectCodesPatch: Updating ${assetTypesCount} types.`);
            await AssetsTypeModel.updateMany(criteria, {$set:{defectCodesObj: septaDefectCodes}});
        }
    }
}