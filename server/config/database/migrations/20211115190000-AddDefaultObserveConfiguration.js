import { addConfigurations } from "../configurations/configurations";

module.exports = {
    async up() {
        console.log("Update database: Add configurations");
        await addConfigurations(true);
    },
};
