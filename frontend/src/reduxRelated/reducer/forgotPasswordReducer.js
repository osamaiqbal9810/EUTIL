import * as types from "../ActionTypes/actionTypes.js";

export default function(
  state = {
    actionType: "",
    userToResetPass: null,
    response: "",
    errorMessage: "",
    isFetching: "",
  },
  action,
) {
  switch (action.type) {
    case types.VERIFY_URL_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.VERIFY_URL_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        isSuccess: true,
        userToResetPass: action.response,
        actionType: action.type,
      };
    case types.VERIFY_URL_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: "Password reset token is invalid or has expired.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.EMAIL_RESET_PASSWORD_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.EMAIL_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        isSuccess: true,
        response: action.response,
        actionType: action.type,
      };
    case types.EMAIL_RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.response || "Unable to Send Email or Email Address not found",
        isSuccess: false,
        actionType: action.type,
      };
    default:
      return state;
  }
}
