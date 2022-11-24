"use strict";
import _, { forEach } from "lodash";
import moment from "moment";
import { completiontoleranceMP } from "../template/config";
import { checkCompletedForFixedTestSchedule } from "../api/AssetTests/assetTests.service";
import { defectCodes } from "../config/database/defectCodes";
var util = require("util");

let mongoose = require("mongoose");
let ServiceLocator = require("../framework/servicelocator");
export default class DatabaseSerivce {
  constructor(logger) {
    this.logger = logger;
  }
  async checkForTemplateScheduleReCalculateFlag(receivedObj) {
    try {
      let item = receivedObj.item;
      let WPlanSchedulesModel = ServiceLocator.resolve("WPlanSchedulesModel");
      let updateReCal = false;
      let toChangeStatusToFinish = false;
      let workplanTemplateId = item.optParam1.workplanTemplateId;
      let jPlan = null;
      /* #  logic implemented
        - if inspection is new then set recaluclate true for the inspections of template
        - if inspection already exist then check two cases for recaluclate true
            1. if inspection type is changed ( it changes because when inspection is started type is "" and after task is started it is one of three type and we recalculate in this case )
            2. if inspection was in progress and inspection is Finished.
      */

      if (!item.code) {
        updateReCal = workplanTemplateId ? true : false;
      } else {
        let JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
        let existedJPlan = await JourneyPlanModel.findOne({ _id: item.code });
        if (existedJPlan) {
          workplanTemplateId = existedJPlan.workplanTemplateId;
          jPlan = existedJPlan;
          const newDataInspectionType =
            item.optParam1.tasks &&
            item.optParam1.tasks.length > 0 &&
            item.optParam1.tasks[0].inspectionType &&
            item.optParam1.tasks[0].inspectionType !== existedJPlan.tasks[0].inspectionType;
          const planClosedNow = existedJPlan.status == "In Progress" && item.optParam1.status == "Finished";
          if (newDataInspectionType || planClosedNow) {
            updateReCal = true;
          }
          // if (toChangeStatusToFinish) {
          //   existedJPlan.status = item.optParam1.status;
          //   await existedJPlan.save();
          // }
        }
      }
      if (updateReCal) {
        let wPlanSchedule = await WPlanSchedulesModel.findOne({ templateId: workplanTemplateId }).exec();
        if (wPlanSchedule) {
          wPlanSchedule.toRecalculate = true;
          await wPlanSchedule.save();
        }
        // // # to update next execution date and expiry date on execution

        let wPlanTemplateModel = ServiceLocator.resolve("WorkPlanTemplateModel");
        let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
        let scheduleService = ServiceLocator.resolve("scheduleService");
        let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
        let workingDays = { holidays: [], weekOffDays: [] };
        let workingOffDays = await ApplicationLookupsModel.findOne({ code: "weekdays" }).exec();
        workingDays.weekOffDays = workingOffDays.opt2;

        let template = await wPlanTemplateModel.findOne({ _id: workplanTemplateId }).exec();

        if (template && template.inspectionFrequencies && template.inspectionFrequencies.length > 0) {
          let freqPeriod;
          freqPeriod = {
            recurNumber: template.inspectionFrequencies[0].recurNumber && parseInt(template.inspectionFrequencies[0].recurNumber),
            recurPeriod: template.inspectionFrequencies[0].recurTimeFrame,
          };
          let startDate = template.currentPeriodStart ? template.currentPeriodStart : template.startDate;
          let dateRange = {
            from: moment(startDate),
            today: moment.utc().startOf("d"),
            to: moment(startDate).add(freqPeriod.recurNumber * 2, freqPeriod.recurPeriod),
          };

          let timezoneMethodService = ServiceLocator.resolve("timezoneMethodService");
          let locTimezone = template.locationTimeZone;
          if (!locTimezone) {
            let assetService = ServiceLocator.resolve("AssetsService");
            locTimezone = await assetService.getLocationTimeZone(template.lineId);
          }
          dateRange.today = moment.utc().startOf("day");
          scheduleService.getSchedules(
            template,
            startDate,
            jPlan ? [jPlan] : [],
            dateRange,
            workingDays,
            locTimezone,
            timezoneMethodService,
            workPlanTemplateService.ignoreInspectionsFromSchedulingCase,
          );
          let utils = ServiceLocator.resolve("utils");
          await workPlanTemplateService.checkWorkPlanNextDueExpiryDate(template, utils, 1);
          await workPlanTemplateService.checkCurrentTimePeriodUpdate(template, utils);
          let alertService = ServiceLocator.resolve("AlertService");
          alertService.recalculateAlertMonitoringByModelId(template.id);
          let savedTemplate = await template.save();
          // console.log("Saving template in completion function");
          // console.log(savedTemplate.completion);
        }
      }
    } catch (err) {
      console.log("err in DBService checkForTemplateScheduleReCalculateFlag" + err);
    }
  }
  async checkTestsFormFilling(receivedObj) {
    let item = receivedObj && { ...receivedObj.item };
    let testSchedulesModel = ServiceLocator.resolve("TestSchedulesModel");
    let JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    let testScheduleObserverService = ServiceLocator.resolve("TestScheduleObserverService");
    let existedJplan = null;
    try {
      if (item.code) {
        existedJplan = await JourneyPlanModel.findOne({ _id: item.code });
      }
      if (item && item.optParam1 && item.optParam1.tasks && item.optParam1.tasks[0] && item.optParam1.tasks[0].units) {
        let unitsLength = item.optParam1.tasks[0].units.length;
        let units = item.optParam1.tasks[0].units;

        for (let u = 0; u < unitsLength; u++) {
          if (units[u] && units[u].appForms) {
            for (let form of units[u].appForms) {
              let inspectoinForData = existedJplan ? existedJplan : item.optParam1;
              let fullUnits = existedJplan ? existedJplan.tasks[0].units : item.optParam1.tasks[0].units;
              if (form.id) {
                let obj = createTestScheduleObj(inspectoinForData, form, fullUnits[u]);
                if (!obj.title) {
                  obj.title = await getTestTitleFromAssetTest(obj);
                }
                let exists = await testSchedulesModel
                  .findOne({ assetId: obj.assetId, testCode: form.id, inspectionId: obj.inspectionId })
                  .exec();
                if (exists) {
                  exists.formData = obj.formData;
                  exists.markModified("formData");
                  await exists.save();
                } else {
                  let newTestData = new testSchedulesModel(obj);
                  await newTestData.save();
                }

                // let assetTest = await testScheduleObserverService.fetchTest(null, obj.assetId, form.id);
                // await testScheduleObserverService.executeTestSchedule(assetTest);
              }
            }
          }
        }
      }
    } catch (err) {
      console.log("Error in checkTestsFormFilling: ", err);
    }
  }
  async workPlanIntervalReceivedMethod(received) {
    let inspection = received.newItem ? received.newItem : null;
    let workplanTemplateId = inspection.workplanTemplateId;
    if (workplanTemplateId) {
      let wPlanTemplateModel = ServiceLocator.resolve("WorkPlanTemplateModel");
      let assetService = ServiceLocator.resolve("AssetsService");
      let timezoneMethodService = ServiceLocator.resolve("timezoneMethodService");
      let template = await wPlanTemplateModel.findOne({ _id: workplanTemplateId }).exec();

      let intervals = inspection && [...inspection.intervals];
      // console.log("prev inspection task");
      // console.log(inspection.tasks[0]);
      // temp check for user run start end instead of intervals
      let item = received.item;
      let userStartEndVals = false;
      if (
        inspection.tasks &&
        inspection.tasks[0] &&
        inspection.tasks[0].inspectionTypeTag == "required" &&
        item &&
        ((item.optParam1 && item.optParam1.intervals) ||
          (item.optParam1.tasks && item.optParam1.tasks[0] && (item.optParam1.tasks[0].userStartMP || item.optParam1.tasks[0].userEndMP)))
      ) {
        userStartEndVals = true;
      }
      // also check if inspection date is after due date of template?
      let locTimezone = template.locationTimeZone;
      if (!locTimezone) {
        locTimezone = await assetService.getLocationTimeZone(template.lineId);
      }

      if (userStartEndVals && template && inspection.tasks && inspection.tasks.length > 0) {
        // # check if interval exist otherwise set the interval to run start/end
        // if ((!intervals || intervals.length < 1) && inspection.tasks && inspection.tasks[0]) {
        //   intervals = [
        //     {
        //       start: inspection.tasks[0].userStartMP,
        //       end: inspection.tasks[0].userEndMP,
        //       status: inspection.tasks[0].userEndMP ? "closed" : "open",
        //     },
        //   ];
        // }
        // # check if we need to update/add new interval in template completion .
        if (checkAfterDueDate(inspection, template, locTimezone, timezoneMethodService)) {
          !template.completion && (template.completion = { completed: false, ranges: [] });
          let inspectObj = _.find(template.completion.ranges, (inspec) => {
            return inspec.inspectionId == (inspection && inspection._id.toString());
          });
          // # sanity test to make sure interavls are closed if inspection is finished. validate intervals
          if (intervals && intervals.length > 0) {
            let removedIntervals = _.remove(intervals, (interval) => {
              return (!interval.start || !interval.end) && interval.status == "closed";
            });
            for (let rInterval of removedIntervals) {
              console.log("interval removed of inspection id " + inspection._id + " : ", rInterval);
            }
          }

          if (!inspectObj) {
            inspectObj = {
              inspectionId: inspection && inspection._id.toString(),
              inspectionName: inspection.title,
              user: inspection.user,
              intervals: intervals,
            };
            template.completion.ranges.push(inspectObj);
          } else {
            inspectObj.intervals = intervals;
          }

          // # to calculate the completion logic for the template in the current range
          let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
          let completed = template.completion.completed;
          if (template.completion.completed == false && inspection.status == "Finished") {
            let start = template.tasks && template.tasks[0] && parseFloat(template.tasks[0].runStart);
            let end = template.tasks && template.tasks[0] && parseFloat(template.tasks[0].runEnd);
            completed = workPlanTemplateService.completionCalculation(template.completion, start, end, completiontoleranceMP);
          }
          // # to save the template if completion is changed afterwards

          template.completion.completed = completed;
          template.markModified("completion");
          template.markModified("completion.ranges");

          let savedTemp = await template.save();
          // console.log("Saving template in completion function");
          // console.log(savedTemp.completion);

          if (inspection) {
            inspection.inspectionCompleted = completed;
            await inspection.save();
          }
        } else {
          // if inspection is executed before due date then set its completed to false because it does not count in the completion for our inspection range or time.
          if (inspection) {
            inspection.inspectionCompleted = false;
            await inspection.save();
          }
        }
      }
    }
  }

