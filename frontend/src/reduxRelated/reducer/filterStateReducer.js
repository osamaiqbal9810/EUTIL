import * as types from "../ActionTypes/actionTypes.js";

export default function (
  state = {
    actionType: "",
    workPlan: {},
    journeyPlan: {},
    issuesFilter: null,
    assetsFilter: null,
    inspectionFilter: null,
    maintenanceFilter: null,
  },
  action,
) {
  switch (action.type) {
    case types.UPDATE_FILTER_STATE:
      return {
        ...state,
        [action.caller]: action.filterState,
      };
    default:
      return state;
  }
}
