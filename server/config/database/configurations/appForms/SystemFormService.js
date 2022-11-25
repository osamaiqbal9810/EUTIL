import { timpsAppForms } from "./TIMPS_AppForms";
import { scimAppForms } from "./SITE_AppForms";
import { briefingAppForms } from "./JobBriefing_AppForms";
export default class SystemFormService {
  async getSystemAppForms() {
    let resultObj = {};
    try {
      let timpsFormList = formListCreater(timpsAppForms);
      let siteFormList = formListCreater(scimAppForms);
      let briefingFormList = formListCreater(briefingAppForms);
      let cat1 = formCategory("Timps Forms", timpsFormList);
      let cat2 = formCategory("SITE Forms", siteFormList);
      let cat3 = formCategory("Job Briefing Forms", briefingFormList);
      resultObj.value = [cat1, cat2, cat3];
      resultObj.status = 200;
    } catch (err) {
      console.log("error in : getSystemAppForms ", err);
      resultObj.erroVal = err;
      resultObj.status = 500;
    }
    return resultObj;
  }
}

function formCategory(catName, catForms) {
  return { name: catName, forms: catForms };
}

function formListCreater(formList) {
  if (formList && formList.length > 0) {
    let toRet = formList.map((form) => {
      return { code: form.code, description: form.description /*opt2: form.opt2*/ };
    });
    return toRet;
  } else return [];
}
