import * as types from "../ActionTypes/actionTypes.js";
import { CALL_API } from "../middleware/api";

export function getWorkOrders() {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };

  return {
    [CALL_API]: {
      endpoint: "Workorder/notStarted",
      authenticated: true,
      config: options,
      types: ["WORKORDERS_READ_REQUEST", "WORKORDERS_READ_SUCCESS", "WORKORDERS_READ_FAILURE"],
    },
  };
}