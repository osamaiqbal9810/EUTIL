import * as types from "../ActionTypes/actionTypes.js";
import { CALL_API } from "../middleware/api";
export function getDashboardData() {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };

  return {
    [CALL_API]: {
      endpoint: "dashboard/",
      authenticated: true,
      config: options,
      types: [types.GET_DASHBOARD_DATA_REQUEST, types.GET_DASHBOARD_DATA_SUCCESS, types.GET_DASHBOARD_DATA_FAILURE],
    },
  };
}
