//ONR
import { ONR_JobBriefing } from "./ONR_Forms/JobBriefiing/JobBreifing";
import { ONR_LoneWorkerBriefing } from "./ONR_Forms/JobBriefiing/LoneWorkerBriefingForm";
import { ONR_SafetyWatchBriefing } from "./ONR_Forms/JobBriefiing/SafetyWatchForm";
//SFRTA
import { trackAndTimeForm } from "./SFRTA/JobBriefing/trackAndTime";
import { safetyBriefingForm } from "./SFRTA/JobBriefing/safetyBriefing";
import { safetyChecklistForm } from "./SFRTA/JobBriefing/safetyChecklist";
import { formOForm } from "./SFRTA/JobBriefing/formO";

export const briefingAppForms = [
  safetyBriefingForm,
  safetyChecklistForm,
  trackAndTimeForm,
  formOForm,
  ONR_JobBriefing,
  ONR_LoneWorkerBriefing,
  ONR_SafetyWatchBriefing,
];
