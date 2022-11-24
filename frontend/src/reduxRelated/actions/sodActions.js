import * as types from '../ActionTypes/actionTypes.js'
import { CALL_API } from '../middleware/api'

export function getSODs (query) {
  const options = { headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, method: 'GET' }
  let endpoint = 'SOD'
  if (query) {
    // endpoint = 'SOD' + '?' + 'query=' + query

    //Removed unneccesory concatnation
    endpoint = 'SOD ? query=' + query
  }
  return {
    [CALL_API]: {
      endpoint: endpoint,
      authenticated: true,
      config: options,
      types: [types.SOD_LIST_GET_REQUEST, types.SOD_LIST_GET_SUCCESS, types.SOD_LIST_GET_FAILURE]
    }
  }
}
