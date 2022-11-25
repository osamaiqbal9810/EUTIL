import testSchedulesModel from "../../../timps/api/testSchedules/testSchedules.model";
import _ from "lodash";
import { scimAppForms } from "../configurations/appForms/SITE_AppForms";
module.exports = {
  async up() {
    console.log("Update database: update GI305-B12 , GI305-B24 Description");
    let formsToUpdate = _.filter(scimAppForms, (form) => {
      return form.code == "formFicheB12" || form.code == "formFicheB24";
    });
    let countOfUpdate = 0;
    for (let f of formsToUpdate) {
      let allExistingForms = await testSchedulesModel.find({ testCode: f.code }).exec();
      for (let existingForm of allExistingForms) {
        existingForm.testDescription = f.description;
        await existingForm.save();
        countOfUpdate++;
      }
    }
    if (countOfUpdate) console.log("Updated " + countOfUpdate + " test forms description succesfully");
  },
  attributes: { applicationType: "SITE", customer: "Iron Ore Canada" },
};
