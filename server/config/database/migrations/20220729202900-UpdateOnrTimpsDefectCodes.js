let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");
let {onrDefectCodes} = require("../configurations/DefectCodes/ONR_Defect_Codes");
module.exports = {
    async up(){

        // change in existing assetTypes collection
        console.log('UpdateFLDefectCodesPatch: Update the existing defect codes for ONR Timps.');
        let criteria = { defectCodesObj:{$ne: null} };
        let assetTypesCount = await AssetsTypeModel.countDocuments(criteria);

        if (assetTypesCount) {
            console.log(`UpdateFLDefectCodesPatch: Updating ${assetTypesCount} types.`);
            await AssetsTypeModel.updateMany(criteria, {$set:{defectCodesObj: onrDefectCodes}});
        }
    },
    attributes: { customer: "Ontario Northland", applicationType: "TIMPS" },
}