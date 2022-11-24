import WorkPlanTemplateService from "./api/wPlanTemplate/wPlanTemplate.service";
import TaskService from "./api/task/task.service";
import WPTService from "./service/WPTService";
import ValidationUtils from "../utilities/ValidationUtils";
import JourneyPlanService from "./api/journeyPlan/journeyPlan.service";
import TestScheduleService from "./api/testSchedules/testSchedules.service";
let ServiceLocator = require("../framework/servicelocator");
export var timpsApp = log4js => {
  let validationUtil = new ValidationUtils();
  ServiceLocator.register("ValidationUtil", validationUtil);
  // let workplanTemplateAssetGroupService = new WPTService(log4js.getLogger("WPTService"), validationUtil);
  // ServiceLocator.register("WorkplanTemplateService", workplanTemplateAssetGroupService);
  let workPlanTemplateService = new WorkPlanTemplateService();
  ServiceLocator.register("WorkPlanTemplateService", workPlanTemplateService);
  let taskService = new TaskService();
  ServiceLocator.register("TaskService", taskService);
  let journeyPlanService = new JourneyPlanService();
  ServiceLocator.register("JourneyPlanService", journeyPlanService);
  let testScheduleService = new TestScheduleService();
  ServiceLocator.register("TestScheduleService", testScheduleService);
};

export var timpsStatus = true;
