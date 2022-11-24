let ServiceLocator = require("../../../framework/servicelocator");
import _ from "lodash";
import { isJSON } from "../../../utilities/isJson";
var turf = require("@turf/turf");
export default class TaskService {
  getUnitOfMeasurements(lineAsset) {
    let uom = "miles";
    if (
      lineAsset &&
      lineAsset.systemAttributes &&
      lineAsset.systemAttributes.milepostUnit &&
      lineAsset.systemAttributes.milepostUnit.value &&
      typeof lineAsset.systemAttributes.milepostUnit.value === "string"
    ) {
      uom = lineAsset.systemAttributes.milepostUnit.value;
    }
    return uom;
  }
  async createTask(receievedObj) {
    let resultObj = {};
    let taskBelongTo = receievedObj.type;
    let modelFind;
    let wPlanModel = ServiceLocator.resolve("WorkPlanTemplateModel");

    let journeyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    let AssetsModel = ServiceLocator.resolve("AssetsModel");
    if (taskBelongTo == "WorkPlan") {
      modelFind = wPlanModel;
    }
    if (taskBelongTo == "JourneyPlan") {
      modelFind = journeyPlanModel;
    }
    if (modelFind) {
      try {
        let plan = await modelFind.findById(receievedObj.templateId).exec();
        if (plan) {
          let locationUnit = await AssetsModel.findById(plan.lineId);
          if (locationUnit) {
            let taskToPush = await this.calculateTaskData(receievedObj.task, locationUnit);
            plan.tasks.push(taskToPush);
          }
          plan.markModified("tasks");
          try {
            let updatedPlan = await plan.save();
            resultObj = { value: updatedPlan, status: 200 };
          } catch (err) {
            console.log("Error At Saving Plan In createTask : " + err);
            resultObj = { errorVal: err, status: 400};//err.status };
          }
        }
      } catch (error) {
        console.log("Error At Finding Plan In createTask : " + error);
        resultObj = { errorVal: error, status: 400};//error.status };
      }
    } else {
      console.log("Code Error in task.service.js : WorkPlan or JourneyPlan model isnt specified");
      resultObj = {errorVal:'Internal server error', status: 500};
    }
    return resultObj;
  }

  async updateTask(receievedObjTask, templateId) {
    let resultObj = {};
    let taskBelongTo = receievedObjTask.type;
    let modelFind;
    let wPlanModel = ServiceLocator.resolve("WorkPlanTemplateModel");
    let journeyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    if (taskBelongTo == "WorkPlan") {
      modelFind = wPlanModel;
    }
    if (taskBelongTo == "JourneyPlan") {
      modelFind = journeyPlanModel;
    }
    if (modelFind) {
      try {
        let plan = await modelFind.findById(templateId).exec();
        if (plan) {
          let resultIndex = _.findIndex(plan.tasks, { taskId: receievedObjTask.task.taskId });
          if (resultIndex >= 0) {
            plan.tasks[resultIndex] = receievedObjTask.task;
            plan.markModified("tasks");
            try {
              let updatedPlan = await plan.save();
              resultObj = { value: updatedPlan, status: 200 };
            } catch (err) {
              console.log("Error At Saving Plan In createTask : " + err);
              resultObj = { errorVal: err, status: err.status };
            }
          } else {
            resultObj = { errorVal: "Task Not Found In WorkPlan : " + plan._id, status: 404 };
          }
        }
      } catch (error) {
        console.log("Error At Finding Plan In createTask : " + error);
        resultObj = { errorVal: error, status: error.status };
      }
    } else {
      console.log("Code Error in task.service.js : WorkPlan or JourneyPlan model isnt specified");
      resultObj = { errorVal: "Server Error ", status: 500 };
    }
    return resultObj;
  }

  async deleteTask(receievedObjTask, templateId) {
    let resultObj = {};
    let taskBelongTo = receievedObjTask.type;
    let modelFind;
    let wPlanModel = ServiceLocator.resolve("WorkPlanTemplateModel");
    let journeyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    if (taskBelongTo == "WorkPlan") {
      modelFind = wPlanModel;
    }
    if (taskBelongTo == "JourneyPlan") {
      modelFind = journeyPlanModel;
    }
    if (modelFind) {
      try {
        let plan = await modelFind.findById(templateId).exec();
        if (plan) {
          let resultIndex = _.findIndex(plan.tasks, { taskId: receievedObjTask.task.taskId });
          if (resultIndex >= 0) {
            _.remove(plan.tasks, { taskId: receievedObjTask.task.taskId });
            plan.markModified("tasks");
            try {
              let updatedPlan = await plan.save();
              resultObj = { value: updatedPlan, status: 200 };
            } catch (err) {
              console.log("Error At Saving Plan In createTask : " + err);
              resultObj = { errorVal: err, status: err.status };
            }
          } else {
            resultObj = { errorVal: "Task Not Found In WorkPlan : " + plan._id, status: 404 };
          }
        }
      } catch (error) {
        console.log("Error At Finding Plan In createTask : " + error);
        resultObj = { errorVal: error, status: error.status };
      }
    } else {
      console.log("Code Error in task.service.js : WorkPlan or JourneyPlan model isnt specified");
      resultObj = { errorVal: "Server Error ", status: 500 };
    }
    return resultObj;
  }
  async calculateTaskData(task, locationUnit) {
    let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
    let taskToReturn = { ...task };
    let unitForTask = {
      id: locationUnit._id,
      unitId: locationUnit.unitId,
      start: locationUnit.start,
      end: locationUnit.end,
      coordinates: locationUnit.coordinates,
      parent_id: locationUnit.parentAsset,
      unitId: locationUnit.unitId,
      assetType: locationUnit.assetType,
    };
    let locationGeoJsonParsed = isJSON(locationUnit.attributes.geoJsonCord) ? JSON.parse(locationUnit.attributes.geoJsonCord) : null;
    // unit start end calculation

    let uom = this.getUnitOfMeasurements(locationUnit);

    let coordinatesStartEnd = await workPlanTemplateService.getCoordinatesArray(
      [
        ["", ""],
        ["", ""],
      ],
      locationGeoJsonParsed,
      locationUnit.start,
      locationUnit.end,
      locationUnit.start,
      uom,
    );
    unitForTask.coordinates = coordinatesStartEnd;
    // location milepost coordinates
    let lineGeodata = turf.lineString(locationGeoJsonParsed.features[0].geometry.coordinates, { name: "line 1" });
    let specialLocationStart = task.locationSpecial && task.locationSpecial.start ? parseFloat(task.locationSpecial.start) : 0;
    let specialLocationEnd = task.locationSpecial && task.locationSpecial.end ? parseFloat(task.locationSpecial.end) : 0;
    taskToReturn.locationSpecial.lineCords = turf.lineSliceAlong(lineGeodata, specialLocationStart, specialLocationEnd, {
      units: uom,
    });
    taskToReturn.lineCords = lineGeodata;
    taskToReturn.startLoc = turf.along(lineGeodata, specialLocationStart, { units: uom });
    taskToReturn.endLoc = turf.along(lineGeodata, specialLocationEnd, { units: uom });
    taskToReturn.units.push(unitForTask);
    return taskToReturn;
  }
}
