
import { updateApplicationLookups } from "../configurations/applicationlookupslist";
let WorkPlanTemplateModel = require("../../../timps/api/wPlanTemplate/wPlanTemplate.model");
let RunModel = require("../../../api/run/run.model");
let JourneyPlanModel = require("../../../timps/api/journeyPlan/journeyPlan.model");
var _ = require("lodash");

module.exports = { async up() {
    console.log("Update Script: Remove runs from WPTs, optimize workplantemplates");
    let criteria = { "runRanges.geoJsonCord.geometry.coordinates": { $exists: true, $not: { $size: 0 } } };
    //let  workPlans = await WorkPlanTemplateModel.find(criteria).limit(2).exec();
    let workPlans = await WorkPlanTemplateModel.find(criteria).exec();
    let runs = await RunModel.find({}).exec();
    //console.log("Workplans:" + journeyPlans.length);
    if (workPlans && workPlans.length) {
      for (let jIndex = 0; jIndex < workPlans.length; jIndex++) {
        let wPlan = workPlans[jIndex];
        let runRanges = wPlan.runRanges;
        let _runRange = {};
        for (let r1 = 0; r1 < runRanges.length; r1++) {
          let runRange = runRanges[r1];
          let rangeId = runRange.id;
          //let run = await RunModel.findOne({ "runRange.id": rangeId }).exec();
          let _runIndex = _.findIndex(runs, (run) => _.findIndex(run.runRange, (rr) => rr.id == rangeId) >= 0);
          let run = _runIndex >= 0 ? runs[_runIndex] : null;
          let runId = run ? run._id.toString() : "";
          //console.log("runId:" + runId);
          _runRange.id = rangeId;
          _runRange.runId = runId;
          runRanges[r1] = _runRange;
          wPlan.markModified("runRanges");
        }
        if (wPlan.tasks.length == 1) {
          if (_runRange) {
            let lineCord = { ..._runRange };
            lineCord.geometry = {
              type: "LineString",
              coordinates: [],
            };
            wPlan.tasks[0].lineCords = lineCord;
            wPlan.markModified("tasks");
          }
        }
        await wPlan.save();
        console.log("template run updated:" + wPlan.title);
      }
    }

    criteria = { "tasks.lineCords.geometry.coordinates": { $exists: true, $not: { $size: 0 } } };
    //let journeyPlans = await WorkPlanTemplateModel.find(criteria).limit(1).exec();
    let journeyPlans = await JourneyPlanModel.find(criteria).exec();
    //let jpTemplate = await WorkPlanTemplateModel.find({}).exec();
    //console.log("Workplans:" + journeyPlans.length);
    if (journeyPlans && journeyPlans.length) {
      for (let jIndex1 = 0; jIndex1 < journeyPlans.length; jIndex1++) {
        let jPlan = journeyPlans[jIndex1];
        let subCriteria = { _id: jPlan.workplanTemplateId };
        let jpTemplate = await WorkPlanTemplateModel.findOne(subCriteria).exec();
        if (jpTemplate) {
          let runRanges = jpTemplate.runRanges;
          if (runRanges && runRanges.length > 0) {
            let runRange = runRanges[0];
            let rangeId = runRange.id;
            let runId = runRange.runId;
            if (jPlan.tasks.length == 1) {
              let lineCords = {
                id: rangeId,
                runId: runId,
                geometry: {
                  type: "LineString",
                  coordinates: [],
                },
              };

              jPlan.tasks[0].lineCords = lineCords;
              jPlan.markModified("tasks");
              await jPlan.save();
              console.log("JPlan lineCords updated:", jPlan.title, jPlan._id.toString());
            }
          }
        }
      }
    }
    await updateApplicationLookups([{ listName: "AppPullList", code: "26", compare: "opt2" }]);
}
}