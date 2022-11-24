import DashboardMain from "components/Dashboard/index.jsx";
import SetupPage from "components/SetupPage/index";
import DashboardTimeBased from "components/DashboardTimeBased/index";
const commonRoutes = [
  { path: "/setup", component: SetupPage },
  { path: "/dashboard", component: DashboardMain },
  { path: "/", component: DashboardMain },
];

export default commonRoutes;
