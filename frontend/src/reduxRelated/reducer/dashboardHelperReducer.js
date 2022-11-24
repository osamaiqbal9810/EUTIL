import * as types from "../ActionTypes/actionTypes.js";

export default function(
  state = {
    isFetching: false,
    authenticated: false,
    isAuthenticated: !!localStorage.getItem("access_token"),
    actionType: "",
    dashboardData: [],
  },
  action,
) {
  switch (action.type) {
    case types.GET_DASHBOARD_DATA_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_DASHBOARD_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        lineAssets: action.response,
        actionType: action.type,
      };
    case types.GET_DASHBOARD_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Dashboard Data.",
        isSuccess: false,
        actionType: action.type,
      };

    default:
      return state;
  }
}
