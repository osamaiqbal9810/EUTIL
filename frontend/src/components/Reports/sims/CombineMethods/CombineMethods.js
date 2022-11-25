import _ from "lodash";
import { guid } from "../../../../utils/UUID";
import { combineCodesList } from "./CombineTests";

export const calculateCombineSets = (testSchedules) => {
  let combineSet = [];
  let copyDataList = testSchedules ? [...testSchedules] : [];

  for (let combinedFormsObj of combineCodesList) {
    let filtered = getFilteredByFormCodes(copyDataList, combinedFormsObj.combineCodes);
    let eachCombineSetScheds = [];
    if (filtered && filtered.length > 0) {
      combineObjs(
        copyDataList,
        eachCombineSetScheds,
        filtered,
        combinedFormsObj.testDescription,
        combinedFormsObj.title,
        combinedFormsObj.reportCode,
      );
      combineSet.push(eachCombineSetScheds);
    }
  }
  return { remainingTestScheds: copyDataList, combinedSet: combineSet };
};

function getFilteredByFormCodes(copyDataList, formCodes) {
  let filteredTestScheds = _.remove(copyDataList, (testSched) => {
    let toRem = formCodes.find((objCode) => objCode.code === testSched.testCode);
    return toRem;
  });
  return filteredTestScheds;
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
