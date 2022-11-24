import * as types from "../ActionTypes/actionTypes.js";

export default function(
  state = {
    authenticated: false,
    isAuthenticated: !!localStorage.getItem("access_token"),
    actionType: "",
    selectedLine: {},
    multiData: [],
  },
  action,
) {
  switch (action.type) {
    case types.SET_SELECTED_LINE:
      return {
        ...state,
        selectedLine: action.line,
        actionType: action.type,
      };
    case types.CLEAR_SELECTED_LINE:
      return {
        ...state,
        selectedLine: {},
        actionType: action.type,
      };
    case types.GET_MULTIPLE_LINES_DATA_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_MULTIPLE_LINES_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        multiData: action.response,
      };
    case types.GET_MULTIPLE_LINES_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: action.error || "Error: Unable to Get Line Data.",
        isSuccess: false,
        actionType: action.type,
      };
    default:
      return state;
  }
}
