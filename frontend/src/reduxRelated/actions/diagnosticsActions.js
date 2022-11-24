import * as types from "../ActionTypes/actionTypes.js";
import { CALL_API } from "../middleware/api";
// Not IS USE
export function getDiagnosticsList(ts) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  let endpoint = "list/pull/";
  let actions = [types.DIAGNOSTICS_LISTS_GET_REQUEST, types.DIAGNOSTICS_LISTS_GET_SUCCESS, types.DIAGNOSTICS_LISTS_GET_FAILURE];
  if (ts) {
    endpoint = "list/pull/" + ts;
    actions = [types.DIAGNOSTICS_LIST_GET_REQUEST, types.DIAGNOSTICS_LIST_GET_SUCCESS, types.DIAGNOSTICS_LIST_GET_FAILURE];
  }
  return {
    [CALL_API]: {
      endpoint: endpoint,
      authenticated: true,
      config: options,
      types: actions,
    },
  };
}

export function getAppMockupsTypes(listName) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  let endpoint = "applicationlookups/getlist/" + listName;
  let actions = ["ERROR : NO CORRECT LIST ACTION", "ERROR : NO CORRECT LIST ACTION", "ERROR : NO CORRECT LIST ACTION"];
  let subdivisionActions = [types.SUBDIVISION_LIST_GET_REQUEST, types.SUBDIVISION_LIST_GET_SUCCESS, types.SUBDIVISION_LIST_GET_FAILURE];
  let assetTypeActions = [types.ASSETTYPE_LIST_GET_REQUEST, types.ASSETTYPE_LIST_GET_SUCCESS, types.ASSETTYPE_LIST_GET_FAILURE];
  let classListActions = [types.CLASS_LIST_GET_REQUEST, types.CLASS_LIST_GET_SUCCESS, types.CLASS_LIST_GET_FAILURE];
  let trackTypeListActions = [types.TRACKTYPE_LIST_GET_REQUEST, types.TRACKTYPE_LIST_GET_SUCCESS, types.TRACKTYPE_LIST_GET_FAILURE];
  let appSettingsListActions = [types.GET_APPSETTINS_DATA_REQUEST, types.GET_APPSETTINS_DATA_SUCCESS, types.GET_APPSETTINS_DATA_FAILURE];
  let testAppFormsActions = [types.GET_TESTS_APPFORMS_REQUEST, types.GET_TESTS_APPFORMS_SUCCESS, types.GET_TESTS_APPFORMS_FAILURE];

  let dynamicLanguageListActions = [
    types.DYNAMIC_LANGUAGE_GET_REQUEST,
    types.DYNAMIC_LANGUAGE_GET_SUCCESS,
    types.DYNAMIC_LANGUAGE_GET_FAILURE,
  ];
  let globalUserLoggingActions = [
    types.GLOBAL_USER_LOGGING_GET_REQUEST,
    types.GLOBAL_USER_LOGGING_GET_SUCCESS,
    types.GLOBAL_USER_LOGGING_GET_FAILURE,
  ];
  switch (listName) {
    case "Subdivision":
      actions = subdivisionActions;
      break;
    case "assetType":
      actions = assetTypeActions;
      break;
    case "Class":
      actions = classListActions;
      break;
    case "TrackType":
      actions = trackTypeListActions;
      break;
    case "DynamicLanguage_en":
      actions = dynamicLanguageListActions;
      break;
    case "DynamicLanguage_es":
      actions = dynamicLanguageListActions;
      break;
    case "DynamicLanguage_fr":
      actions = dynamicLanguageListActions;
      break;
    case "GlobalUserLocLogging":
      actions = globalUserLoggingActions;
      break;
    case "AppSettings":
      actions = appSettingsListActions;
      break;
    case "assetTypeTests":
      actions = testAppFormsActions;
    default:
      actions = ["ERROR : NO CORRECT LIST ACTION", "ERROR : NO CORRECT LIST ACTION", "ERROR : NO CORRECT LIST ACTION"];
      break;
  }

  return {
    [CALL_API]: {
      endpoint: endpoint,
      authenticated: true,
      config: options,
      types: actions,
    },
  };
}

