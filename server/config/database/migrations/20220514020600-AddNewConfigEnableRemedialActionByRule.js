import { addConfigurations } from "../configurations/configurations";

module.exports = {
    async up() {
        console.log("Update database: Add configuration of Remedial action enable/disable by Rule 213");
        await addConfigurations(true);
    },
};
