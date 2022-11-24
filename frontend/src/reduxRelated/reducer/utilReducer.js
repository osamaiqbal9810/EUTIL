import * as types from "../ActionTypes/actionTypes.js";

export default function (
  state = {
    actionType: "",
    trackPageNum: 0,
    planPageNum: 0,
    planPageSize: 30,
    trackPageSize: 10,
    planFilter: "all",
  },
  action,
) {
  switch (action.type) {
    case types.SAVE_TRACK_PAGE_NUMBER:
      return {
        ...state,
        trackPageNum: action.page,
        trackPageSize: action.pageSize,
        actionType: action.type,
      };
    case types.SAVE_WORKPLAN_PAGE_NUMBER:
      return {
        ...state,
        planPageNum: action.page,
        planPageSize: action.pageSize,
        actionType: action.type,
        planFilter: action.planFilter,
      };
    case types.CLEAR_TRACK_PAGE_NUMBER:
      return {
        ...state,
        trackPageNum: 0,
        actionType: action.type,
      };
    case types.CLEAR_WORKPLAN_PAGE_NUMBER:
      return {
        ...state,
        planPageNum: 0,
        planFilter: "all",
        actionType: action.type,
      };
    default:
      return state;
  }
}
