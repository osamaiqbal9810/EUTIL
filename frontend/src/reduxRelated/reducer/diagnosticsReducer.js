import * as types from "../ActionTypes/actionTypes.js";

export default function (
  state = {
    isFetching: false,
    authenticated: false,
    isAuthenticated: !!localStorage.getItem("access_token"),
    actionType: "",
    errorMessage: "",
    userLogging: null,
    trafficTypes: [],
    subdivisions: [],
    classLevels: [],
    trackTypes: [],
    assetTypes: [],
    lists: [],
    dynamicLanguageList: [],
    appSettings: [],
    assetTypeTests: [],
    assetTypeTest: null,
    list: null,
    versionObj: {}
  },
  action,
) {
  switch (action.type) {
    case types.DIAGNOSTICS_LISTS_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.DIAGNOSTICS_LISTS_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        lists: action.response,
      };
    case types.DIAGNOSTICS_LISTS_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get List.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.DIAGNOSTICS_LIST_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.DIAGNOSTICS_LIST_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        list: action.response,
      };
    case types.DIAGNOSTICS_LIST_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get List.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.TRAFFICTYPE_LIST_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.TRAFFICTYPE_LIST_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        trafficTypes: action.response,
      };
    case types.TRAFFICTYPE_LIST_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get traffic types  List.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.SUBDIVISION_LIST_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.SUBDIVISION_LIST_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        subdivisions: action.response,
      };
    case types.SUBDIVISION_LIST_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Subdivision List.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.ASSETTYPE_LIST_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.ASSETTYPE_LIST_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        assetTypes: action.response,
      };
    case types.ASSETTYPE_LIST_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Subdivision List.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.CLASS_LIST_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.CLASS_LIST_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        classLevels: action.response,
      };
    case types.CLASS_LIST_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Class List.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.TRACKTYPE_LIST_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.TRACKTYPE_LIST_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        trackTypes: action.response,
      };
    case types.TRACKTYPE_LIST_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Class List.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.DYNAMIC_LANGUAGE_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.DYNAMIC_LANGUAGE_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        dynamicLanguageList: action.response,
      };
    case types.DYNAMIC_LANGUAGE_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Language List.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.GLOBAL_USER_LOGGING_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GLOBAL_USER_LOGGING_GET_SUCCESS:
      let responseArray = action.response;
      let userLoggin = state.userLogging;
      try {
        if (responseArray.length > 0) {
          userLoggin = responseArray[0];
        }
      } catch (error) {
        console.log("Error In Response of Global User logging");
      }
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        userLogging: userLoggin,
      };
    case types.GLOBAL_USER_LOGGING_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Language List.",
        isSuccess: false,
        actionType: action.type,
      };

    case types.SET_GEOLOGGING_GLOBAL_SETTING_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.SET_GEOLOGGING_GLOBAL_SETTING_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        userLogging: action.response,
      };
    case types.SET_GEOLOGGING_GLOBAL_SETTING_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Language List.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.ADD_LANGUAGE_CHANGE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.ADD_LANGUAGE_CHANGE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        //lists: action.response,
      };
    case types.ADD_LANGUAGE_CHANGE_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to add new Word.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.EDIT_LANGUAGE_CHANGE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.EDIT_LANGUAGE_CHANGE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        //lists: action.response,
      };
    case types.EDIT_LANGUAGE_CHANGE_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Edit Word.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.DELETE_LANGUAGE_CHANGE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.DELETE_LANGUAGE_CHANGE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        //lists: action.response,
      };
    case types.DELETE_LANGUAGE_CHANGE_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Delete Word.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.GET_APPSETTINS_DATA_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_APPSETTINS_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        appSettings: action.response,
      };
    case types.GET_APPSETTINS_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Delete Word.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.GET_TESTS_APPFORMS_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_TESTS_APPFORMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        assetTypeTests: action.response,
      };
    case types.GET_TESTS_APPFORMS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to GET Forms.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.UPDATE_TESTS_APPFORM_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.UPDATE_TESTS_APPFORM_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        assetTypeTest: action.response,
      };
    case types.UPDATE_TESTS_APPFORM_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to UPDATE Forms.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.DELETE_TESTS_APPFORM_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.DELETE_TESTS_APPFORM_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
        assetTypeTest: action.response,
      };
    case types.DELETE_TESTS_APPFORM_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Delete Form.",
        isSuccess: false,
        actionType: action.type,
      };
  case types.GET_VERSION_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_VERSION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        actionType: action.type,
       versionObj : action.response
      };
    case types.GET_VERSION_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Delete Form.",
        isSuccess: false,
        actionType: action.type,

      };

    default:
      return state;
  }
}
