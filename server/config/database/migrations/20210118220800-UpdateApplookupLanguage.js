import { dynamicLanguageToDB } from "../../../dynamicLanguage/languageSeed";

module.exports = {
    async up(){
    console.log('Update database: updating langage seed');
       await dynamicLanguageToDB();
       console.log('Update database: langage seed updated');
    }
};