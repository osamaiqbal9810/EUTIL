import * as types from "../ActionTypes/actionTypes.js";
export function setLanguage(language) {
  return {
    type: types.SET_LANGUAGE_CHANGE,
    language: language,
  };
}
