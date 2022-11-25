import { addConfigurations } from "../configurations/configurations";

module.exports = {
    async up() {
        console.log("Update database: Adding configuration to use custom Job Briefing module in app");
        await addConfigurations(true);
    },
};
