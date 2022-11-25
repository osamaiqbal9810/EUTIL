import _ from "lodash";
import moment from "moment";
import { guid } from "../../../utilities/UUID.js";
let ServiceLocator = require("../../../framework/servicelocator");
import { subdivisionChecker } from "../../../apiUtils/subdivisionCheck";
class JourneyPlanService {
  async getJourneyPlansAll(user, query) {
    let resultObj = {},
      JourneyPlanModel,
      UserModel,
      adminCheck,
      subdivisionUser,
      dateRange;

    JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    UserModel = ServiceLocator.resolve("userModel");
    adminCheck = user.isAdmin;
    subdivisionUser = user.subdivision;
    if (query.dateRange) {
      dateRange = JSON.parse(query.dateRange);

      // console.log(dateRange);
    }

    try {
      // let TemplateModel = ServiceLocator.resolve("WorkPlanTemplateModel");
      // let allTemplates = [];
      let checkSubdiv = await subdivisionChecker(user);

      // -1 User is Admin or it has all subdivisions
      if (dateRange) {
        // 1.2: If Filter of date then get the data in that filter Range
        let criteria = { date: { $gte: new Date(dateRange.from), $lte: new Date(dateRange.to) } };
        if (checkSubdiv) criteria.subdivision = subdivisionUser;

        // let jplans = await JourneyPlanModel.find(criteria).exec();
        // allTemplates = await TemplateModel.find({ isRemoved: !true }).exec();

        // let forecastInspection = await foreCastPlan(dateRange, allTemplates);
        // jplans = [...jplans, ...forecastInspection];
        let workplanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
        let range = {
          today: moment.utc(dateRange.today),
          from: moment.utc(dateRange.from),
          to: moment.utc(dateRange.to),
        };
        let jplans = await workplanTemplateService.getAllPlansInRange(range, user, null, { sortBy: { date: "asc" } }, false, true);

        //  console.log(jplans);
        resultObj = { value: jplans, status: 200 };
      } else {
        // 1.1 Get All inspections
        let criteria = {};
        let assetService = ServiceLocator.resolve("AssetsService");

        let assetIds = await assetService.getFilteredAssetsIds(user, { plannable: true }, true);
        criteria.lineId = { $in: assetIds.assetIds };
        let jplans = await JourneyPlanModel.find({}).exec();
        resultObj = { value: jplans, status: 200 };
      }
    } catch (error) {
      console.log("Error in JplanService ", error);
      resultObj = { errorVal: error, status: 500 };
    }

    // try {
    //   // if (!adminCheck && (subdivisionUser && subdivisionUser !== "All")) {
    //   //   let jplans = await JourneyPlanModel.find({ subdivision: subdivisionUser, lineId: lineId }).exec();
    //   //   resultObj = { value: jplans, status: 200 };
    //   // } else {
    //   let jplans = await JourneyPlanModel.find({ lineId: lineId }).exec();
    //   resultObj = { value: jplans, status: 200 };
    //   //}
    // } catch (error) {
    //   console.log("Error in JplanService ", error);
    //   resultObj = { errorVal: err, status: 500 };
    // }
    return resultObj;
  }

