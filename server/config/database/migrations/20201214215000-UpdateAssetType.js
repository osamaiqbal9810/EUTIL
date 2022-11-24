let AssetsTypeModel = require("../../../api/assetTypes/assetTypes.model.js");

module.exports = {
  async up() {
    // change in existing assetTypes collection
    console.log("SetTrackAssetTypeAttributes: Add/remove attributes from track asset type");
    let criteria = { assetType: "track" };

    let assettypesToMod = await AssetsTypeModel.find(criteria);

    if (assettypesToMod && assettypesToMod[0]) {
      let dirty = false;
      if (assettypesToMod[0].lampAttributes && assettypesToMod[0].lampAttributes.length) {
        // Add lampAttribute prmaryTrack if not exist
        let e = assettypesToMod[0].lampAttributes.findIndex((a) => {
          return a.name === "primaryTrack";
        });
        if (e === -1) {
          assettypesToMod[0].lampAttributes.push({ name: "primaryTrack", type: 'boolean', order: 1 });
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
