import AssetsTypeModel from "../../../../api/assetTypes/assetTypes.model";
module.exports = {
  async apply() {
    console.log("Patch: Make Marker Start field to optional.");

    let typesWithMarkerField = await AssetsTypeModel.find({"lampAttributes.name":"Marker Start"}).exec();

    if (typesWithMarkerField && typesWithMarkerField.length > 0) {
      for (let type of typesWithMarkerField) {
        for(let la of type.lampAttributes) {
            if(la.name==="Marker Start")
                la.required = false;
        }
        type.markModified("lampAttributes");
        await type.save();
      }
    }
  },
};