  async getJourneyPlansFind(user, query) {
    let resultObj = {},
      JourneyPlanModel,
      UserModel,
      adminCheck,
      subdivisionUser,
      AssetModel,
      dateRange;

    JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    AssetModel = ServiceLocator.resolve("AssetsModel");
    UserModel = ServiceLocator.resolve("userModel");
    adminCheck = user.isAdmin;
    subdivisionUser = user.subdivision;
    if (query.dateRange) {
      dateRange = JSON.parse(query.dateRange);

      // console.log(dateRange);
    }

    try {
      let checkSubdiv = await subdivisionChecker(user);
      // -1 User is Admin or it has all subdivisions
      if (dateRange) {
        // 1.2: If Filter of date then get the data in that filter Range
        let dbCriteria = [];
        if (query.userId) {
          dbCriteria.push[{ "user.id": query.userId }];
        }
        if (query.userEmail) {
          dbCriteria.push[{ "user.email": query.userEmail }];
        }
        if (query.lineId) {
          dbCriteria.push[{ lineId: query.lineId }];
        }

        let dateCriteria = { date: { $gte: new Date(dateRange.from), $lte: new Date(dateRange.to) } };
        let criteria = {
          $and: [
            dateCriteria,
            ...dbCriteria,
            {
              $or: [
                { "tasks.inspectionTypeTag": "required" },
                { "tasks.inspectionType": "Required Inspection" },
                { "tasks.inspectionTypeTag": "required" },
                { "tasks.includeInFRAReport": true },
              ],
            },
          ],
        };

        if (checkSubdiv) criteria.subdivision = subdivisionUser;
        criteria.workplanTemplateId = { $ne: "" };
        let reportCrit = reportsCriteria(query.rId);
        if (reportCrit) criteria = { ...criteria, ...reportCrit };
        let jPlans = await JourneyPlanModel.find(criteria).exec();
        let plans = [];
        if (jPlans) {
          for (let plan of jPlans) {
            let outPlan = {};
            outPlan["_id"] = plan._id;
            outPlan["date"] = plan.date;
            outPlan["title"] = plan.title;
            outPlan["lineId"] = plan.lineId;
            outPlan["user"] = plan.user;
            outPlan["inspectionType"] = plan.tasks[0].inspectionType;
            outPlan["inspectionTypeTag"] = plan.tasks[0].inspectionTypeTag;
            outPlan["status"] = plan.status;
            outPlan["issues"] = filteredIssues(plan);
            if (plan.lineId) {
              let asset = await AssetModel.findOne({ _id: plan.lineId });
              if (asset) {
                outPlan["lineName"] = asset.unitId;
              }
            }
            let checkifValidForReport = checkReportDataExist(query.rId, plan);
            if (checkifValidForReport) {
              plans.push(outPlan);
            }
          }
        }

        //  console.log(jplans);
        resultObj = { value: plans, status: 200 };
      } else {
        resultObj = { errorVal: "unable to find date criteria", status: 500 };
      }
    } catch (error) {
      console.log("Error in JplanService ", error);
      resultObj = { errorVal: error, status: 500 };
    }

    return resultObj;
  }

