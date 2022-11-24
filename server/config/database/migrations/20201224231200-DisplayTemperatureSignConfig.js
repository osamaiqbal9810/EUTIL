import { updateIndividualConfigurations } from "../configurations/configurations";

module.exports = {
    async up(){
     console.log('Update Script: Update Config temperature sign');
     await updateIndividualConfigurations([{ listName: "config", code: "temperaturesign", compare: "opt1" }]);
    }
};