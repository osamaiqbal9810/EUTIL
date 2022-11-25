import * as types from "../ActionTypes/actionTypes.js";

export default function(
  state = {
    isFetching: false,
    authenticated: false,
    isAuthenticated: !!localStorage.getItem("access_token"),
    actionType: "",
    errorMessage: "",
    noVar: "",
    assetsReports: [],
  },
  action,
) {
  switch (action.type) {
    case types.GET_ASSETS_REPORT_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_ASSETS_REPORT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        assetsReports: action.response,
      };
    case types.GET_ASSETS_REPORT_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Update Sort.",
        isSuccess: false,
        actionType: action.type,
      };
    default:
      return state;
  }
}
