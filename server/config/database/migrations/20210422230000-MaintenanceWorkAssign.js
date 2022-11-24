import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";

module.exports = {
  async up() {
    console.log("Update database: update application lookups for maintenance work assign");
    await addApplookupIfNotExist([{ listName: "mWorkAssign", code: "mWOrkAssign" }]);
  },
};
