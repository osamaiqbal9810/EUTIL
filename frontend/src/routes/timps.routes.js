import DashboardMain from "components/Dashboard/index.jsx";
import ReportModule from "../components/Reports";
import AssetTest from "../components/AssetTests/AssetTests";
import JourneyPlan from "components/JourneyPlan/index";
import Track from "components/Track/index";
import MaintenanceBacklog from "components/Maintenance/index";
import MaintenanceDetail from "components/Maintenance/MaintenanceDetail/index";
import WorkOrders from "components/WorkOrders/index";
import IssuesReports from "components/IssuesReports/index";
import IssueDetail from "components/IssuesReports/IssueDetail/index";
import FieldMonitoringV1 from "components/FieldMonitoringSubTables/index";

import TrackDetail from "components/Track/TrackDetail/index";
import JourneyPlanDetail from "components/JourneyPlan/JourneyPlanDetail/index";

import WOGISView from "components/WorkOrders/WOGISView";
import TrackChart from "components/TrackChart/index";

//TODO will be removed when YardReport is completed
import YardReport from "components/Reports/Timps/Yard/yardReport.jsx";
import TestForms from "../components/diagnostics/TestForms";

export const timpsRoutes = [
  { path: "/inspection", component: JourneyPlan },
  { path: "/inspections/:id", component: JourneyPlanDetail },
  { path: "/issuereports/:id", component: IssueDetail },
  { path: "/issuereports", component: IssuesReports },
  { path: "/fieldmonitoring", component: FieldMonitoringV1 },
  { path: "/track", component: Track },
  { path: "/tracks/:id", component: TrackDetail },
  { path: "/maintenancebacklog", component: MaintenanceBacklog },
  { path: "/maintenancebacklogs/:id", component: MaintenanceDetail },
  { path: "/workorders", component: WorkOrders },
  { path: "/workorderGISView/:id", component: WOGISView },
  { path: "/trackChart", component: TrackChart },
  { path: "/reports", component: ReportModule },
  { path: "/assetTest", component: AssetTest },
  //TODO will be removed when YardReport is completed
  { path: "/yardReport", component: YardReport },
  { path: "/appForms", component: TestForms },
];
