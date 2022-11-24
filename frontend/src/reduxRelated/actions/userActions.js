import * as types from "../ActionTypes/actionTypes.js";
import { CALL_API } from "../middleware/api";

export function userListRequest() {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  return {
    [CALL_API]: {
      endpoint: "users",
      authenticated: true,
      types: [types.USER_LIST_REQUEST, types.USER_LIST_SUCCESS, types.USER_LIST_FAILURE],
      config: options,
    },
  };
}

export function userListByGroupRequest(group_id) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  return {
    [CALL_API]: {
      endpoint: `users/group/${group_id}`,
      authenticated: true,
      types: [types.USER_LIST_BY_GROUP_REQUEST, types.USER_LIST_BY_GROUP_SUCCESS, types.USER_LIST_BY_GROUP_FAILURE],
      config: options,
    },
  };
}

export function getUserByEmail(email) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  return {
    [CALL_API]: {
      endpoint: `users/email/${email}`,
      authenticated: true,
      types: [types.USER_BY_EMAIL_REQUEST, types.USER_BY_EMAIL_SUCCESS, types.USER_BY_EMAIL_FAILURE],
      config: options,
    },
  };
}

export function getUserWithDetail(id) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  return {
    [CALL_API]: {
      endpoint: `users/details/${id}`,
      authenticated: true,
      types: [types.USER_WITH_DETAIL_REQUEST, types.USER_WITH_DETAIL_SUCCESS, types.USER_WITH_DETAIL_FAILURE],
      config: options,
    },
  };
}

export function userRequest(userID) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  return {
    [CALL_API]: {
      endpoint: "users/" + userID,
      authenticated: true,
      types: [types.USER_GET_REQUEST, types.USER_GET_SUCCESS, types.USER_GET_FAILURE],
      config: options,
    },
  };
}

export function userIdUpdate(userID) {
  return {
    type: types.USER_ID_TO_FETCH,
    userID: userID,
  };
}

export function userUpdate(user, userId) {
  user._id = userId;
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "PUT",
    body: JSON.stringify(user),
  };
  return {
    [CALL_API]: {
      endpoint: "users/" + userId,
      authenticated: true,
      types: [types.USER_UPDATE_REQUEST, types.USER_UPDATE_SUCCESS, types.USER_UPDATE_FAILURE],
      config: options,
    },
  };
}

export function userDelete(userId) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "DELETE",
  };
  return {
    [CALL_API]: {
      endpoint: "users/" + userId,
      authenticated: true,
      types: [types.USER_DELETE_REQUEST, types.USER_DELETE_SUCCESS, types.USER_DELETE_FAILURE],
      config: options,
    },
  };
}

export function updatePassword(newUserPassword, userId) {
  const newPassword = newUserPassword.slice(0);
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "PUT",
    body: JSON.stringify({ newPassword }),
  };
  return {
    [CALL_API]: {
      endpoint: "users/" + userId + "/password",
      authenticated: true,
      types: [types.PASSWORD_UPDATE_REQUEST, types.PASSWORD_UPDATE_SUCCESS, types.PASSWORD_UPDATE_FAILURE],
      config: options,
    },
  };
}

export function userCreate(user) {
  // console.log(user);
  const userToCreate = { ...user };
  let userCreate = { user: userToCreate };
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "POST",
    body: JSON.stringify(userCreate),
  };
  return {
    [CALL_API]: {
      endpoint: "users",
      authenticated: true,
      types: [types.USER_CREATE_REQUEST, types.USER_CREATE_SUCCESS, types.USER_CREATE_FAILURE],
      config: options,
    },
  };
}

export function getUserGroups() {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  return {
    [CALL_API]: {
      endpoint: "userGroup",
      authenticated: true,
      types: [types.USER_GROUP_GET_REQUEST, types.USER_GROUP_GET_SUCCESS, types.USER_GROUP_GET_FAILURE],
      config: options,
    },
  };
}

// export function getPermissionList() {
//     const options = {
//         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
//         method: 'GET',
//     };
//     return {
//         [CALL_API]: {
//             endpoint: 'permissions',
//             authenticated: true,
//             types: [types.PERMISSION_LIST_REQUEST, types.PERMISSION_LIST_SUCCESS, types.PERMISSION_LIST_FAILURE],
//             config: options
//         }
//     };
// }

// export function getLevelList() {
//     const options = {
//         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
//         method: 'GET',
//     };
//     return {
//         [CALL_API]: {
//             endpoint: 'levels',
//             authenticated: true,
//             types: [types.LEVEL_LIST_REQUEST, types.LEVEL_LIST_SUCCESS, types.LEVEL_LIST_FAILURE],
//             config: options
//         }
//     };
// }
export function getUserHours(userId) {
  // user._id = userId;
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "GET",
  };
  return {
    [CALL_API]: {
      endpoint: "userHours/" + userId,
      authenticated: true,
      types: [types.GET_USERHOURS_REQUEST, types.GET_USERHOURS_SUCCESS, types.GET_USERHOURS_FAILURE],
      config: options,
    },
  };
}

export function userHoursUpdate(userId, userHours) {
  // user._id = userId;
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "PUT",
    body: JSON.stringify(userHours),
  };
  return {
    [CALL_API]: {
      endpoint: "userHours/" + userId,
      authenticated: true,
      types: [types.UPDATE_USERHOURS_REQUEST, types.UPDATE_USERHOURS_SUCCESS, types.UPDATE_USERHOURS_FAILURE],
      config: options,
    },
  };
}

export function updateTeam(updatedSuperInfo) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "PUT",
    body: JSON.stringify(updatedSuperInfo),
  };
  let superId = updatedSuperInfo.superId;
  return {
    [CALL_API]: {
      endpoint: "users/teamupdate/" + superId,
      authenticated: true,
      types: [types.ADD_MEMEBERSTEAM_REQUEST, types.ADD_MEMEBERSTEAM_SUCCESS, types.ADD_MEMEBERSTEAM_FAILURE],
      config: options,
    },
  };
}

export function removeMembersTeam(updatedSuperInfo) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "PUT",
    body: JSON.stringify(updatedSuperInfo),
  };
  let superId = updatedSuperInfo.superId;
  return {
    [CALL_API]: {
      endpoint: "users/teamremovemembers/" + superId,
      authenticated: true,
      types: [types.REMOVE_MEMEBERSTEAM_REQUEST, types.REMOVE_MEMEBERSTEAM_SUCCESS, types.REMOVE_MEMEBERSTEAM_FAILURE],
      config: options,
    },
  };
}
export function getUserSignature(query) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "GET",
  };
  let additionalQuery = query ? query : "";
  return {
    [CALL_API]: {
      endpoint: "users/signature/" + additionalQuery,
      authenticated: true,
      types: [types.GET_USERS_SIGNATURE_REQUEST, types.GET_USERS_SIGNATURE_SUCCESS, types.GET_USERS_SIGNATURE_FAILURE],
      config: options,
    },
  };
}
