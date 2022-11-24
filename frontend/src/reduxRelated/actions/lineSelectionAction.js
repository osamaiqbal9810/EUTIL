import * as types from "../ActionTypes/actionTypes.js";
import { CALL_API } from "../middleware/api";
export function setSelectedLine(line) {
  return {
    type: types.SET_SELECTED_LINE,
    line: line,
  };
}

export function clearSelectedLine(line) {
  return {
    type: types.CLEAR_SELECTED_LINE,
  };
}

export function getMultiLineData(lines, endpoint, actionTypes) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  let endpointFinal = "";

  if (lines.length > 0) {
    var jsonArray = encodeURIComponent(JSON.stringify(lines));
    endpointFinal = endpoint + "/multiLines?lines=" + jsonArray;
    //endpointFinal = endpoint + "/multiLines";
  }

  return {
    [CALL_API]: {
      endpoint: endpointFinal,
      authenticated: true,
      config: options,
      types: [types.GET_MULTIPLE_LINES_DATA_REQUEST, types.GET_MULTIPLE_LINES_DATA_SUCCESS, types.GET_MULTIPLE_LINES_DATA_FAILURE],
    },
  };
}
