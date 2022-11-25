import { addConfigurations } from "../configurations/configurations";
module.exports = {
  async up() {
    console.log("Add rule 213b config");
    await addConfigurations(true);
  },
};
