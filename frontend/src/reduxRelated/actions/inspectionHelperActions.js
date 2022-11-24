import * as types from "../ActionTypes/actionTypes.js";
export function setFutureInspection(inspctn) {
  return {
    type: types.SET_FUTURE_INSPECTION_DETAIL,
    futureInspection: inspctn,
  };
}
