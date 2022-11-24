import * as types from "../ActionTypes/actionTypes.js";
import { CALL_API } from "../middleware/api";

export function getRunOfLines() {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };

  return {
    [CALL_API]: {
      endpoint: "runNumber/runLines",
      authenticated: true,
      config: options,
      types: [types.GET_LINE_RUN_REQUEST, types.GET_LINE_RUN_SUCCESS, types.GET_LINE_RUN_FAILURE],
    },
  };
}

export function getRuns() {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };

  return {
    [CALL_API]: {
      endpoint: "runNumber/runLines",
      authenticated: true,
      config: options,
      types: [types.GET_RUN_REQUEST, types.GET_RUN_SUCCESS, types.GET_RUN_FAILURE],
    },
  };
}