  async fixedAssetGPSupdate(item) {
    let AssetsModel = ServiceLocator.resolve("AssetsModel");
    let wPlanTemplateModel = ServiceLocator.resolve("WorkPlanTemplateModel");

    let validForExecution = assetExistenceInInspection(item.item && item.item.optParam1);
    if (validForExecution) {
      let assetsToUpdate = assetsWithAdjCords(item.item.optParam1);
      let assetsTOIds = assetsToUpdate.map((a) => {
        return a.id;
      });
      let templates = await wPlanTemplateModel.find({ "tasks.units.id": { $in: assetsTOIds } });
      for (let asset of assetsToUpdate) {
        await saveUpdatedAdjCordsAsset(AssetsModel, asset);
        for (let template of templates) {
          let upTemplate = updateAssetInTemplateWithAdjCords(template, asset);
          upTemplate.markModified("tasks");
          await upTemplate.save();
        }
      }
    }
  }

  async JPUpdateCallbackForAlertRecalculate(data) {
    let item = data.item;
    try {
      if (item && item.optParam1 && item.optParam1.workplanTemplateId) {
        let alertService = ServiceLocator.resolve("AlertService");
        if (
          item.optParam1.tasks &&
          item.optParam1.tasks.length &&
          item.optParam1.tasks[0].issues &&
          item.optParam1.tasks[0].issues.length
        ) {
          await alertService.rule2139bAlertCreate(item);
        } else if (!item.code || item.code == "") {
          alertService.recalculateAlertMonitoringByModelId(item.optParam1.workplanTemplateId);
        }
      }
    } catch (error) {
      console.log(error);
      this.logger.error("DataOperationsLogin:JPUpdateCallbackForAlertRecalculate:catch: err:" + error);
    }
  }
  async maintenanceExecution(item) {
    let maintenanceService = ServiceLocator.resolve("MaintenanceService");
    let MaintenanceModel = ServiceLocator.resolve("MaintenanceModel");
    let task = item.newItem && item.newItem.tasks && item.newItem.tasks[0];
    if (task) {
      let maintenance = task.maintenance;
      if (maintenance && maintenance.length > 0) {
        for (let maintenanceExec of maintenance) {
          let mZero = maintenanceExec;
          let mr = await MaintenanceModel.findOne({ _id: mZero._id }).exec();
          if (mr) {
            !mr.executions && (mr.executions = []);
            let savedExistence = _.find(mr.executions, (id) => {
              return id == item.newItem._id.toString();
            });

            if (!savedExistence) {
              mr.executions.push(item.newItem._id.toString());
              mr.status = "Complete";
              await mr.save();
              maintenanceService.setMRsFields([mr.mrNumber], {
                status: "Complete",
                closedDate: mZero.timeStamp,
              });
            }
          }
        }
      }
    }
  }

