import { addConfigurations } from "../configurations/configurations";
module.exports = {
  async up() {
    console.log("Add production start date config");
    await addConfigurations(true);
  },
};
