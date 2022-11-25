import _ from "lodash";
import { guid } from "../../../../utils/UUID";
import { FRASiteTests } from "../FRA_Crossing/CombinedForms";

export function checkerMethod(receivedDataList) {
  let combinedStored = [];
  let gradeCombined = [];
  let copyDataList = receivedDataList ? [...receivedDataList] : [];
  let filteredHighWayCrossing = _.remove(copyDataList, (list) => {
    return _.find(FRASiteTests, { code: list.testCode });
  });
  let gradeCrossingWarnings = _.remove(copyDataList, (list) => {
    return _.find(combinedGradeCrossingWarnings, { code: list.testCode });
  });
  if (filteredHighWayCrossing.length > 0) {
    combineObjs(
      copyDataList,
      combinedStored,
      filteredHighWayCrossing,
      "Highway Grade Crossing",
      {
        id: "hgcr",
        title: "Highway Grade Crossing Inspection",
      },
      "HighwayGradeCrossing",
    );
  }
  if (gradeCrossingWarnings.length > 0) {
    combineObjs(
      copyDataList,
      gradeCombined,
      gradeCrossingWarnings,
      "Grade Crossing Warning System Annual Test Report",
      {
        id: "gcwsatr",
        title: "Grade Crossing Warning System Annual Test Report",
      },
      "GradeCrossingWarningReport",
    );
  }

  let toReturnDataObj = {
    toReturnDataList: copyDataList,
    combinedStored: combinedStored,
    gradeCombined: gradeCombined,
  };
  return toReturnDataObj;
}

function combineObjs(dataList, arrayToPush, arrayList, tDescription, title, reportCode) {
  let groupByAsset = _.groupBy(arrayList, "assetId");
  let aIds = Object.keys(groupByAsset);
  for (let aId of aIds) {
    if (groupByAsset[aId] && groupByAsset[aId].length > 0) {
      let testCodes = [];
      for (let item of groupByAsset[aId]) {
        testCodes.push(item.testCode);
      }
      let obj = {
        id: guid(),
        assetId: aId,
        assetName: groupByAsset[aId][0].assetName,
        assetType: groupByAsset[aId][0].assetType,
        testDescription: tDescription,
        title: title,
        lineId: groupByAsset[aId][0].lineId,
        lineName: groupByAsset[aId][0].lineName,
        assetMP: groupByAsset[aId][0].assetMP,
        testCode: reportCode,
        testCodes: testCodes,
      };
      arrayToPush.push(obj);
      dataList.push(obj);
    }
  }
}
export const combineFRATests = [
  {
    code: "form234.249B12_M",
    interval: "M",
    device: "B12 Grounds",
    rule: ".249",
  },
  {
    code: "form234.249B_M",
    interval: "M",
    device: "B Grounds",
    rule: ".249",
  },
  {
    code: "form234.251B12_M",
    interval: "M",
    device: "B12 Standby power",
    rule: ".251",
  },
  {
    code: "form234.251B_M",
    interval: "M",
    device: "B Standby power",
    rule: ".251",
  },
  {
    code: "form234.253C_M",
    interval: "M",
    device: "All lamp unit Visibility",
    rule: ".253C",
  },
  {
    code: "form234.257A_M",
    interval: "M",
    device: "System Operation",
    rule: ".257A",
  },
  {
    code: "form234.257B_M",
    interval: "M",
    device: "Bell",
    rule: ".257B",
  },
  {
    code: "form234.271_Q",
    interval: "Q",
    device: "Ins. Joints,bonds,connections",
    rule: ".271",
  },
  {
    code: "form234.253A_Y",
    interval: "Y",
    device: "All Alignment & Flash Rate",
    rule: ".253A",
  },
  {
    code: "form234.253B_Y",
    interval: "Y",
    device: "All Lamp Voltage",
    rule: ".253B",
  },
  {
    code: "form234.259_Y",
    interval: "Y",
    device: "Warning time",
    rule: ".259",
  },
];

export const combinedGradeCrossingWarnings = [
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
];
