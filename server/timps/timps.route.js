let journeyPlan_route = require("./api/journeyPlan/index");
let workPlanTemplateTask_route = require("./api/workPlanTemplateTask/index");
let journeyPlanTask_route = require("./api/journeyPlanTask/index");
let api_routes = require("../routes/api-routes");
let track_route = require("./api/track/index");
let wPlanSchedules_route = require("./api/wPlanSchedules/index");
let workPlanTemplate_route = require("./api/wPlanTemplate/index");
let testSchedule_route = require("./api/testSchedules/index");
let ativData_route = require("./api/ATIVData/index");
module.exports = function () {
  api_routes.use("/journeyPlan", journeyPlan_route);
  api_routes.use("/track", track_route);
  api_routes.use("/workPlanTemplate", workPlanTemplate_route);
  api_routes.use("/workPlanTemplateTask", workPlanTemplateTask_route);
  api_routes.use("/journeyPlanTask", journeyPlanTask_route);
  api_routes.use("/wPlanSchedules", wPlanSchedules_route);
  api_routes.use("/testSchedule", testSchedule_route);
  api_routes.use("/ATIVData", ativData_route);
};
