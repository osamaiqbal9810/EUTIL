import { addApplookupIfNotExist } from "../../configurations/applicationlookupslist";
import { fraFormGet } from "../../configurations/appForms/FRASite/FRAForms";
module.exports = {
  async apply() {
    console.log("FRA SITE test app form update");
    let testForms = fraFormGet();
    for (let form of testForms) {
      await addApplookupIfNotExist([{ listName: "appForms", code: form.code, compare: "opt1" }]);
    }
  },
};
