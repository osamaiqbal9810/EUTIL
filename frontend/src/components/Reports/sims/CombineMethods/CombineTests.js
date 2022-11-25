import { FRASiteTests } from "../FRA_Crossing/CombinedForms";

const SITE_Grade_Crossing = {
  testDescription: "Highway Grade Crossing",
  title: {
    _id: "gcwsatr",
    title: "Grade Crossing Warning System Annual Test Report",
  },
  reportCode: "HighwayGradeCrossing",
  combineCodes: FRASiteTests,
};

const FRA_Grade_Crossing = {
  testDescription: "Grade Crossing Warning System Annual Test Report",
  title: {
    _id: "hgcr",
    title: "Highway Grade Crossing Inspection",
  },
  reportCode: "GradeCrossingWarningReport",

  combineCodes: [
    { code: "grade_1001b1" },
    { code: "grade_303" },
    { code: "grade_201" },
    { code: "grade_202" },
    { code: "grade_203" },
    { code: "grade_1001(b)2" },
    { code: "grade_1001(b)3" },
    { code: "grade_1001(b)4" },
    { code: "grade_1001(b)5" },
    { code: "grade_1001(b)6" },
    { code: "grade_1001(b)7" },
    { code: "grade_1001(b)8" },
    { code: "grade_801" },
    { code: "grade_703" },
    { code: "grade_1001(c)1" },
    { code: "grade_401(a)" },
    { code: "grade_701" },
    { code: "grade_1001(d)1" },
    { code: "grade_1001(d)2" },
    { code: "grade_1001(e)1" },
    { code: "grade_1001(e)2" },
    { code: "grade_1001(e)3" },
    { code: "grade_702" },
    { code: "grade_1001(e)4" },
    { code: "grade_1001(e)5" },
    { code: "grade_1001(e)6" },
    { code: "grade_1001(e)7" },
    { code: "grade_1001(e)8" },
    { code: "grade_402" },
    { code: "grade_901" },
    { code: "grade_1101" },
    { code: "grade_1001(e)9" },
  ],
};

const SFRTASwitchMonthlyReport = {
  testDescription: "Switch Monthly Tests",
  title: {
    _id: "sfrtasMTests",
    title: "Switch Monthly Tests",
  },
  reportCode: "sfrtaSwitchMTests",
  combineCodes: [{ code: "sfrtaSwitchLockRodNormal" }, { code: "sfrtaSwitchLockRodReverse" }],
};
const SFRTASwitchQuarterReport = {
  testDescription: "Switch Quarter Tests",
  title: {
    _id: "sfrtasQTests",
    title: "Switch Quarter Tests",
  },
  reportCode: "sfrtaSwitchQTests",
  combineCodes: [
    { code: "sfrtaSwitchcircuitControllerNormal" },
    { code: "sfrtaSwitchcircuitControllerReverse" },
    { code: "sfrtaSwitchshuntFouling" },
  ],
};
const SFRTAInterlockingReport = {
  testDescription: "Locking Tests & Inspections",
  title: {
    _id: "sfrtaLockingTests",
    title: "Locking Tests & Inspections",
  },
  reportCode: "sfrtaInterLockingTests",
  combineCodes: [
    { code: "sfrtaMechanical236_376" },
    { code: "sfrtaApproach236_377" },
    { code: "sfrtaTime236_378" },
    { code: "sfrtaRoute236_379" },
    { code: "sfrtaIndication236_380" },
    { code: "sfrtaTraffic236_381" },
  ],
};
const SFRTAHotBoxDefectDetectorReport = {
  testDescription: "Hot Box Defect Detector Tests",
  title: {
    _id: "sfrtaHotBoxDefectTests",
    title: "Hot Box Defect Detector Tests",
  },
  reportCode: "sfrtaHotBoxDefectDetectorTests",
  combineCodes: [{ code: "sfrtaHotBox30Days" }, { code: "sfrtaHotBox90Days" }, { code: "sfrtaDraggingEquip30Days" }],
};

export const combineCodesList = [
  SITE_Grade_Crossing,
  FRA_Grade_Crossing,
  SFRTASwitchMonthlyReport,
  SFRTASwitchQuarterReport,
  SFRTAInterlockingReport,
  SFRTAHotBoxDefectDetectorReport,
];
