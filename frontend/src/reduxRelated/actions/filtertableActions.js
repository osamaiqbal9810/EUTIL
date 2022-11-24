import * as types from '../ActionTypes/actionTypes.js'
import { CALL_API } from '../middleware/api'

export function gettaskStatus (query) {
  const options = { headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, method: 'GET' }
  let endpoint = 'taskStatus/'
  if (query.type) {
    endpoint = 'taskStatus/' + '?' + 'type=' + query.type
    if (query.filterable) {
      endpoint = 'taskStatus/' + '?' + 'type=' + query.type + '&' + 'filterable=' + query.filterable
    }
  }
  if (query.filterable && !query.type) {
    endpoint = 'taskStatus/' + '?' + 'filterable=' + query.filterable
  }

  return {
    [CALL_API]: {
      endpoint: endpoint,
      config: options,
      types: [types.TASKSTATUS_GET_REQUEST, types.TASKSTATUS_GET_SUCCESS, types.TASKSTATUS_GET_FAILURE]
    }
  }
}
