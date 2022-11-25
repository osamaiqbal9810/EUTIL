import * as CURDACTIONS from "./types";
import { CALL_API } from "reduxRelated/middleware/api";

export let curdActions = {};

export function createActionTypes(name, actionsObj, apiName) {

  let actions = {};
  let apiPath = apiName !== undefined && apiName !== null ? apiName : name;
  let actionTasks = {};
  let actionsCustom = [];
  let capName = name.toUpperCase();
  let firstLetterCap = name.charAt(0).toUpperCase() + name.slice(1);
  if (actionsObj.create) {
    actionTasks = {
      ...actionTasks,
      [capName + "_CREATE_REQUEST"]: capName + "_CREATE_REQUEST",
      [capName + "_CREATE_SUCCESS"]: capName + "_CREATE_SUCCESS",
      [capName + "_CREATE_FAILURE"]: capName + "_CREATE_FAILURE",
    };
    actions["create" + firstLetterCap] = function (arg, cName) {
      let argCreate = cName ? { [cName]: arg } : { [name]: arg };
      const options = {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        method: "POST",
        body: JSON.stringify(argCreate),
      };
      return {
        [CALL_API]: {
          endpoint: apiPath,
          authenticated: true,
          types: [
            CURDACTIONS.commonTasks[capName + "_CREATE_REQUEST"],
            CURDACTIONS.commonTasks[capName + "_CREATE_SUCCESS"],
            CURDACTIONS.commonTasks[capName + "_CREATE_FAILURE"],
          ],
          config: options,
        },
      };
    };
  }
  if (actionsObj.update) {
    actionTasks = {
      ...actionTasks,
      [capName + "_UPDATE_REQUEST"]: capName + "_UPDATE_REQUEST",
      [capName + "_UPDATE_SUCCESS"]: capName + "_UPDATE_SUCCESS",
      [capName + "_UPDATE_FAILURE"]: capName + "_UPDATE_FAILURE",
    };
    actions["update" + firstLetterCap] = function (arg, id) {
      let paramId = id;
      if (!id) {
        paramId = arg._id;
      }
      const options = {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        method: "PUT",
        body: JSON.stringify(arg),
      };
      return {
        [CALL_API]: {
          endpoint: apiPath + "/" + paramId,
          authenticated: true,
          types: [
            CURDACTIONS.commonTasks[capName + "_UPDATE_REQUEST"],
            CURDACTIONS.commonTasks[capName + "_UPDATE_SUCCESS"],
            CURDACTIONS.commonTasks[capName + "_UPDATE_FAILURE"],
          ],
          config: options,
        },
      };
    };
  }
  if (actionsObj.read) {
    actionTasks = {
      ...actionTasks,
      [capName + "_READ_REQUEST"]: capName + "_READ_REQUEST",
      [capName + "_READ_SUCCESS"]: capName + "_READ_SUCCESS",
      [capName + "_READ_FAILURE"]: capName + "_READ_FAILURE",
      [capName + "S_READ_REQUEST"]: capName + "S_READ_REQUEST",
      [capName + "S_READ_SUCCESS"]: capName + "S_READ_SUCCESS",
      [capName + "S_READ_FAILURE"]: capName + "S_READ_FAILURE",
    };

    actions["get" + firstLetterCap + "s"] = function (arg) {
      let customEndpoint = apiPath; //+ '/' + arg; // ? '/' + arg : '';
      if (arg) {
        customEndpoint = apiPath + "/" + arg;
      }

      let actionTypes = [
        CURDACTIONS.commonTasks[capName + "S_READ_REQUEST"],
        CURDACTIONS.commonTasks[capName + "S_READ_SUCCESS"],
        CURDACTIONS.commonTasks[capName + "S_READ_FAILURE"],
      ];

      const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
      return {
        [CALL_API]: {
          endpoint: customEndpoint,
          authenticated: true,
          types: actionTypes,
          config: options,
        },
      };
    };

    actions["get" + firstLetterCap] = function (arg) {
      let customEndpoint = apiPath;
      let actionTypes = [
        CURDACTIONS.commonTasks[capName + "S_READ_REQUEST"],
        CURDACTIONS.commonTasks[capName + "S_READ_SUCCESS"],
        CURDACTIONS.commonTasks[capName + "S_READ_FAILURE"],
      ];
      if (arg) {
        customEndpoint = apiPath + "/" + arg;
        actionTypes = [
          CURDACTIONS.commonTasks[capName + "_READ_REQUEST"],
          CURDACTIONS.commonTasks[capName + "_READ_SUCCESS"],
          CURDACTIONS.commonTasks[capName + "_READ_FAILURE"],
        ];
      }
      const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
      return {
        [CALL_API]: {
          endpoint: customEndpoint,
          authenticated: true,
          types: actionTypes,
          config: options,
        },
      };
    };
  }
  if (actionsObj.delete) {
    actionTasks = {
      ...actionTasks,
      [capName + "_DELETE_REQUEST"]: capName + "_DELETE_REQUEST",
      [capName + "_DELETE_SUCCESS"]: capName + "_DELETE_SUCCESS",
      [capName + "_DELETE_FAILURE"]: capName + "_DELETE_FAILURE",
    };
    actions["delete" + firstLetterCap] = function (arg, id) {
      let paramId = id;
      if (!id) {
        paramId = arg._id;
      }
      const options = {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        method: "DELETE",
        body: JSON.stringify(arg),
      };
      return {
        [CALL_API]: {
          endpoint: apiPath + "/" + paramId,
          authenticated: true,
          types: [
            CURDACTIONS.commonTasks[capName + "_DELETE_REQUEST"],
            CURDACTIONS.commonTasks[capName + "_DELETE_SUCCESS"],
            CURDACTIONS.commonTasks[capName + "_DELETE_FAILURE"],
          ],
          config: options,
        },
      };
    };
  }
  actionsCustom = actionsObj.others ? actionsObj.others : {};
  curdActions = { ...curdActions, ...actions };
  let actionRelated = { actionTypes: actionTasks, actions: actions, customAction: actionsCustom };
  return actionRelated;
}
