import { updateApplicationLookups } from "../configurations/applicationlookupslist";
let ApplicationLookUpModel = require("../../../api/ApplicationLookups/ApplicationLookups.model");

module.exports = {
  async up() {
    console.log("Update Script: GI Forms Completion field added for SCIM application.");
    await updateApplicationLookups([
      { listName: "appForms", code: "formGI303", compare: "opt1" },
      { listName: "appForms", code: "formGI303", compare: "description" },
      { listName: "appForms", code: "formFicheB12B24", compare: "opt1" },
      { listName: "appForms", code: "formFicheB12B24", compare: "description" },
      { listName: "appForms", code: "formFicheB12", compare: "opt1" },
      { listName: "appForms", code: "formFicheB12", compare: "opt2" },
      { listName: "appForms", code: "formFicheB12", compare: "description" },
      { listName: "appForms", code: "formFicheB24", compare: "opt1" },
      { listName: "appForms", code: "formFicheB24", compare: "description" },
      { listName: "appForms", code: "gi329fa", compare: "opt1" },
      { listName: "appForms", code: "gi329fb", compare: "opt1" },
      { listName: "appForms", code: "gi329fc", compare: "opt1" },
      { listName: "appForms", code: "gi329fd", compare: "opt1" },
      { listName: "appForms", code: "gi313f", compare: "opt1" },
      { listName: "appForms", code: "gi334f", compare: "opt1" },
      { listName: "appForms", code: "scp901f", compare: "opt1" },
      { listName: "appForms", code: "scp902f", compare: "opt1" },
      { listName: "appForms", code: "scp907f", compare: "opt1" },
      { listName: "appForms", code: "suivimargingi335", compare: "opt1" },
    ]);
    // let formB12 = await ApplicationLookUpModel.findOne({ listNme: "appForms", code: "formFicheB12" }).exec();
    // if(formB12){
    //   formB12.
    // }
  },
  attributes:{applicationType: "SITE", customer: "Iron Ore Canada"},
};
