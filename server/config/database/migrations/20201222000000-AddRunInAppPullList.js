
import { addApplookupIfNotExist } from "../configurations/applicationlookupslist";

module.exports = { async up() {
    console.log("Update Script: Add RUN in app pull list");
    await addApplookupIfNotExist([{listName:"AppPullList", code:"26"}]);
}
}