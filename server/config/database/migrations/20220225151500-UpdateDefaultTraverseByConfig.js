import {updateIndividualConfigurations} from "../configurations/configurations";

module.exports = {
    async up(){
        console.log('Update database: updated configs of Default TraverseBy');
        await updateIndividualConfigurations([
            { listName: "config", code:"traversby", compare:"opt1"}
        ]);
    }
};