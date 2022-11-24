import lampRoute from './lamp.routes'
import commonRoute from './common.routes.js'
//let route = [];
/*if (timpsModule) {
  const timpsRoute = require('routes/timps.routes');
  route = [...timpsRoute.timpsRoutes, ...lampRoutes, ...commonRoutes]
} else {
  route = [...lampRoutes, ...commonRoutes]
}

export default route*/

const timpsRoute = require('routes/timps.routes');
export const timpsRoutes = [...timpsRoute.timpsRoutes, ...lampRoute, ...commonRoute];
export const lampRoutes =  [...lampRoute, ...commonRoute];
