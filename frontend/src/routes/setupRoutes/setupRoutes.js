import commonSetupRoutes from "./commonSetup.routes.js";
//import lampSetupRoutes from "./lampSetup.routes";
//let setupRoute = [];
//if (timpsModule) {
  const timpsRoute = require("routes/setupRoutes/timpsSetup.routes");
  export const timpsSetupRoute = [...timpsRoute.timpsSetupRoutes, ...commonSetupRoutes];
//} else {
  export const setupRoute = [...commonSetupRoutes];
//}

//export default setupRoute;
