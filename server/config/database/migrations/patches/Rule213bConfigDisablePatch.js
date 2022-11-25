import ApplicationLookupsModel from "../../../../api/ApplicationLookups/ApplicationLookups.model";

module.exports = {
  async apply() {
    console.log("Patch: to disable rule 213b");
    let disableRule213 = await ApplicationLookupsModel.findOne({ listName: "config", code: "disableRule213" });
    if (disableRule213) {
      disableRule213.opt2 = true;
      await disableRule213.save();
    } else throw "Can not find config for disabling/enabling rule 213b";
  },
};
