import DashboardMain from "components/Dashboard/index.jsx";
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

import InsulationResistance from "components/Reports/sims/insulationResistance.jsx";
import RelayTest from "components/Reports/sims/relayTest.jsx";
import HighWayCrossing from "../components/Reports/sims/highWayCrossingCombined/highWayCrossing";
import AppReport from "../components/AppReports/appReport";

import ATIVData from "components/ATIV/index";
// import Board from "../wigets/Board/index.jsx"
import InspectionPlanDashboard from "../components/InspectionPlanDashboard/InspectionPlanDashboard";
import Safetybriefiing from "../components/jobBriefing/SafetyBreifing/SafetyBriefiing";
import ReportModule from "../components/Reports/index";
// import DetailedTurnoutReport from "../components/Reports/Timps/EtrSwitchReport/detailedTurnoutInspectionReportView.jsx"
// import CrossingWarning from "../components/Reports/sims/ontario/crossingWarning.jsx"
// import SignalStorageBattery from "../components/Reports/sims/ontario/signalStorageBattery.jsx"

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
  { path: "/inspectionplantests", component: InspectionPlanDashboard },
  { path: "/assetTest", component: AssetTest },
  //TODO will be removed when YardReport is completed
  { path: "/yardReport", component: YardReport },
  { path: "/appForms", component: TestForms },
  { path: "/insulationResistance", component: InsulationResistance },
  { path: "/relayTest", component: RelayTest },
  { path: "/highWayCrossing", component: HighWayCrossing },
  { path: "/appReport/:token", component: AppReport },
  { path: "/ativ-data", component: ATIVData },
  { path: "/jobBriefing", component: Safetybriefiing },
  // { path: "/board", component: Board },
  // { path: "/detailedTurnout", component: DetailedTurnoutReport },
  // { path: "/crossingWarning", component: CrossingWarning },
  // { path: "/signalStorageBattery", component: SignalStorageBattery }
];
