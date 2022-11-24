import RunNumber from "./../../components/RunNumber/index";
import RunNumberDetail from "./../../components/RunNumber/RunDetail/index";
import WorkPlanTemplate from "./../../components/WorkPlanTemplate/index";
import Team from "./../../components/Team/index";
import WorkPlanTemplateDetail from "./../../components/WorkPlanTemplate/JourneyPlanDetail/index";


export const timpsSetupRoutes = [
  {
    path: "/setup/inspectionplan",
    component: WorkPlanTemplate,
    permissionCheckFirstArg: "WORKPLAN",
    permissionCheckSecondArg: "view",
    permissionCheck: true,
  },
  {
    path: "/setup/inspectionplans/:id",
    component: WorkPlanTemplateDetail,
    permissionCheckFirstArg: "WORKPLAN",
    permissionCheckSecondArg: "view",
    permissionCheck: true,
  },


  //{ path: "/setup/team", component: Team },
  { path: "/setup/run", component: RunNumber, permissionCheck: false },
  { path: "/setup/runs/:id", component: RunNumberDetail, permissionCheck: false },
];
