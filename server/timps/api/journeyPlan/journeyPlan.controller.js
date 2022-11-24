let JourneyPlan = require("./journeyPlan.model");
let ServiceLocator = require("../../../framework/servicelocator");

// async function getplanController(req, res, next) {
//   JourneyPlan.find().exec(async function(err, plan) {
//     let plans = await getplans(req.user, plan);
//     if (err) {
//       return handleError(res, err);
//     }
//     res.status(200);
//     res.json(plans);
//   });
// }
exports.multiLine = async function (req, res, next) {
  let joureyPlanService = ServiceLocator.resolve("JourneyPlanService");
  let resultObj = { status: 500, errorVal: "default" };
  let lines = [];
  if (req.query.lines) {
    lines = JSON.parse(req.query.lines);
  }
  try {
    resultObj = await joureyPlanService.multiLinePlans(lines);
  } catch (err) {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj.value);
  else res.json(resultObj.errorVal);
};

exports.all = async function (req, res, next) {
  let joureyPlanService = ServiceLocator.resolve("JourneyPlanService");
  let result = await joureyPlanService.getJourneyPlansAll(req.user, req.query);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
exports.getJourneyIssueById = async function (req, res, next) {
  let joureyPlanService = ServiceLocator.resolve("JourneyPlanService");
  let result = await joureyPlanService.getJourneyIssueById(req.params.jPId, req.params.issueId);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
exports.report = async function (req, res, next) {
  let joureyPlanService = ServiceLocator.resolve("JourneyPlanService");
  let result = await joureyPlanService.getJourneyPlansFind(req.user, req.query);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
exports.inspections = async function (req, res, next) {
  let joureyPlanService = ServiceLocator.resolve("JourneyPlanService");
  let result = await joureyPlanService.getInspections(req.body);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};

exports.getIssues = async function (req, res, next) {
  let journeyPlansService = ServiceLocator.resolve("JourneyPlanService");
  let result = await journeyPlansService.getAllIssues(req.query);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};

// async function getplans(user, plans) {
//   let filteredWorkPlans = [];
//   let adminCheck = user.isAdmin;
//   let subdivisionUser = user.subdivision;
//   if (!adminCheck && subdivisionUser) {
//     var jplan;
//     for (jplan in plans) {
//       let checkplan = plans[jplan];
//       let UserModel = ServiceLocator.resolve("userModel");
//       let userFound = await UserModel.findOne({ _id: checkplan.user.id }).exec();
//       if (userFound) {
//         if (subdivisionUser == userFound.subdivision) {
//           filteredWorkPlans.push(checkplan);
//         }
//       }
//     }
//   } else {
//     filteredWorkPlans = plans;
//   }
//   return filteredWorkPlans;
// }

exports.find = function (req, res, next) {
  JourneyPlan.findOne({ _id: req.params.id }).exec(function (err, plan) {
    if (err) {
      return handleError(res, err);
    }
    if (!plan) {
      res.status(404);
      return res.send("Plan not found");
    }
    res.status(200);
    return res.json(plan._doc);
  });
};

exports.create = function (req, res, next) {
  console.log(req.body.journeyPlan);
  let newJourneyPlan = new JourneyPlan(req.body.journeyPlan);
  newJourneyPlan.supervisor = req.user._id;
  newJourneyPlan.save(function (err, plan) {
    if (err) return handleError(res, err);
    res.status(200);
    return res.json(plan);
  });
};
exports.update = function (req, res, next) {
  JourneyPlan.findOne({ _id: req.params.id }).exec(function (err, plan) {
    if (err) {
      return handleError(res, err);
    }
    plan.user = req.body.user;
    plan.date = req.body.date;
    plan.title = req.body.title;
    // plan.tasks = req.body.tasks;
    plan.subdivision = req.body.subdivision;
    if (plan.tasks && plan.tasks.length > 0 && req.body.tasks && req.body.tasks.length > 0) {
      plan.tasks[0].includeInFRAReport = req.body.tasks[0].includeInFRAReport;
      plan.markModified("tasks");
    }
    plan.save(function (err, plan) {
      if (err) {
        return next(err);
      }
      res.status(200);
      return res.json(plan);
    });
  });
};
exports.delete = function (req, res, next) {
  JourneyPlan.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return handleError(res, err);
    }
    res.status(200);
    return res.json(true);
  });
};

function handleError(res, err) {
  res.status(500);
  return res.send(err);
}

exports.updateIssue = async function (req, res, next) {
  let joureyPlanService = ServiceLocator.resolve("JourneyPlanService");
  let result = await joureyPlanService.updateIssue(req.body.issuesReport, req.user);
  res.status(result.status);
  if (result.errorVal && result.status == 500) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};

exports.issueWorkorder = async function (req, res, next) {
  let joureyPlanService = ServiceLocator.resolve("JourneyPlanService");
  let workorderService = ServiceLocator.resolve("WorkOrderService");
  const { issuesReport, workorder } = req.body;
  let result = await joureyPlanService.updateIssue(issuesReport, req.user);
  const [jIndex, tIndex, iIndex] = issuesReport.issue.index.split("-");

  const mrNumber = result.value.tasks[tIndex].issues[iIndex].mrNumber;
  if (mrNumber) workorder.maintenanceRequests.push(mrNumber);

  let woResult = await workorderService.create(workorder, req.user);
  res.status(result.status);
  if ((result.errorVal && result.status == 500) || (woResult.errorVal && woResult.status == 500)) {
    return res.send(result.errorVal);
  }
  res.json({ issueReport: result.value, workorder: woResult.value });
};
