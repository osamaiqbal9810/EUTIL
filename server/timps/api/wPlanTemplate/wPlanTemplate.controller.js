let JourneyPlan = require("./wPlanTemplate.model");
//let SODModel = require("../SOD/SOD.model");
let ServiceLocator = require("../../../framework/servicelocator");
const { uniqueId } = require("lodash");
const moment = require("moment");

exports.all = async function (req, res, next) {
  let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
  let result = await workPlanTemplateService.getWorkplanTemplates(req.user);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }

  let templates = [];
  // fetchAlertsOfAllTemplates
  const alertService = ServiceLocator.resolve("AlertService");
  if (result.value && result.value.length) {
    for (let template of result.value) {
      template = template.toObject();
      let alerts = await alertService.fetchAlertsByModelId(template._id, {isClone: {$not: {$eq:true}}});
      if (alerts && alerts.length) {
        let alertRules = await alertService.getAlertJsonObjectFiltered(alerts);
        template.alertRules = alertRules;
      }
      templates.push(template);
    }
  }

  res.json(templates);
  // JourneyPlan.find().exec(function(err, plan) {
  //     let filteredWorkPlans = [];
  //     let adminCheck = req.user.isAdmin;
  //     let subdivisionUser = req.user.subdivision;
  //     if (!adminCheck && subdivisionUser) {
  //         plan.forEach(jplan => {
  //             if (subdivisionUser == jplan.subdivision) {
  //                 filteredWorkPlans.push(jplan);
  //             }
  //         });
  //     } else {
  //         filteredWorkPlans = plan;
  //     }
  //     if (err) {
  //         return handleError(res, err);
  //     }
  //     res.status(200);
  //     res.json(filteredWorkPlans);
  // });
};

exports.find = function (req, res, next) {
  JourneyPlan.findOne({ _id: req.params.id, isRemoved: !true }).exec(function (err, plan) {
    if (err) {
      return handleError(res, err);
    }
    res.status(200);
    res.json(plan);
  });
};

exports.create = async function (req, res, next) {
  let jPlan = req.body.workPlanTemplate;
  if (jPlan.type == 1) {
    let newJourneyPlan = new JourneyPlan(req.body.workPlanTemplate);
    newJourneyPlan.supervisor = req.user._id;
    newJourneyPlan.save(function (err, plan) {
      if (err) return handleError(res, err);
      res.status(200);
      return res.json(plan);
    });
  } else {
    let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
    let result = await workPlanTemplateService.createWorkplanTemplate(jPlan);
    res.status(result.status);
    if (result.errorVal && result.status == 500) {
      return res.send(result.errorVal);
    }
    let template = result.value;
    // we calculate short schedule time period for getting next due and expiry date fields in template and update the template
    if (template && template.inspectionFrequencies && template.inspectionFrequencies.length > 0) {
      let scheduleService = ServiceLocator.resolve("scheduleService");
      let freqPeriod;
      freqPeriod = {
        recurNumber: template.inspectionFrequencies[0].recurNumber && parseInt(template.inspectionFrequencies[0].recurNumber),
        recurPeriod: template.inspectionFrequencies[0].recurTimeFrame,
      };
      let dateRange = {
        from: moment(template.startDate),
        today: moment.utc().startOf("d"),
        to: moment(template.startDate).add(freqPeriod.recurNumber * 2, freqPeriod.recurPeriod),
      };
      let startDate = template.startDate;
      let workingDays = { holidays: [], weekOffDays: [] };
      let timezoneMethodService = ServiceLocator.resolve("timezoneMethodService");
      let locTimezone = template.locationTimeZone;
      if (!locTimezone) {
        let assetService = ServiceLocator.resolve("AssetsService");
        locTimezone = await assetService.getLocationTimeZone(template.lineId);
      }
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
      await workPlanTemplateService.checkWorkPlanNextDueExpiryDate(template, utils);
      await workPlanTemplateService.checkCurrentTimePeriodUpdate(template, utils);

      await template.save();
    }

    // When workplan template saved succeslly then Template alert logic will start
    // Below is the logic of alert entry into the database
    // *** Start of Alert Logic *** //
    let alertSetupValues = req.body.workPlanTemplate.alertSetupValues;

    //Check if user setup the alert for this template
    if (alertSetupValues) {
      let AssetsModel = ServiceLocator.resolve("AssetsModel");
      const asset = await AssetsModel.findById(result.value.lineId).exec();

      const timezone = asset.attributes && asset.attributes.timezone ? asset.attributes.timezone : "";

      let alertService = ServiceLocator.resolve("AlertService");
      alertService.addMultipleAlerts(alertSetupValues, result.value._id, "WorkPlanTemplateModel", result.value.title, timezone);
    }

    // *** End of Alert logic *** //

    let dashboardService = ServiceLocator.resolve("DashboardService");
    dashboardService.reCalculateDashboardV1Data();
    res.json(result.value);
  }
};

