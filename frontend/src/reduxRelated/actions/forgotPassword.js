import * as types from "../ActionTypes/actionTypes.js";
import { CALL_API } from "../middleware/api";

export function sendEmailForPasswordReset(userEmail) {
  let email = { email: userEmail };
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "POST",
    body: JSON.stringify(email),
  };
  return {
    [CALL_API]: {
      endpoint: "users/forgot",
      authenticated: false,
      types: [types.EMAIL_RESET_PASSWORD_REQUEST, types.EMAIL_RESET_PASSWORD_SUCCESS, types.EMAIL_RESET_PASSWORD_FAILURE],
      config: options,
    },
  };
}

export function sendUrlToServer(url) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  return {
    [CALL_API]: {
      endpoint: "users/reset/" + url,
      authenticated: false,
      types: [types.VERIFY_URL_REQUEST, types.VERIFY_URL_SUCCESS, types.VERIFY_URL_FAILURE],
      config: options,
    },
  };
}
