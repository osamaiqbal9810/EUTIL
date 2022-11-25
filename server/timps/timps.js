import WorkPlanTemplateService from "./api/wPlanTemplate/wPlanTemplate.service";
import TaskService from "./api/task/task.service";
import JourneyPlanService from "./api/journeyPlan/journeyPlan.service";
import TestScheduleService from "./api/testSchedules/testSchedules.service";
let ServiceLocator = require("../framework/servicelocator");
export var timpsApp = () => {
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
