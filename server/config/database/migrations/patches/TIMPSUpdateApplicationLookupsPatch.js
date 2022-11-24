import { deleteApplicationLookups, addApplookupIfNotExist } from "../../configurations/applicationlookupslist";
import { updateIndividualConfigurations } from "../../configurations/configurations";

module.exports = {
  async apply() {
    console.log("Patch: Add/Remove required for TIMPS application.");

    await deleteApplicationLookups([
      { listName: "appForms", code: "formGI303" },
      { listName: "appForms", code: "formFicheB12B24" },
      { listName: "appForms", code: "formFicheB12" },
      { listName: "appForms", code: "formFicheB24" },
      { listName: "appForms", code: "gi329f" },
      { listName: "appForms", code: "gi329fa" },
      { listName: "appForms", code: "gi329fb" },
      { listName: "appForms", code: "gi329fc" },
      { listName: "appForms", code: "gi329fd" },
      { listName: "appForms", code: "gi334f" },
      { listName: "appForms", code: "gi313f" },
      { listName: "appForms", code: "scp901f" },
      { listName: "appForms", code: "scp902f" },
      { listName: "appForms", code: "scp907f" },
      { listName: "appForms", code: "suivimargingi335" },
    ]);

    await addApplookupIfNotExist([
      { listName: "appForms", code: "frmSwitchInspection" },
      { listName: "appForms", code: "form1" },
      { listName: "appForms", code: "form2" },
      { listName: "appForms", code: "frmMonthlySI4QNS" },
      { listName: "appForms", code: "frmAnnualSI4QNS" },
    ]);

    await updateIndividualConfigurations([
      { listName: "config", code: "issueResolveRemedialAction", compare: "opt2" },
      { listName: "config", code: "temperaturesign", compare: "opt1" },
    ]);
  },
};
