import DashboardMain from "components/Dashboard/index.jsx";
import SetupPage from "components/SetupPage/index";
import DashboardTimeBased from "components/DashboardTimeBased/index";
import SignalStorageBattery from "../components/Reports/sims/ontario/signalStorageBattery.jsx";
import AppFormGenContainer from "../components/diagnostics/AppFormGen/AppFormGen";
const commonRoutes = [
  { path: "/setup", component: SetupPage },
  { path: "/dashboard", component: DashboardMain },
  { path: "/batterycard", component: SignalStorageBattery },
  { path: "/appFormGen", component: AppFormGenContainer },
  { path: "/", component: DashboardMain },
];

export default commonRoutes;
