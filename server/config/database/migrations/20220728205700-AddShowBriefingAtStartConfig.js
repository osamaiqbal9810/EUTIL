import { addConfigurations } from "../configurations/configurations";

module.exports = {
    async up() {
        console.log("Update database: Adding configuration to show/hide Job Briefing at the start of inspection");
        await addConfigurations(true);
    },
};
