import * as types from "../ActionTypes/actionTypes.js";

export default function(
  state = {
    actionType: "",
    language: localStorage.getItem("language") ? localStorage.getItem("language") : "en",
  },
  action,
) {
  switch (action.type) {
    case types.SET_LANGUAGE_CHANGE:
      return {
        ...state,
        language: action.language,
        actionType: action.type,
      };
    default:
      return state;
  }
}