  async updateDefaultAppFormsValues(item) {
    let wPlanTemplateModel = ServiceLocator.resolve("WorkPlanTemplateModel");
    let updatedJPlan = item.newItem;
    let workplanTemplateId = item.newItem && item.newItem.workplanTemplateId;
    try {
      if (workplanTemplateId && updatedJPlan.status == "Finished") {
        let wPlan = await wPlanTemplateModel.findOne({ _id: workplanTemplateId }).exec();

        if (wPlan && wPlan.tasks && wPlan.tasks[0]) {
          for (let asset of wPlan.tasks[0].units) {
            let jPlanAsset = _.find(updatedJPlan.tasks[0].units, { id: asset.id });
            if (jPlanAsset && jPlanAsset.appForms && jPlanAsset.appForms.length > 0) {
              // if (process.env.NODE_ENV === "development") {
              //   customLogNewItem(jPlanAsset.appForms);
              // }
              asset.defaultAppForms = flterAppFormsForDefaultValue(jPlanAsset.appForms);
            }
          }
          wPlan.markModified("tasks");
          await wPlan.save();
        }
      }
    } catch (err) {
      console.log(("Error in updateDefaultAppFormsValues ", err));
    }
  }
  async userProfileUpdate(item) {
    let jPlanChanges = item && item.change.optParam1;
    let userModel = ServiceLocator.resolve("userModel");
    let jPlan = item && item.newItem;
    if (jPlanChanges && jPlanChanges.user) {
      let user = await userModel.findOne({ email: jPlan.user.email }).exec();
      jPlanChanges.user.profile_img && (user.profile_img = jPlanChanges.user.profile_img);
      jPlanChanges.user.signature && (user.signature = jPlanChanges.user.signature);
      await user.save();
    }
  }

