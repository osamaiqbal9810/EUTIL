let AssetsTypeModel = require("../../../../api/assetTypes/assetTypes.model.js");

module.exports = {
    async apply(){
       
       // change in existing assetTypes collection
       console.log('SetTrackAssetTypeAttributes: Add/remove attributes from track asset type')
        let criteria = { assetType: "track" };
        let assettypesToMod = await AssetsTypeModel.find(criteria);

        if (assettypesToMod && assettypesToMod[0]) {
            let dirty = false;
            if (assettypesToMod[0].lampAttributes && assettypesToMod[0].lampAttributes.length) {
            // remove lampAttribute trackType if exist
            let e = assettypesToMod[0].lampAttributes.findIndex(a => {
                return a.name === "trackType";
            });
            if (e > -1) {
                assettypesToMod[0].lampAttributes.splice(e, 1);
                dirty = true;
            }
            
            // remove lampAttribute class if exist
            e = assettypesToMod[0].lampAttributes.findIndex(a => {
                return a.name === "class";
            });
            if (e > -1) {
                assettypesToMod[0].lampAttributes.splice(e, 1);
                dirty = true;
            }

            // Add lampAttribute railOrientation if not exist
            e = assettypesToMod[0].lampAttributes.findIndex(a => {
                return a.name === "railOrientation";
            });
            if (e === -1) {
                assettypesToMod[0].lampAttributes.push({ name: "railOrientation", order: 1 });
                dirty = true;
            }

            // change the name of trackNumber to Local Track Name
            let item = assettypesToMod[0].lampAttributes.find(a => {
                return a.name === "trackNumber";
            });
            if (item) {
                item.name = "Local Track Name";
                item.order = 2;
                dirty = true;
            }

            // change the order of Local Track Name
            item = assettypesToMod[0].lampAttributes.find(a => {
                return a.name === "Local Track Name" && a.order === 1;
            });
            if (item) {
                item.order = 2;
                dirty = true;
            }
            }
  
            if (dirty) {
            assettypesToMod[0].markModified("lampAttributes");
            await assettypesToMod[0].save();
            console.log("Updated assetType track to adjust fields");
            }
        }

    }
};