import * as types from "../ActionTypes/actionTypes.js";

export default function (
  state = {
    isFetching: false,
    isAuthenticated: !!localStorage.getItem("access_token"),
    authenticated: false,
    userList: [],
    userListByGroup: [],
    permissionList: [],
    levelList: [],
    userId: "",
    selectedUser: {},
    actionType: "",
    userGroupActionType: "",
    userGroups: [],
    user: "",
    userDetail: null,
    errorMessage: "",
    usersSignatures: [],
  },
  action,
) {
  switch (action.type) {
    case types.USER_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.USER_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        isSuccess: true,
        userList: action.response,
        actionType: action.type,
      };
    case types.USER_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to get Users.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.USER_LIST_BY_GROUP_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.USER_LIST_BY_GROUP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        isSuccess: true,
        userList: action.response,
        actionType: action.type,
      };
    case types.USER_LIST_BY_GROUP_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to get Users.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.USER_ID_TO_FETCH:
      return {
        ...state,
        userId: action.userID,
        actionType: action.type,
      };
    case types.USER_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.USER_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        isSuccess: true,
        selectedUser: action.response,
        actionType: action.type,
      };
    case types.USER_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to get User.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.USER_UPDATE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.USER_UPDATE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        user: action.response,
        isSuccess: true,
        actionType: action.type,
      };
    case types.USER_UPDATE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to Update User.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.USER_DELETE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.USER_DELETE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        user: action.response,
        isSuccess: true,
        actionType: action.type,
      };
    case types.USER_DELETE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || action.error.statusText || "Unable to Delete User.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.PASSWORD_UPDATE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.PASSWORD_UPDATE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
      };
    case types.PASSWORD_UPDATE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to Update Password.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.USER_CREATE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.USER_CREATE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        user: action.response,
        userList: Object.assign(state.userList, action.response),
        isSuccess: true,
        actionType: action.type,
      };
    case types.USER_CREATE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to Create User.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.USER_GROUP_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        userGroupActionType: action.type,
      };
    case types.USER_GROUP_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        userGroups: action.response,
        isSuccess: true,
        userGroupActionType: action.type,
      };
    case types.USER_GROUP_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to get User Groups.",
        isSuccess: false,
        userGroupActionType: action.type,
      };

    case types.USER_WITH_DETAIL_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        userDetailActionType: action.type,
      };
    case types.USER_WITH_DETAIL_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        userDetail: action.response,
        isSuccess: true,
        userDetailActionType: action.type,
      };
    case types.USER_WITH_DETAIL_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to get User Groups.",
        isSuccess: false,
        userDetailActionType: action.type,
      };
    // case types.PERMISSION_LIST_REQUEST:
    //     return {
    //         ...state,
    //         isFetching: true,
    //         isSuccess: false,
    //         errorMessage: '',
    //         actionType: action.type
    //     };
    // case types.PERMISSION_LIST_SUCCESS:
    //     return {
    //         ...state,
    //         isFetching: false,
    //         errorMessage: '',
    //         isSuccess: true,
    //         permissionList: action.response,
    //         actionType: action.type
    //     };
    // case types.PERMISSION_LIST_FAILURE:
    //     return {
    //         ...state,
    //         isFetching: false,
    //         errorMessage: action.error.error_description || 'Unable to get Permissions.',
    //         isSuccess: false,
    //         actionType: action.type
    //     };
    // case types.LEVEL_LIST_REQUEST:
    //     return {
    //         ...state,
    //         isFetching: true,
    //         isSuccess: false,
    //         errorMessage: '',
    //         actionType: action.type
    //     };
    // case types.LEVEL_LIST_SUCCESS:
    //     return {
    //         ...state,
    //         isFetching: false,
    //         errorMessage: '',
    //         isSuccess: true,
    //         levelList: action.response,
    //         actionType: action.type
    //     };
    // case types.LEVEL_LIST_FAILURE:
    //     return {
    //         ...state,
    //         isFetching: false,
    //         errorMessage: action.error.error_description || 'Unable to get Levels.',
    //         isSuccess: false,
    //         actionType: action.type
    //     };
    case types.GET_USERHOURS_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_USERHOURS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        isSuccess: true,
        userHours: action.response,
        actionType: action.type,
      };
    case types.GET_USERHOURS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to get UserHours.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.UPDATE_USERHOURS_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.UPDATE_USERHOURS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        isSuccess: true,
        userHours: action.response,
        actionType: action.type,
      };
    case types.UPDATE_USERHOURS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to update User Hours.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.ADD_MEMEBERSTEAM_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.ADD_MEMEBERSTEAM_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
      };
    case types.ADD_MEMEBERSTEAM_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to update Team.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.REMOVE_MEMEBERSTEAM_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.REMOVE_MEMEBERSTEAM_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
      };
    case types.REMOVE_MEMEBERSTEAM_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to update Team.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.GET_USERS_SIGNATURE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_USERS_SIGNATURE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        usersSignatures: action.response,
      };
    case types.GET_USERS_SIGNATURE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.error.error_description || "Unable to get users signature.",
        isSuccess: false,
        actionType: action.type,
      };

    default:
      return state;
  }
}
