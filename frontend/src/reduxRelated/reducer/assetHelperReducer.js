import * as types from "../ActionTypes/actionTypes.js";

export default function(
  state = {
    isFetching: false,
    authenticated: false,
    isAuthenticated: !!localStorage.getItem("access_token"),
    actionType: "",
    errorMessage: "",
    lineAssets: [],
    assetTypeAssets: [],
    inspectableUserAssets: [],
    unassignedAssets: [],
    assetTree: {},
  },
  action,
) {
  switch (action.type) {
    case types.GET_LINE_ASSETS_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_LINE_ASSETS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        lineAssets: action.response,
        actionType: action.type,
      };
    case types.GET_LINE_ASSETS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Lines.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.GET_LINE_ASSETS_WITH_SELF_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_LINE_ASSETS_WITH_SELF_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        lineAssets: action.response,
        actionType: action.type,
      };
    case types.GET_LINE_ASSETS_WITH_SELF_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Lines.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.GET_INSPECTABLE_ASSETS_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_INSPECTABLE_ASSETS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        inspectableUserAssets: action.response,
        actionType: action.type,
      };
    case types.GET_INSPECTABLE_ASSETS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Unassigned Assets.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.GET_UNASSIGNED_ASSETS_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_UNASSIGNED_ASSETS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        unassignedAssets: action.response,
        actionType: action.type,
      };
    case types.GET_UNASSIGNED_ASSETS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Lines.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.GET_ASSET_TREE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_ASSET_TREE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        assetTree: action.response,
        actionType: action.type,
      };
    case types.GET_ASSET_TREE_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get Asset Tree.",
        isSuccess: false,
        actionType: action.type,
      };
    case types.GET_ASSETTYPES_ASSETS_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.GET_ASSETTYPES_ASSETS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        assetTypeAssets: action.response,
        actionType: action.type,
      };
    case types.GET_ASSETTYPES_ASSETS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Get assetType Assets.",
        isSuccess: false,
        actionType: action.type,
      };
      case types.CREATE_MULTIPLE_ASSETS_REQUEST:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: "",
        actionType: action.type,
      };
    case types.CREATE_MULTIPLE_ASSETS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: "",
        isSuccess: true,
        assetTypeAssets: action.response,
        actionType: action.type,
      };
    case types.CREATE_MULTIPLE_ASSETS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || "Error: Unable to Create Multiple Assets.",
        isSuccess: false,
        actionType: action.type,
      };
    default:
      return state;
  }
}