export function getTestsAppForm(listName) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  let endpoint = "applicationlookups/" + listName;
  let testAppFormsActions = [types.GET_TESTS_APPFORMS_REQUEST, types.GET_TESTS_APPFORMS_SUCCESS, types.GET_TESTS_APPFORMS_FAILURE];

  return {
    [CALL_API]: {
      endpoint: endpoint,
      authenticated: true,
      config: options,
      types: testAppFormsActions,
    },
  };
}
export function updateTestsAppForm(form, toRemove) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "PUT",
    body: JSON.stringify(form),
  };
  let endpoint = "applicationlookups/" + form._id;

  let testAppFormsActions = toRemove
    ? [types.DELETE_TESTS_APPFORM_REQUEST, types.DELETE_TESTS_APPFORM_SUCCESS, types.DELETE_TESTS_APPFORM_FAILURE]
    : [types.UPDATE_TESTS_APPFORM_REQUEST, types.UPDATE_TESTS_APPFORM_SUCCESS, types.UPDATE_TESTS_APPFORM_FAILURE];

  return {
    [CALL_API]: {
      endpoint: endpoint,
      authenticated: true,
      config: options,
      types: testAppFormsActions,
    },
  };
}

export function setGeoLocationAppMockupsType(geoLoc) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "PUT",
    body: JSON.stringify(geoLoc),
  };
  let actions = [
    types.SET_GEOLOGGING_GLOBAL_SETTING_REQUEST,
    types.SET_GEOLOGGING_GLOBAL_SETTING_SUCCESS,
    types.SET_GEOLOGGING_GLOBAL_SETTING_FAILURE,
  ];

  return {
    [CALL_API]: {
      endpoint: "applicationlookups/globalGeoLogging",
      authenticated: true,
      config: options,
      types: actions,
    },
  };
}

export function setNewDynamicLangWord(langAdd) {
  //console.log(langAdd)
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "POST",
    body: JSON.stringify(langAdd),
  };
  let actions = [types.ADD_LANGUAGE_CHANGE_REQUEST, types.ADD_LANGUAGE_CHANGE_SUCCESS, types.ADD_LANGUAGE_CHANGE_FAILURE];

  return {
    [CALL_API]: {
      endpoint: "applicationlookups/language",
      authenticated: true,
      config: options,
      types: actions,
    },
  };
}

export function setEditDynamicLangWord(langEdit) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "PUT",
    body: JSON.stringify(langEdit),
  };
  let actions = [types.EDIT_LANGUAGE_CHANGE_REQUEST, types.EDIT_LANGUAGE_CHANGE_SUCCESS, types.EDIT_LANGUAGE_CHANGE_FAILURE];

  return {
    [CALL_API]: {
      endpoint: "applicationlookups/languageedit",
      authenticated: true,
      config: options,
      types: actions,
    },
  };
}

export function removeDynamicLangWord(langDelete) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "DELETE",
    body: JSON.stringify(langDelete),
  };
  let actions = [types.DELETE_LANGUAGE_CHANGE_REQUEST, types.DELETE_LANGUAGE_CHANGE_SUCCESS, types.DELETE_LANGUAGE_CHANGE_FAILURE];

  return {
    [CALL_API]: {
      endpoint: "applicationlookups/languagedelete",
      authenticated: true,
      config: options,
      types: actions,
    },
  };
}


export function getVersionManager(){
   const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
   let actions = [types.GET_VERSION_REQUEST, types.GET_VERSION_SUCCESS , types.GET_VERSION_FAILURE]
   return {
     [CALL_API]: {
      endpoint: "version/",            
      types: actions,
     }
   }
   
}