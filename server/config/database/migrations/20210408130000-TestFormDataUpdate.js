import { guid } from "../../../utilities/UUID";
import AssetTestsService from "../../../api/AssetTests/assetTests.service";
let ApplicationLookupModel = require("../../../api/ApplicationLookups/ApplicationLookups.model");

module.exports = {
  async up() {
    console.log("Updating Test Forms data for new scheduling logic");
    try {
      let assetTestsService = new AssetTestsService();

      let appForms = await ApplicationLookupModel.find({
        listName: "appForms",
        "opt2.config": { $exists: true },
        "opt2.config.id": null,
      }).exec();
      let formsUpdated = [];
      if (appForms && appForms.length > 0) {
        for (let form of appForms) {
          if (form.opt2 && form.opt2.config && form.opt2.config.length > 0) {
            for (let assetTestForm of form.opt2.config) {
              if (!assetTestForm.id) {
                assetTestForm.id = guid();
                form.markModified("opt2");
                let savedForm = await form.save();
                await assetTestsService.createTestProcess(assetTestForm, savedForm);
                formsUpdated.push(form);
              }
            }
          }
        }
      }
      for (let fup of formsUpdated) {
        console.log("Form : " + fup.description + " updated and test template created");
      }
    } catch (err) {
      console.log("err in TestFormDataUpdate migration : ", err);
    }
  },
};