  async inspectionOnFinished(item) {
    let inspection = item.newItem;
    let workplanTemplateId = item.newItem && item.newItem.workplanTemplateId;
    let testScheduleObserverService = ServiceLocator.resolve("TestScheduleObserverService");
    let assetTypeModel = ServiceLocator.resolve("AssetTypesModel");
    let wPlanTemplateModel = ServiceLocator.resolve("WorkPlanTemplateModel");
    let assetService = ServiceLocator.resolve("AssetsService");
    let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");

    let timezoneMethodService = ServiceLocator.resolve("timezoneMethodService");
    let required = inspection.tasks[0].inspectionTypeTag == "required";
    let testSchedulesModel = ServiceLocator.resolve("TestSchedulesModel");
    try {
      if (checkWorkPlanTemplateIdAndInspectionIsFinished(workplanTemplateId, inspection)) {
        let template = await wPlanTemplateModel.findOne({ _id: workplanTemplateId }).exec();
        let locTimezone = template.locationTimeZone;
        if (!locTimezone) {
          locTimezone = await assetService.getLocationTimeZone(template.lineId);
        }
        let linearAssetTypes = await assetTypeModel.find({ assetTypeClassify: "linear" }).exec();

        // if (process.env.NODE_ENV === "development") {
        //   customLogNewItem(inspection);
        // }

        let unitsLength = inspection.tasks[0].units.length;
        let units = inspection.tasks[0].units;
        for (let u = 0; u < unitsLength; u++) {
          //  check if asset is linear,
          let linearCheck = await _.find(linearAssetTypes, { assetType: units[u].assetType });
          if (units[u].appForms) {
            let yardCheck = units[u].assetType == "Yard Track";
            for (let form of units[u].appForms) {
              if (form && form.id) {
                let assetTest = await testScheduleObserverService.fetchTest(null, units[u].id, form.id);

                // if inspected , jounreyPlans sessions should be picked up
                if (checkAfterDueDate(inspection, assetTest, locTimezone, timezoneMethodService) && required) {
                  !assetTest.completion && (assetTest.completion = { completed: false, ranges: [] });
                  if (checkIfInspectedAndLinear(linearCheck, form) && !yardCheck) {
                    let intervals = inspection && _.cloneDeep(inspection.intervals);
                    let inspectObj = _.find(assetTest.completion.ranges, (inspec) => {
                      return inspec.inspectionId == (inspection && inspection._id.toString());
                    });
                    // console.log("[" + new Date().toString() + "] Inspection:" + inspection._id + ". intervals:" + util.inspect(intervals));
                    // this.logger.info("Inspection:" + inspection._id + " intervals:" + util.inspect(intervals));

                    let filteredIntervals = validateIntervalsAndFilter(intervals, assetTest, inspection);
                    inspectObj = createOrUpdateIntervals(inspectObj, inspection, filteredIntervals, assetTest);

                    if (assetTest.completion.completed == false) {
                      assetTest.completion.completed = workPlanTemplateService.completionCalculation(
                        assetTest.completion,
                        assetTest.start,
                        assetTest.end,
                        completiontoleranceMP,
                      );
                    }
                    assetTest.markModified("completion");
                    assetTest.markModified("completion.ranges");
                    await assetTest.save();
                  } else if (!linearCheck || yardCheck) {
                    assetTest.completion.completed = checkCompletedForFixedTestSchedule(form);
                    await assetTest.save();
                  }
                  await updateTestScheduleCompletion(testSchedulesModel, assetTest, inspection, units[u], form);
                  await testScheduleObserverService.executeTestSchedule(assetTest);
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(("Error in inspectionOnFinished ", err));
    }
  }
  async pushDefectIssues(item) {
    let inspection = item && item.newItem;
    let workplanTemplateId = inspection && inspection.workplanTemplateId;
    let wPlanTemplateModel = ServiceLocator.resolve("WorkPlanTemplateModel");
    try {
      if (
        checkWorkPlanTemplateIdAndInspectionIsFinished(workplanTemplateId, inspection) &&
        checkIssuesExists(workplanTemplateId, inspection)
      ) {
        let issues = inspection.tasks[0].issues;
        let assetIssuesToPush = [];
        for (let issue of issues) {
          if (issue.remedialAction !== "Repaired" || issue.status !== "Resolved") {
            let issuetoPush = issueObjectForPushingBackToApp(issue);
            let aIndex = _.findIndex(assetIssuesToPush, { assetId: issuetoPush.assetId });
            if (aIndex > -1) {
              assetIssuesToPush[aIndex].issueObjs = [...assetIssuesToPush[aIndex].issueObjs, ...issuetoPush.issueObjs];
            } else {
              assetIssuesToPush.push(issuetoPush);
            }
          }
        }
        for (let assetIssues of assetIssuesToPush) {
          let wPlansCriteira = { "tasks.units.id": assetIssues.assetId };
          let wPlans = await wPlanTemplateModel.find(wPlansCriteira).exec();
          await this.updateTemplateWithNewAssetIssues(wPlans, assetIssues);
        }
      }
    } catch (err) {
      console.log("err in  pushDefectIssues : ", err);
    }
  }
  async updateTemplateWithNewAssetIssues(wPlans, assetIssues) {
    if (wPlans && wPlans.length > 0) {
      for (let wPlan of wPlans) {
        let planUnits = wPlan && wPlan.tasks && wPlan.tasks[0] && wPlan.tasks[0].units;
        if (planUnits) {
          let assetIndex = _.findIndex(planUnits, { id: assetIssues.assetId });
          if (assetIndex > -1) {
            !planUnits[assetIndex].issueDefects && (planUnits[assetIndex].issueDefects = []);
            planUnits[assetIndex].issueDefects = [...planUnits[assetIndex].issueDefects, ...assetIssues.issueObjs];
          }
          wPlan.markModified("tasks");
          let savedPlan = await wPlan.save();
        }
      }
    }
  }
}
async function updateTestScheduleCompletion(testSchedulesModel, assetTest, inspection, unit, form) {
  let exists = await testSchedulesModel
    .findOne({ assetId: assetTest.assetId, testCode: assetTest.testCode, inspectionId: inspection._id })
    .exec();
  if (exists) {
    exists.completed = assetTest.completion.completed;
    await exists.save();
  } else {
    let obj = createTestScheduleObj(inspection, form, unit);
    if (!obj.title) {
      obj.title = await getTestTitleFromAssetTest(obj);
    }
    obj.completed = assetTest.completion.completed;
    let newTestData = new testSchedulesModel(obj);
    await newTestData.save();
  }
}
export function createOrUpdateIntervals(inspectObj, inspection, intervals, assetTest) {
  let intervalToPush = intervals;

  if (!inspectObj) {
    inspectObj = {
      inspectionId: inspection && inspection._id.toString(),
      inspectionName: inspection.title,
      user: inspection.user,
      intervals: intervalToPush,
    };
    assetTest && assetTest.completion && assetTest.completion.ranges && assetTest.completion.ranges.push(inspectObj);
  } else {
    inspectObj.intervals = intervalToPush;
  }
  return inspectObj;
}

export function validateIntervalsAndFilter(intervals, assetTest, inspection) {
  if (intervals && intervals.length > 0) {
    let removedIntervals = _.remove(intervals, (interval) => {
      let validStart = interval.start || interval.start === 0;
      let validEnd = interval.end || interval.end === 0;
      return (!validStart || !validEnd) && interval.status == "closed";
    });
    for (let rInterval of removedIntervals) {
      console.log("interval removed of inspection id " + inspection._id + " : ", rInterval);
    }
  }
  let filteredIntervals = _.filter(intervals, (interval) => {
    let inspecType = assetTest.linearProps && assetTest.linearProps.inspectionType;
    let toAdd = false;
    if (
      (inspecType == "traversed" && interval.traversed == assetTest.assetId) ||
      (inspecType == "observed" && interval.observed == assetTest.assetId)
    ) {
      toAdd = true;
    }
    return toAdd;
  });

  return filteredIntervals;
}

export function checkIfInspectedAndLinear(linearCheck, form) {
  let formFilled = false;
  if (linearCheck && form.form) {
    let inspectedField = _.find(form.form, (field) => {
      return field.id == "Inspected" || field.tag == "completionCheck";
    });
    formFilled = inspectedField && (inspectedField.value == "true" || inspectedField.value == true) ? true : false;
  }
  return formFilled;
}

export function checkIssuesExists(workplanTemplateId, updatedJPlan) {
  return (
    workplanTemplateId &&
    workplanTemplateId !== "" &&
    updatedJPlan.status == "Finished" &&
    updatedJPlan &&
    updatedJPlan.tasks &&
    updatedJPlan.tasks[0] &&
    updatedJPlan.tasks[0].issues &&
    updatedJPlan.tasks[0].issues.length > 0
  );
}
export function checkWorkPlanTemplateIdAndInspectionIsFinished(workplanTemplateId, updatedJPlan) {
  return workplanTemplateId &&
    workplanTemplateId !== "" &&
    updatedJPlan.status == "Finished" &&
    updatedJPlan &&
    updatedJPlan.tasks &&
    updatedJPlan.tasks[0] &&
    updatedJPlan.tasks[0].units
    ? true
    : false;
}

export function flterAppFormsForDefaultValue(appForms) {
  let returnAppForms = [];
  for (let appForm of appForms) {
    if (appForm) {
      let filteredAppForm = {
        id: appForm.id,
        form: [],
      };
      let formData = appForm.form;
      if (formData && formData.length > 0) {
        for (let formField of formData) {
          if (formField.id !== "yes" && formField.id !== "Inspected" && formField.tag != "completionCheck") {
            filteredAppForm.form.push({
              id: formField.id,
              value: formField.value,
            });
          }
        }
        returnAppForms.push(filteredAppForm);
      }
    }
  }
  return returnAppForms;
}

export function checkAfterDueDate(inspection, template, locTimezone, timezoneMethodService) {
  let afterDueDate = true;
  let dueDateStart = timezoneMethodService.startOfDayMethod(template.nextDueDate, locTimezone);
  if (moment(inspection.date).isBefore(moment(dueDateStart))) {
    afterDueDate = false;
  }
  return afterDueDate;
}

export function assetExistenceInInspection(inspection) {
  let exists = false;
  if (inspection && inspection.tasks && inspection.tasks.length > 0) {
    for (let task of inspection.tasks) {
      if (task.units && task.units.length > 0) {
        exists = true;
      }
    }
  }
  return exists;
}

export function assetsWithAdjCords(inspection) {
  let resultAssets = [];
  if (inspection.tasks) {
    for (let task of inspection.tasks) {
      if (task.units) {
        for (let unit of task.units) {
          if (unit && unit.adjCoordinates) {
            resultAssets.push(unit);
          }
        }
      }
    }
  }
  return resultAssets;
}
export function updateAssetInTemplateWithAdjCords(template, adjAsset) {
  for (let task of template.tasks) {
    for (let unit of task.units) {
      if (adjAsset.id == unit.id) {
        if (clearGpsAdustmentCords(adjAsset)) {
          delete unit.adjCoordinates;
        } else {
          unit.adjCoordinates = adjAsset.adjCoordinates;
        }
        break;
      }
    }
  }
  return template;
}

async function saveUpdatedAdjCordsAsset(model, asset) {
  let criteria = { _id: mongoose.Types.ObjectId(asset.id) };
  let update = {};
  if (clearGpsAdustmentCords(asset)) {
    update = { $unset: { "attributes.adjCoordinates": "" } };
  } else {
    update = { $set: { "attributes.adjCoordinates": asset.adjCoordinates } };
  }

  await model.update(criteria, update);
}

export function clearGpsAdustmentCords(asset) {
  let unset = false;

  if (
    asset &&
    asset.adjCoordinates &&
    (asset.adjCoordinates.coordinates[0] == 0 || asset.adjCoordinates.coordinates[0] == "0") &&
    (asset.adjCoordinates.coordinates[1] == 0 || asset.adjCoordinates.coordinates[1] == "0")
  ) {
    unset = true;
  }
  return unset;
}

export function checkIfNewPlan(item) {
  if (item.code) {
    return true;
  } else {
    return false;
  }
}

function createTestScheduleObj(inspectoinForData, form, unit) {
  let obj = {
    assetId: unit.id,
    lineId: inspectoinForData.lineId,
    lineName: inspectoinForData.tasks[0].units[0].unitId,
    assetName: unit.unitId,
    testCode: form.id,
    testDescription: form.name,
    formData: form.form,
    inspectionId: inspectoinForData.id,
    user: inspectoinForData.user,
    date: inspectoinForData.date,
    assetType: unit.assetType,
    assetMP: unit.start,
    assetStart: unit.start,
    assetEnd: unit.end,
    title: calculateTitleFromFormAssetType(form, unit),
  };
  return obj;
}

function issueObjectForPushingBackToApp(issue) {
  let obj = {
    assetId: issue.unit.id,
    issueObjs: [
      {
        issueId: issue.issueId,
        defectCodes: issue.defectCodes,
        title: issue.title,
        description: issue.description,
        startMp: issue.startMp,
        endMp: issue.endMp,
        timeStamp: issue.timeStamp,
        remedialAction: issue.remedialAction,
        voiceNotes: issue.voiceNotes,
        issueType: issue.issueType,
        location: issue.location,
        startMarker: issue.startMarker,
        endMarker: issue.endMarker,
      },
    ],
  };
  return obj;
}
function customLogNewItem(item) {
  let logger = ServiceLocator.resolve("CustomLogger");
  logger.info(JSON.stringify(item, null, 4));
}

export function calculateTitleFromFormAssetType(form, asset) {
  let title = "";
  if (form && asset && asset.testForm) {
    let aTest = _.find(asset.testForm, { testCode: form.id });
    if (aTest) {
      title = aTest.title;
    }
  }
  return title;
}

async function getTestTitleFromAssetTest(execution) {
  let AssetTestModel = ServiceLocator.resolve("AssetTestModel");
  let aTest = await AssetTestModel.find({ testCode: execution.testCode, assetId: execution.assetId });
  return aTest.title;
}
