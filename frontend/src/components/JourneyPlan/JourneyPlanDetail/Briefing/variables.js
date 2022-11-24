/* eslint eqeqeq: 0 */
import {languageService} from "../../../../Language/language.service";

// const BRIFING_CATEGORIES = {
//     dateTime: {
//         title: 'Date & Time',
//         labelText: '',
//         type: 'text',
//         value: ''
//     },
//     qPE: {
//         title: 'Qualified Protection Employee (QPE)',
//         labelText: 'Qualified Protection Employee (QPE) in charge of providing on-track protection: ',
//         type: 'text',
//         value: ''
//     },
//     dateOfqPE: {
//         title: 'Date of Qualification Card',
//         labelText: 'Confirm Current Qualification: (Date on Qualification Card): ',
//         type: 'text',
//         value: ''
//     },
//     workLocation: {
//         title: 'Work Location',
//         labelText: 'On what Line and track(s) will the Roadway Worker protection be required? ',
//         type: 'text',
//         value: ''
//     },
//     trackMaxSpeed: {
//         title: 'Track Max Speed',
//         labelText: 'Track maximum Authorized Speed (MAS): ',
//         type: 'text',
//         value: ''
//     },
//     typeOfProtection: {
//         title: 'Type of Protection',
//         labelText: 'What form of Protection will be used?  ',
//         type: 'checkBoxOptions',
//         value: '',
//         options: [
//             'ITD',
//             'Foul Time',
//             'TAW',
//             'Work Zone',
//             'OOS'
//         ]
//     },
//     itdProtectionTime: {
//         title: 'Individual Train Detection',
//         labelText: 'Individual Train Detection(ITD), you must be a QPE. What time has the Train Dispatcher been notified of your intention to use ITD as protection',
//         type: 'text',
//         value: '',
//     }
// };

export const TYPE_OF_PROTECTION = {
    ITD: 'ITD',
    FOUL_TIME: 'Foul Time',
    TAW: 'TAW',
    WORK_ZONE: 'Work Zone',
    OOS: 'OOS'
};

export const BRIEFING_TABS = {
    BRIEFING: languageService('briefing'),
    WORKERS: languageService('workers'),
    COMMENTS: languageService('comments')
};
