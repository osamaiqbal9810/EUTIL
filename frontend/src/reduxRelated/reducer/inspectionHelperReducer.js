import * as types from "../ActionTypes/actionTypes.js";

export default function(
  state = {
    actionType: "",
    futureInspection: null,
  },
  action,
) {
  switch (action.type) {
    case types.SET_FUTURE_INSPECTION_DETAIL:
      return {
        ...state,
        futureInspection: action.futureInspection,
        actionType: action.type,
      };
    default:
      return state;
  }
}
