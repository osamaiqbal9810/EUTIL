import * as types from "../ActionTypes/actionTypes";

export function updateFilterState(caller, filter) {
  return {
    type: types.UPDATE_FILTER_STATE,
    caller: caller,
    filterState: filter,
  };
}
