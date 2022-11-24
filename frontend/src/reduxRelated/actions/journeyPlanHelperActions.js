import * as types from "../ActionTypes/actionTypes.js";
import { CALL_API } from "../middleware/api";

export function createIssuesWorkorder(dataToSumit) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "POST",
    body: JSON.stringify(dataToSumit),
  };
  return {
    [CALL_API]: {
      endpoint: "journeyPlan/issueWorkorder",
      authenticated: true,
      types: [types.CREATE_ISSUES_WORKORDER_REQUEST, types.CREATE_ISSUES_WORKORDER_SUCCESS, types.CREATE_ISSUES_WORKORDER_FAILURE],
      config: options,
    },
  };
}