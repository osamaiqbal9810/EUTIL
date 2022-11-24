import AssetsModel from "../assets/assets.modal";
import AssetTestModel from "./assetTests.model";
let ServiceLocator = require("../../framework/servicelocator");
import _ from "lodash";
import { getEndTimePeriod, getNextTimePeriod } from "../../service/SchedulerService";
import momentTz from "moment-timezone";
import moment from "moment";
class AssetTestsService {
  async linkAssetTest(testForm, prevTestForm) {
    if (this.validateTestFormForAssetLink(testForm)) {
      let aTypesTests = testForm.opt2.config;
      let prevTests = prevTestForm && prevTestForm.opt2 && prevTestForm.opt2.config;
      let lengthAtypeTests = aTypesTests.length;

      if (this.checkIfRemoved(aTypesTests, prevTests)) {
        let lastTest = prevTests[prevTests.length - 1];
        await this.removeProcess(lastTest.assetType, prevTestForm.code);
      } else if (this.checkIfNewTestLink(aTypesTests, prevTests)) {
        let newTest = aTypesTests[lengthAtypeTests - 1];
        let assetCrit = { assetType: newTest.assetType, isRemoved: false };
        await this.createTestProcess(newTest, testForm, assetCrit);
      } else {
        for (let i = 0; i < lengthAtypeTests; i++) {
          if (this.checkIfUpdateRequire(aTypesTests[i], prevTests[i])) {
            let assetCrit = { assetType: aTypesTests[i].assetType, isRemoved: false };
            await this.createTestProcess(aTypesTests[i], testForm, assetCrit);
          }
        }
      }
    }
  }
  validateTestFormForAssetLink(testForm) {
    let valid = false;
    if (testForm && testForm.opt2 && testForm.opt2.config) {
      valid = true;
    }
    return valid;
  }
  checkIfUpdateRequire(newTest, prevTest) {
    let testValid = newTest && prevTest;
    if (testValid) {
      let idMatch = newTest.id == prevTest.id;
      // let freqObjEqual = _.isEqual(newTest.inspectionFrequencies, prevTest.inspectionFrequencies);
      // let startDateSame = newTest.inspectionFreq.startDate == prevTest.inspectionFreq.startDate;
      let changeInObject = _.isEqual(newTest, prevTest);
      return idMatch && !changeInObject;
    } else return false;
  }
  checkIfRemoved(newTest, prevTest) {
    return prevTest && newTest.length < prevTest.length;
  }
  checkIfNewTestLink(newTest, prevTest) {
    return prevTest && newTest.length > prevTest.length;
  }

