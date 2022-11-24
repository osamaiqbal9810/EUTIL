import * as types from "../ActionTypes/actionTypes.js";
import { CALL_API } from "../middleware/api";

export function updateTemplateSort(templatesChanged) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "PUT",
    body: JSON.stringify(templatesChanged),
  };
  return {
    [CALL_API]: {
      endpoint: "workPlanTemplate/",
      authenticated: true,
      types: [types.TEMPLATES_SORT_UPDATE_REQUEST, types.TEMPLATES_SORT_UPDATE_SUCCESS, types.TEMPLATES_SORT_UPDATE_FAILURE],
      config: options,
    },
  };
}

export function inspectorsPlan(users) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  let sringifyUsers = JSON.stringify(users);
  return {
    [CALL_API]: {
      endpoint: "workPlanTemplate/userstemplate/" + sringifyUsers,
      authenticated: true,
      config: options,
      types: [types.GET_PLAN_USERS_REQUEST, types.GET_PLAN_USERS_SUCCESS, types.GET_PLAN_USERS_FAILURE],
    },
  };
}

export function updateWorkPlanFutureInspection(updatedWorkplanChanges) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "PUT",
    body: JSON.stringify(updatedWorkplanChanges),
  };
  return {
    [CALL_API]: {
      endpoint: "workPlanTemplate/updatefutureInspection",
      authenticated: true,
      types: [types.TEMPLATES_UPDATE_TEMP_REQUEST, types.TEMPLATES_UPDATE_TEMP_SUCCESS, types.TEMPLATES_UPDATE_TEMP_FAILURE],
      config: options,
    },
  };
}
