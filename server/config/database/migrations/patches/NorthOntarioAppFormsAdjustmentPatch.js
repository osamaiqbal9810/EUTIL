import { updateApplicationLookups, addApplookupIfNotExist } from "../../configurations/applicationlookupslist";
module.exports = {
  async apply() {
    console.log("North Ontario AppForm adjustments");
    await addApplookupIfNotExist([
      { listName: "appForms", code: "fixedInspectionForm1" },
      { listName: "appForms", code: "fixedInspectionForm2" },
      { listName: "appForms", code: "fixedInspectionForm3" },
    ]);
    await updateApplicationLookups([
      { listName: "appForms", code: "formGI303", compare: "opt2" },
      { listName: "appForms", code: "formFicheB12B24", compare: "opt2" },
      { listName: "appForms", code: "formFicheB12", compare: "opt2" },
      { listName: "appForms", code: "formFicheB24", compare: "opt2" },
      { listName: "appForms", code: "gi329fa", compare: "opt2" },
      { listName: "appForms", code: "gi329fb", compare: "opt2" },
      { listName: "appForms", code: "gi329fc", compare: "opt2" },
      { listName: "appForms", code: "gi329fd", compare: "opt2" },
      { listName: "appForms", code: "gi313f", compare: "opt2" },
      { listName: "appForms", code: "gi334f", compare: "opt2" },
      { listName: "appForms", code: "scp901f", compare: "opt2" },
      { listName: "appForms", code: "scp902f", compare: "opt2" },
      { listName: "appForms", code: "scp907f", compare: "opt2" },
      { listName: "appForms", code: "suivimargingi335", compare: "opt2" },
    ]);
  },
};
