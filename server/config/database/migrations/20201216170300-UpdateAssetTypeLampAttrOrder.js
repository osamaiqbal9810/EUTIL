let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");

module.exports = {
  async up() {
    // change in existing assetTypes collection
    console.log("UpdateAssetTypeLampAttrOrder: Add/remove attributes from track asset type");
    let criteria = { assetType: "track" };

    let assettypesToMod = await AssetsTypeModel.find(criteria);

    if (assettypesToMod && assettypesToMod[0]) {
      let dirty = false;
      if (assettypesToMod[0].lampAttributes && assettypesToMod[0].lampAttributes.length) {
        let item = assettypesToMod[0].lampAttributes.find((a) => {
          return a.name === "primaryTrack";
        });
        if (item) {
          item.required = false;
          dirty = true;
        }

        item = assettypesToMod[0].lampAttributes.find(a => {
          return a.name === "railOrientation" && a.order === 1;
        });
        if (item) {
            item.order = 2;
            dirty = true;
        }

        item = assettypesToMod[0].lampAttributes.find(a => {
          return a.name === "Local Track Name" && a.order === 2;
        });
        if (item) {
            item.order = 3;
            dirty = true;
        }
       
      }

      if (dirty) {
        assettypesToMod[0].markModified("lampAttributes");
        await assettypesToMod[0].save();
        console.log("Updated assetType track to adjust fields");
      }
    }
  },
};
