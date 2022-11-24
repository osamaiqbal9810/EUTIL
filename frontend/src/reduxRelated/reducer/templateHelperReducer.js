import * as types from "../ActionTypes/actionTypes.js";

export default function(
  state = {
    isFetching: false,
    authenticated: false,
    isAuthenticated: !!localStorage.getItem("access_token"),
    actionType: "",
    errorMessage: "",
    noVar: "",
    workplans: [],
    updatedPlan: null,
  },
  action,
) {
  switch (action.type) {
    case types.GET_PLAN_USERS_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_PLAN_USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        workplans: action.response,
      };
    case types.GET_PLAN_USERS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Update Sort.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.TEMPLATES_SORT_UPDATE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.TEMPLATES_SORT_UPDATE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
      };
    case types.TEMPLATES_SORT_UPDATE_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Update Sort.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.TEMPLATES_UPDATE_TEMP_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.TEMPLATES_UPDATE_TEMP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        updatedPlan: action.response,
      };
    case types.TEMPLATES_UPDATE_TEMP_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Update Changes.",
        isSuccess: false,
        actionType: action.type,
      };
    default:
      return state;
  }
}
