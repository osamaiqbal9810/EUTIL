import assetTestModel from "../../../../api/AssetTests/assetTests.model";

import _ from "lodash";
module.exports = {
  async apply() {
    console.log("Patch for cleaning database for multiple asset test entries during development");
    let assetTests = await assetTestModel.find().exec();
    if (assetTests) {
      let groupByTestAndAsset = _.groupBy(assetTests, "assetId");
      let keys = Objec.keys(groupByTestAndAsset);
      for (let aId of keys) {
        let testGroups = _.groupBy(groupByTestAndAsset[aId], "testCode");
        let testKeys = Object.keys(testGroups);
        for (let testKey of testKeys) {
          let lengthToMatter = testGroups[testKey].length;
          if (lengthToMatter > 0) {
            for (let i = 1; i < lengthToMatter - 1; i++) {
              console.log("asset Test Code ", testKey, " and assetId : ", aId, " is duplicated and will be removed");
            }
          }
        }
      }
    }
    // let appForms = await ApplicationLookupsModel.find({ "opt2.config": { $exists: true } }).exec();
    // if(appForms){
    //     for(let appForm of appForms){

    //     }
    // }
  },
};
