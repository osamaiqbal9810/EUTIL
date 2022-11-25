import ApplicationLookupsModel from "../../../../api/ApplicationLookups/ApplicationLookups.model";
import { genericFormEntry } from "../../configurations/appForms/General/genericEquipmentReplacementForm";
import { addIfNotExist } from "../../dbFunctions/dbHelperMethods";

module.exports = {
  async apply() {
    console.log("Add SFRTA Site Generic Equipment Form.");
    let allEquipmentTypes = await ApplicationLookupsModel.find({ listName: "assetEquipmentTypes" });
    let requiredTypes = allEquipmentTypes.filter((et) => {
      return (
        et &&
        et.opt1 &&
        et.opt1.schema &&
        et.opt1.schema.find((a) => {
          return a.id === "PartNumber" || a.id === "SerialNumber";
        })
      );
    });
    let typeNames = requiredTypes.map((rt) => {
      return rt.description;
    });
    console.log(`Total equipment types: ${allEquipmentTypes.length}, Added for this form: ${requiredTypes.length}`);
    genericFormEntry.opt2.allowedEquipmentTypes = typeNames;
    await addIfNotExist(ApplicationLookupsModel, { listName: genericFormEntry.listName, code: genericFormEntry.code }, genericFormEntry);
  },
};