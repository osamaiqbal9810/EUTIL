import * as types from "../ActionTypes/actionTypes.js";

export default function(
  state = {
    isFetching: false,
    isAuthenticated: localStorage.getItem("access_token") ? true : false,
    authenticated: false,
    actionType: "",
    errorMessage: "",
    user: {},
  },
  action,
) {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        user: action.creds,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.LOGIN_SUCCESS:
      localStorage.setItem("access_token", action.response.token);
      const toJson = JSON.stringify(action.response.result);
      localStorage.setItem("loggedInUser", toJson);
      //localStorage.setItem('permissions', JSON.stringify(action.response.result.userGroup.permissions));
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        user: action.response.result,
        isSuccess: true,
        actionType: action.type,
      };
    case types.LOGIN_FAILURE:
      action.error.message = "Email or Password Invalid !";
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to login.",

        isSuccess: false,
        actionType: action.type,
      };
    case types.LOGOUT_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.LOGOUT_SUCCESS: //localStorage.setItem('permissions', JSON.stringify(action.response.result.userGroup.permissions));
      /*localStorage.setItem('access_token', action.response.token);
            const toJson = JSON.stringify(action.response.result);
            localStorage.setItem('loggedInUser', toJson);
            */ return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        user: null,
        isSuccess: true,
        actionType: action.type,
      };
    case types.LOGOUT_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to logout.",
        isSuccess: false,
        user: null,
        actionType: action.type,
      };
    default:
      return state;
  }
}