  async removeProcess(aType, testCode) {
    try {
      await AssetTestModel.updateMany({ assetType: aType, testCode: testCode }, { $set: { isRemoved: true } });
      let methodCriterias = {
        aType: aType,
      };
      await this.updateTestOnTemplateUnits(methodCriterias, testCode, "remove");
    } catch (err) {
      console.log(err);
    }
  }
  async createTestProcess(testObject, testForm, assetsCriteria) {
    try {
      let allAssetsOfAssetType = await AssetsModel.find(assetsCriteria).exec();
      let timezoneMethodService = ServiceLocator.resolve("timezoneMethodService");
      let scheduleService = ServiceLocator.resolve("scheduleService");
      let testScheduleObserverService = ServiceLocator.resolve("TestScheduleObserverService");
      let locationAssets = {};
      let testObjectsForTemplates = {};
      let linearCheck = testForm.opt2 && testForm.opt2.classify == "linear" ? true : false;
      if (allAssetsOfAssetType) {
        for (let asset of allAssetsOfAssetType) {
          let testObj = initialTestObject(asset, testForm, testObject, linearCheck);
          let locationAsset = await fillLocationAssetOfInspectionAssets(locationAssets, asset);
          let adjustDate = adjustDateToStartOfLocation(locationAsset, testObj.inspectionFrequencies.startDate);
          let locationTimezone = locationAsset && locationAsset.attributes && locationAsset.attributes.timezone;
          let execs = await scheduleExecutionOfTest(
            testObj,
            locationTimezone,
            adjustDate,
            scheduleService,
            timezoneMethodService,
            testScheduleObserverService,
            locationTimezone,
          );
          testObj.inspectionFrequencies = { ...testObject.inspectionFreq };
          testObj.timezone = locationTimezone;
          checkIfDateValuesToUpdate(testObj);
          let testExist = await AssetTestModel.findOne({ assetId: asset.id, testCode: testForm.code }).exec();
          if (!testExist) {
            await createNewAssetTest(testObj, asset, execs, testScheduleObserverService);
          } else {
            await updateAssetTest(testExist, testObj, testForm, asset, adjustDate, execs, testScheduleObserverService);
          }
          testObjectsForTemplates[asset.id] = testObj;
        }
        let methodCriterias = {
          aType: testObject.assetType,
        };
        await this.updateTestOnTemplateUnits(methodCriterias, testForm.code, "addUpdate", testObjectsForTemplates);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async updateTestOnTemplateUnits(methodCriteriasReceived, testCode, method, testObjectsForTemplates) {
    let methodCriterias = {
      aType: methodCriteriasReceived && methodCriteriasReceived.aType,
      assetId: methodCriteriasReceived && methodCriteriasReceived.assetId,
    };
    let workPlanModal = ServiceLocator.resolve("WorkPlanTemplateModel");
    let basicCriteria = { isRemoved: false };
    if (methodCriterias.assetId) {
      basicCriteria = { ...basicCriteria, "tasks.units.id": methodCriterias.assetId };
    }
    let templates = await workPlanModal.find(basicCriteria).exec();

    for (let plan of templates) {
      for (let task of plan.tasks) {
        for (let unit of task.units) {
          let aTypeCondition = methodCriterias.aType ? methodCriterias.aType == unit.assetType : true;
          let assetIdCondition = methodCriterias.assetId ? methodCriterias.assetId == unit.id : true;
          if (aTypeCondition && assetIdCondition) {
            if (method == "remove") {
              _.remove(unit.testForm, (t) => {
                return t.testCode == testCode;
              });
            } else if (method == "addUpdate") {
              !unit.testForm && (unit.testForm = []);
              let newObject = testObjectsForTemplates[unit.id];
              if (newObject) {
                let objIndex = _.findIndex(unit.testForm, { testCode: testCode });
                let obj = checkForMomentObjects({ ...newObject, assetId: unit.id });
                delete obj.inspectionFrequencies;
                if (objIndex > -1) {
                  unit.testForm[objIndex] = obj;
                } else {
                  unit.testForm.push(obj);
                }
              }
            }
          }
        }
      }
      plan.markModified("tasks");

      await plan.save();
    }
  }

  async findAssetTests(assetId) {
    let resultObj = {};
    try {
      let criteria = { assetId: assetId, isRemoved: false };
      let assetTests = await AssetTestModel.find(criteria).exec();
      resultObj = { value: assetTests, status: 200 };
    } catch (error) {
      resultObj = { errorVal: error, status: 500 };
      console.log(error);
    }
    return resultObj;
  }
  async getAssetTests(assetId) {
    let assetTests = [];
    try {
      let criteria = { assetId: assetId, isRemoved: false };
      assetTests = await AssetTestModel.find(criteria).exec();
    } catch (err) {
      console.log(err);
    }
    return assetTests;
  }

  assetTestObjectForTemplate(assetTests) {
    let tests = [];
    for (let assetTest of assetTests) {
      let testObject = this.assetTestObj(assetTest);
      tests.push(testObject);
    }
    return tests;
  }
  assetTestObj(assetTest) {
    let testObjForTemplate = {
      title: assetTest.title,
      startDate: assetTest.startDate,
      assetType: assetTest.assetType,
      testCode: assetTest.testCode,
      nextDueDate: assetTest.nextDueDate,
      testId: assetTest.testId,
      assetId: assetTest.assetId,
      nextExpiryDate: assetTest.nextExpiryDate,
      currentPeriodStart: assetTest.currentPeriodStart,
      currentPeriodEnd: assetTest.currentPeriodEnd,
      completion: assetTest.completion,
    };
    assetTest && assetTest.linearProps && (testObjForTemplate.linearProps = assetTest.linearProps);
    return testObjForTemplate;
  }
}

export default AssetTestsService;

export function adjustDateToStartOfLocation(lineAsset, dateString) {
  let sDate = dateString;
  if (lineAsset && lineAsset.attributes && lineAsset.attributes.timezone) {
    let timezone = lineAsset.attributes.timezone;
    if (momentTz.tz.zone(timezone)) {
      sDate = moment.tz(dateString.slice(0, 10), timezone).toDate();
    } else {
      console.log("could not found timezone id", timezone);
    }
  } else {
    console.log("adjustDateToStartOfLocation: Warning: Time zone information not available for", lineAsset.unitId);
  }
  return sDate;
}

function checkForMomentObjects(object) {
  let keys = Object.keys(object);
  if (keys && keys.length > 0) {
    for (let key of keys) {
      if (moment.isMoment(object[key])) object[key] = object[key].toDate();
    }
  }
  return object;
}
export function checkToIgnoreTestSchedule(form) {
  let toIgnore = true;
  if (form.completed == true) {
    toIgnore = false;
  }
  return toIgnore;
}
export function checkCompletedForFixedTestSchedule(form) {
  let completed = false;
  if (form.form && form.form.length > 0) {
    let OuiIndex = _.findIndex(form.form, (field) => {
      return field.id == "yes" || field.id == "inspected" || field.tag == "completionCheck";
    });
    if (OuiIndex > -1) {
      completed = form.form[OuiIndex].value == "true" || form.form[OuiIndex].value == true ? true : false;
    }
  }
  return completed;
}

function initialTestObject(asset, testForm, testObject, linearCheck) {
  let linearFields = {};
  if (linearCheck) {
    testObject.inspectionType && (linearFields.linearProps = { inspectionType: testObject.inspectionType });
  }
  return {
    inspectionFrequencies: { ...testObject.inspectionFreq },
    startDate: testObject.inspectionFreq.startDate,
    assetType: testObject.assetType,
    testCode: testForm.code,
    assetId: asset.id,
    nextExpiryDate: testObject.nextExpiryDate,
    nextDueDate: testObject.inspectionFreq.startDate,
    testId: testObject.id,
    start: asset.start,
    end: asset.end,
    lineId: asset.lineId,
    title: testObject.name,
    ...linearFields,
  };
}

async function scheduleExecutionOfTest(
  testObj,
  locationTimezone,
  adjustDate,
  scheduleService,
  timezoneMethodService,
  testScheduleObserverService,
) {
  let execs = [];
  let nextPeriod = getNextTimePeriod(adjustDate, testObj.inspectionFrequencies);
  let endOfPeriod = getEndTimePeriod(nextPeriod, testObj.inspectionFrequencies, locationTimezone, timezoneMethodService);
  let nowOrEndOfPeriod = moment().isAfter(moment(endOfPeriod));

  let dateRange = {
    from: moment(adjustDate),
    to: nowOrEndOfPeriod ? moment() : endOfPeriod,
    today: moment(),
  };
  let prevExecs = await testScheduleObserverService.fetchExecs(dateRange.from, dateRange.to, testObj);
  execs = scheduleService.getTestSchedule(
    testObj,
    adjustDate,
    prevExecs,
    dateRange,
    null,
    locationTimezone,
    timezoneMethodService,
    checkToIgnoreTestSchedule,
  );
  return execs;
}

function checkIfDateValuesToUpdate(testObj) {
  if (testObj.updatedNextDates) {
    testObj.nextDueDate = testObj.updatedNextDates.nextDueDate;
    testObj.nextExpiryDate = testObj.updatedNextDates.nextExpiryDate;
    testObj.currentPeriodStart = testObj.updatedNextDates.currentPeriodStart;
    testObj.currentPeriodEnd = testObj.updatedNextDates.currentPeriodEnd;
  }
  testObj.updatedNextDates && delete testObj.updatedNextDates;
}

async function createNewAssetTest(testObj, asset, execs, testScheduleObserverService) {
  let test = new AssetTestModel({ ...testObj, assetId: asset.id });
  test.save((err, savedTest) => {
    if (err) throw err;
    testScheduleObserverService.updateRequiredTest(execs, savedTest);
    testScheduleObserverService.createTimeInstancePeriod(savedTest);
  });
}

async function updateAssetTest(testExist, testObj, testForm, asset, adjustDate, execs, testScheduleObserverService) {
  testExist.title = testObj.title;
  testExist.inspectionFrequencies = testObj.inspectionFrequencies;
  testExist.startDate = adjustDate;
  testExist.assetType = testObj.assetType;
  testExist.testCode = testForm.code;
  testExist.testId = testObj.testId;
  testExist.assetId = asset.id;
  testExist.isRemoved = false;
  testExist.nextExpiryDate = testObj.nextExpiryDate;
  testExist.nextDueDate = testObj.nextDueDate;
  testExist.currentPeriodStart = testObj.currentPeriodStart;
  testExist.timezone = testObj.timezone;
  testExist.currentPeriodEnd = testObj.currentPeriodEnd;
  testExist.linearProps = testObj.linearProps;
  testExist.start = asset.start;
  testExist.end = asset.end;
  testExist.lineId = asset.lineId;
  testExist.markModified("linearProps");
  testExist.markModified("inspectionFrequencies");
  await testExist.save((err, savedTest) => {
    if (err) throw err;
    testScheduleObserverService.updateRequiredTest(execs, savedTest);
  });
}

async function fillLocationAssetOfInspectionAssets(locationAssets, asset) {
  let locationAsset;
  if (locationAssets[asset.lineId]) {
    locationAsset = locationAssets[asset.lineId];
  } else {
    locationAsset = await AssetsModel.findOne({ _id: asset.lineId }).exec();
    locationAssets[locationAsset.id] = locationAsset;
  }
  return locationAsset;
}