  async multiLinePlans(lines) {
    let resultObj = {},
      jplans,
      JourneyPlanModel;
    JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    try {
      let criteria = { lineId: { $in: lines } };

      jplans = await JourneyPlanModel.find(criteria);
      resultObj = { value: jplans, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("journeyPlan.service catch error:", err.toString());
    }
    return resultObj;
  }
  async updateIssue(issueObj, user) {
    let resultObj = {},
      maintenanceService,
      JourneyPlanModel,
      MaintenanceModel,
      workPlanTemplateService;

    JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    maintenanceService = ServiceLocator.resolve("MaintenanceService");
    MaintenanceModel = ServiceLocator.resolve("MaintenanceModel");
    workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");

    try {
      const [jIndex, tIndex, iIndex] = issueObj.issue.index.split("-");
      let toRemoveFromPlan = false;
      let jPlan = await JourneyPlanModel.findOne({ _id: issueObj.issue.planId }).exec();
      if (issueObj.action == "Close") {
        jPlan.tasks[tIndex].issues[iIndex].status = "Resolved";
        toRemoveFromPlan = true;
        jPlan.tasks[tIndex].issues[iIndex].closeReason = issueObj.issue.closeReason;
        await this.checkIfPlanSaved(resultObj, jPlan);
      } else if (issueObj.action == "CreateMR") {
        let maintenanceCreated = await maintenanceService.createNewMaintenanceFromIssue(issueObj.issue, user, jPlan);
        if (maintenanceCreated) {
          jPlan.tasks[tIndex].issues[iIndex].status = "Resolved";
          toRemoveFromPlan = true;
          jPlan.tasks[tIndex].issues[iIndex].mrNumber = maintenanceCreated.mrNumber;
          jPlan.tasks[tIndex].issues[iIndex].maintenanceId = maintenanceCreated._id;
          jPlan.mrNumber = maintenanceCreated.mrNumber;
          await this.checkIfPlanSaved(resultObj, jPlan);
        } else {
          resultObj.errorVal = "Maintenance Creation Failed";
          resultObj.status = 500;
        }
      } else if (issueObj.action == "serverChanges") {
        jPlan.tasks[tIndex].issues[iIndex].serverObject = issueObj.issue.serverObject;
        jPlan.markModified("tasks");

        if (issueObj.maintenanceAssign) {
          let maintenanceToUp = await MaintenanceModel.findOne({ issueId: issueObj._id }).exec();
          if (maintenanceToUp) {
            maintenanceToUp.maintenanceRole = issueObj.issue.serverObject.maintenanceRole;
          } else {
            maintenanceToUp = await maintenanceService.createNewMaintenanceFromIssue(issueObj.issue, user, jPlan);
            if (maintenanceToUp) {
              jPlan.tasks[tIndex].issues[iIndex].status = "Resolved";
              toRemoveFromPlan = true;
              jPlan.tasks[tIndex].issues[iIndex].mrNumber = maintenanceToUp.mrNumber;
              jPlan.tasks[tIndex].issues[iIndex].maintenanceId = maintenanceToUp._id;
              jPlan.mrNumber = maintenanceToUp.mrNumber;
              await this.checkIfPlanSaved(resultObj, jPlan);
            } else {
              resultObj.errorVal = "Maintenance Creation Failed";
              resultObj.status = 500;
            }
          }
          if (issueObj.capitalPlanAssign) {
            let WorkOrderModel = ServiceLocator.resolve("WorkOrderModel");
            let workOrder = await WorkOrderModel.findOne({ _id: issueObj.capitalPlan }).exec();
            if (workOrder) {
              if (workOrder.status == "Planned") {
                workOrder.dueDate && (maintenanceToUp.dueDate = workOrder.dueDate);
                maintenanceToUp.status = "Planned";
              }
              maintenanceToUp.workOrderNumber = workOrder.mwoNumber;
              workOrder.maintenanceRequests.push(maintenanceToUp.mrNumber);
              workOrder.markModified("maintenanceRequests");
              await workOrder.save();
            }
          }
          await maintenanceToUp.save();
        }
        await this.checkIfPlanSaved(resultObj, jPlan);
        if (toRemoveFromPlan) {
          workPlanTemplateService.removeResolvedDefectsFromTemplate(
            issueObj.issue.issueId,
            issueObj.issue.unit.id,
            issueObj.issue.timeStamp,
          );
        }
      } else {
        resultObj = { errorVal: "No Action Found", status: 500 };
      }
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("journeyPlan.service.updateIssue.catch error:", err.toString());
    }
    return resultObj;
  }
  async updateJPlanIssue(jPlan) {
    let saved = null;
    try {
      jPlan.markModified("tasks");
      saved = await jPlan.save();
    } catch (err) {
      saved = null;
      console.log("journeyPlan.service error: ", err.toString());
    }
    return saved;
  }
  async checkIfPlanSaved(resultObj, jPlan) {
    let planSaved = await this.updateJPlanIssue(jPlan);
    if (planSaved) {
      resultObj.value = planSaved;
      resultObj.status = 200;
    } else {
      resultObj.errorVal = "Issue Can Not be Updated";
      resultObj.status = 500;
    }
  }
  async getAllIssues(query) {
    let resultObj = {},
      JourneyPlanModel,
      dateRange,
      issues,
      jPlans,
      criteria,
      jIndex,
      tIndex,
      iIndex;

    JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    if (query.dateRange) {
      dateRange = JSON.parse(query.dateRange);
    }
    try {
      if (dateRange) {
        criteria = {};
        jPlans = await JourneyPlanModel.find(criteria).exec();
      } else {
        jPlans = await JourneyPlanModel.find().exec();
      }
      issues = [];
      jIndex = -1;
      tIndex = -1;
      iIndex = -1;
      if (jPlans) {
        for (let plan of jPlans) {
          jIndex++;
          tIndex = -1;
          if (plan.tasks) {
            for (let task of plan.tasks) {
              tIndex++;
              iIndex = -1;
              if (task.issues) {
                for (let issue of task.issues) {
                  iIndex++;
                  let issuePush = true;
                  dateRange &&
                    (issuePush =
                      new Date(issue.timeStamp) > new Date(dateRange.from) && new Date(issue.timeStamp) < new Date(dateRange.to));
                  issuePush &&
                    issues.push({
                      ...issue,
                      ...{
                        planId: plan._id,
                        taskId: task.taskId,
                        index: jIndex + "-" + tIndex + "-" + iIndex,
                        date: plan.date,
                        user: plan.user,
                        uniqueGuid: guid(),
                        lineName: plan.lineName,
                        lineId: plan.lineId,
                        weatherConditions: task.weatherConditions,
                        temperature: task.temperature,
                        tempUnit: task.tempUnit,
                      },
                    });
                }
              }
            }
          }
        }
      }
      resultObj.value = issues;
      resultObj.status = 200;
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("journeyPlan.service error: ", err.toString());
    }
    return resultObj;
  }

  async findIssueByMRno(inspectionid, mrNumber) {
    let JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    let inspection = await JourneyPlanModel.findOne({ _id: inspectionid });
    let targetIssue = null,
      jIndex = 0,
      tIndex = -1,
      iIndex = -1;

    if (inspection) {
      if (inspection.tasks)
        for (let t of inspection.tasks) {
          tIndex++;
          iIndex = -1;
          if (t.issues)
            for (let issue of t.issues) {
              iIndex++;
              if (issue.mrNumber && issue.mrNumber === mrNumber) {
                targetIssue = { ...issue, index: jIndex + "-" + tIndex + "-" + iIndex, planId: inspection._id };
                break;
              }
            }
        }
    }

    return targetIssue;
  }
  async getJourneyIssueById(jPId, issueId) {
    let JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    let jPlan = await JourneyPlanModel.findOne({ _id: jPId });

    let issue = null;

    if (jPlan && jPlan.tasks && jPlan.tasks.length) {
      for (let [i, v] of jPlan.tasks.entries()) {
        if (v.issues && v.issues.length) {
          let issueIndex = v.issues.findIndex((issue) => issue.issueId == issueId);
          if (issueIndex !== -1) {
            issue = v.issues[issueIndex];
            issue.index = `0-${i}-${issueIndex}`;
            issue.lineId = jPlan.lineId;
            break;
          }
        }
      }
    }

    return issue;
  }
  async getInspections(body) {
    let resultObj, ids, JourneyPlanModel, inspections;
    resultObj = {};
    JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    ids = [];
    try {
      if (body.reportFilter) {
        ids = body.reportFilter;
      }
      inspections = await JourneyPlanModel.find({ _id: { $in: ids } });

      resultObj.value = inspections;
      resultObj.status = 200;
    } catch (err) {
      console.log("err in getInspections: ", err);
    }
    return resultObj;
  }
}

export default JourneyPlanService;

// async function foreCastPlan(dateRange, workPlans) {
//   let inspections = [];
//   for (let plan of workPlans) {
//     if (plan.startDate || plan.nextInspectionDate) {
//       if (new Date(dateRange.to) > new Date(dateRange.today)) {
//         let fromTodayInspections = await futureinspections(dateRange, plan, inspections);
//       }
//       if (new Date(dateRange.from) < new Date(dateRange.today)) {
//         // Past Inspections Implementation (business logic require discussion)
//       }
//     }
//   }
//   // console.log(inspections);
//   return inspections;
// }
// // iterate over dateTocheck to see that it falls between today and future "to" date, if so then create the expected inspection and send it back
// async function futureinspections(dateRange, c_plan, inspections) {
//   let NEXT_INSPECTION = c_plan.nextInspectionDate;
//   const FIRST_INSPECTION = c_plan.startDate;
//   const FREQUENCY = c_plan.inspectionFrequency;
//   const DATE_FILTER_TO = new Date(dateRange.to);
//   const DATE_FILTER_FROM = new Date(dateRange.from);
//   const DATE_FILTER_TODAY = new Date(dateRange.today);
//   let dateTocheck = NEXT_INSPECTION;
//   if (!c_plan.nextInspectionDate) {
//     dateTocheck = FIRST_INSPECTION;
//   }
//   let count = 100;
//   while (dateTocheck < DATE_FILTER_TO && FREQUENCY > 0 && count > 0) {
//     // if (dateTocheck > DATE_FILTER_TODAY) {
//     // console.log("In Future", dateTocheck);
//     let user = null;
//     if (c_plan.modifications) {
//       let momentDate = moment.utc(dateTocheck.getTime()).format("YYYYMMDD");
//       let futureChange_date = c_plan.modifications[momentDate];
//       if (futureChange_date && futureChange_date.user) {
//         user = futureChange_date.user;
//       }
//     }
//     let inspection = {
//       user: c_plan.user,
//       tasks: c_plan.tasks,
//       date: new Date(dateTocheck.getTime()),
//       title: c_plan.title,
//       workplanTemplateId: c_plan._id,
//       lineId: c_plan.lineId,
//       lineName: c_plan.lineName,
//       status: dateTocheck > DATE_FILTER_TODAY ? "Future Inspection" : "Overdue",
//     };
//     if (user) {
//       inspection.temp_user = user;
//     }
//     if (dateTocheck > DATE_FILTER_FROM) {
//       inspections.push(inspection);
//     }
//     //}
//     dateTocheck = new Date(dateTocheck.setDate(dateTocheck.getDate() + FREQUENCY));
//     count--;
//   }
// }
function checkReportDataExist(reportId, inspection) {
  let valid = true;
  let validTask = inspection && inspection.tasks && inspection.tasks[0];
  if (reportId) {
    if (!validTask) {
      valid = false;
    } else if (reportId == "1" || reportId == 1) {
      // Line Inspection Report
    } else if (reportId == "2" || reportId == 2 || reportId == "3" || reportId == 3) {
      // Switch Inspection Form //  // Detailed Switch Inspection Form
      let validEntries = _.filter(validTask.units, (unit) => {
        let validAtype =
          unit.assetType === "Switch" ||
          unit.assetType === "Side Track" ||
          unit.assetType === "Switch LH" ||
          unit.assetType === "Switch RH" ||
          unit.assetType === "Customer Switch LH" ||
          unit.assetType === "Customer Switch RH" ||
          unit.assetType === "Turnout 2" ||
          unit.assetType === "Turnout 3" ||
          unit.assetType === "Customer Switch" ||
          unit.assetType === "Turnout 4";

        let appForm = validAtype && unit.appForms && unit.appForms.length > 0;
        return validAtype && appForm;
      });
      validEntries < 1 && (valid = false);
    } else if (reportId == "4" || reportId == 4) {
      // Track Disturbance Form
      let TrackDistForms = _.filter(validTask.appForms, (appForm) => {
        return appForm.id == "form1";
      });
      TrackDistForms.length < 1 && (valid = false);
    }
  }

  return valid;
}

function reportsCriteria(reportId) {
  let crit = {
    6: { $or: [{ "tasks.units.assetType": "Bridge" }, { "tasks.units.assetType": "Culvert" }], "tasks.units.appForms.id": "etrBridgeForm" },
    8: {
      "tasks.units.assetType": {
        $in: [
          "Switch RH",
          "Switch LH",
          "Customer Switch LH",
          "Customer Switch RH",
          "Switch",
          "Turnout",
          "Turnout 2",
          "Turnout 3",
          "Turnout 4",
          "Yard Switch",
        ],
      },
      "tasks.units.appForms.id": { $in: ["etrRHSwitchForm", "etrLHSwitchForm", "onrTurnoutForm", "nopbSwitchForm"] },
    },
    9: { "jobBriefings.0": { $exists: true } },
    10: {
      "tasks.units.assetType": {
        $in: [
          "Switch RH",
          "Switch LH",
          "Customer Switch LH",
          "Customer Switch RH",
          "Switch",
          "Turnout",
          "Turnout 2",
          "Turnout 3",
          "Turnout 4",
        ],
      },
      "tasks.units.appForms.id": { $in: ["monthlydetailedformONR"] },
    },
  };
  return crit[reportId];
}

function filteredIssues(plan) {
  let issues = [];
  if (plan.tasks && plan.tasks[0] && plan.tasks[0].issues) {
    for (let issue of plan.tasks[0].issues) {
      if (issue && issue.issueId) {
        issues.push({
          issueId: issue.issueId,
          defectCodes: issue.defectCodes,
          unit: { assetType: issue.unit.assetType },
          status: issue.status,
        });
      } else {
        let logger = ServiceLocator.resolve("logger");
        logger.error(`journeyPlan.service.js.filteredIssues.error: Empty issue found in plan ${plan._id.toString()}`);
      }
    }
  }

  return issues;
}
