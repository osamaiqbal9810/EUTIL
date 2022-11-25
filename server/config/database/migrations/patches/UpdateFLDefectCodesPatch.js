let AssetsTypeModel = require("../../../../api/assetTypes/assetTypes.model.js");
let {fingerLakesDefectCodes} = require("../../configurations/DefectCodes/FingerLakes");
module.exports = {
    async apply(){

        // change in existing assetTypes collection
        console.log('UpdateFLDefectCodesPatch: Update the existing defect codes for Fingerlakes.');
        let criteria = { defectCodesObj:{$ne: null} };
        let assetTypesCount = await AssetsTypeModel.countDocuments(criteria);

        if (assetTypesCount) {
            console.log(`UpdateFLDefectCodesPatch: Updating ${assetTypesCount} types.`);
            await AssetsTypeModel.updateMany(criteria, {$set:{defectCodesObj: fingerLakesDefectCodes}});
        }
    }
}