exports.update = async function (req, res, next) {
  let plan = await JourneyPlan.findOne({ _id: req.params.id }).exec();
  plan.user = req.body.user;
  plan.title = req.body.title;
  plan.dayFreq = req.body.dayFreq;
  plan.inspectionFrequency = req.body.inspectionFrequency;
  plan.minMaxAllowable = req.body.minMaxAllowable;
  plan.inspectionType = req.body.inspectionType;
  plan.inspectionFrequencies = req.body.inspectionFrequencies;
  plan.timeFrame = req.body.timeFrame;
  plan.perTime = req.body.perTime;
  plan.minDays = req.body.minDays;
  plan.workZone = req.body.workZone;
  plan.foulTime = req.body.foulTime;
  plan.watchmen = req.body.watchmen;
  plan.lineId = req.body.lineId;
  plan.lineName = req.body.lineName;
  plan.subdivision = req.body.subdivision;
  plan.inspectionAssets = req.body.inspectionAssets;
  if (plan.startDate != req.body.startDate) {
    // if startDate is changed, change the nextInspectionDate as well
    plan.startDate = req.body.startDate;
    plan.nextInspectionDate = plan.startDate;
  }
  if (req.body.maxAllowable) plan.maxAllowable = req.body.maxAllowable;
  let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
  let result = await workPlanTemplateService.createWorkplanTemplate(plan, req.body.startDate);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  let WPlanSchedulesModel = ServiceLocator.resolve("WPlanSchedulesModel");
  let wPlanSchedule = await WPlanSchedulesModel.findOne({ templateId: plan._id }).exec();
  if (wPlanSchedule) {
    wPlanSchedule.toRecalculate = true;
    await wPlanSchedule.save();
  }

  // When workplan template updates succeslly then Template alert update logic will start
  // Below is the logic of alert update into the database and cronjob
  // *** Start of Alert Logic *** //
  let alertSetupValues = req.body.alertSetupValues;

  //Check if user setup the alert for this template
  if (alertSetupValues) {
    let alertService = ServiceLocator.resolve("AlertService");
    let AssetsModel = ServiceLocator.resolve("AssetsModel");
    const asset = await AssetsModel.findById(result.value.lineId).exec();

    const timezone = asset.attributes && asset.attributes.timezone ? asset.attributes.timezone : "";

    alertService.updateMultipleAlerts(alertSetupValues, req.params.id, "WorkPlanTemplateModel", result.value.title, timezone);
  }

  let dashboardService = ServiceLocator.resolve("DashboardService");
  dashboardService.reCalculateDashboardV1Data();
  res.json(result.value);

  /*     plan.save(function(err, plan) {
      if (err) {
        return next(err);
      }
      res.status(200);
      return res.json(plan);
    });
 */
};

exports.update_old = function (req, res, next) {
  JourneyPlan.findOne({ _id: req.params.id }).exec(function (err, plan) {
    if (err) {
      return handleError(res, err);
    }
    plan.user = req.body.user;
    plan.title = req.body.title;
    plan.dayFreq = req.body.dayFreq;
    plan.inspectionFrequency = req.body.inspectionFrequency;
    plan.minMaxAllowable = req.body.minMaxAllowable;
    plan.inspectionType = req.body.inspectionType;

    //  plan.tasks = req.body.tasks;
    plan.workZone = req.body.workZone;
    plan.foulTime = req.body.foulTime;
    plan.watchmen = req.body.watchmen;
    plan.lineId = req.body.lineId;
    plan.lineName = req.body.lineName;
    plan.subdivision = req.body.subdivision;

    if (plan.startDate != req.body.startDate) {
      // if startDate is changed, change the nextInspectionDate as well
      plan.startDate = req.body.startDate;
      plan.nextInspectionDate = plan.startDate;
    }
    if (req.body.maxAllowable) plan.maxAllowable = req.body.maxAllowable;

    plan.save(function (err, plan) {
      if (err) {
        return next(err);
      }
      res.status(200);
      return res.json(plan);
    });
  });
};
exports.delete = async function (req, res, next) {
  let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
  let result = await workPlanTemplateService.deleteWorkPlanTemplate(req.params.id);

  // Delete alerts of this workplanTemplate
  let alertService = ServiceLocator.resolve("AlertService");
  await alertService.deleteAlertByModelId(req.params.id);

  res.status(result.status);
  if (result.errorVal) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
  // JourneyPlan.findById(req.params.id, (errFindP, plan) => {
  //   if (errFindP) {
  //     return handleError(res, errFindP);
  //   }
  //   if (plan) {
  //     let TrackModel = ServiceLocator.resolve("TrackModel");
  //     TrackModel.findById(plan.assetGroupId, (errorFindAG, assetGroup) => {
  //       if (errorFindAG) {
  //         JourneyPlan.deleteOne({ _id: req.params.id }, err => {
  //           if (err) {
  //             return handleError(res, err);
  //           }
  //           res.status(200);
  //           return res.json(true);
  //         });
  //       }
  //       if (assetGroup) {
  //         assetGroup.templateCreated = undefined;
  //         assetGroup.save((saveError, assetGroupUpdated) => {
  //           if (saveError) {
  //             return handleError(res, saveError);
  //           }
  //           JourneyPlan.deleteOne({ _id: req.params.id }, err => {
  //             if (err) {
  //               return handleError(res, err);
  //             }
  //             res.status(200);
  //             return res.json(true);
  //           });
  //         });
  //       } else {
  //         JourneyPlan.deleteOne({ _id: req.params.id }, err => {
  //           if (err) {
  //             return handleError(res, err);
  //           }
  //           res.status(200);
  //           return res.json(true);
  //         });
  //       }
  //     });
  //   }
  // });
};

exports.updateTemplatesPlanPrioritySorting = async function (req, res, next) {
  let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
  let result = await workPlanTemplateService.sortTemplates(req.user, req.body);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};

function handleError(res, err) {
  res.status(500);
  return res.send(err);
}

exports.usersTemplate = async function (req, res, next) {
  let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
  let result = await workPlanTemplateService.getUsersTemplates(req.params.users);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
exports.updateTemplatesTempChanges = async function (req, res, next) {
  let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
  let result = await workPlanTemplateService.updateTemplatesTempChanges(req.body);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
