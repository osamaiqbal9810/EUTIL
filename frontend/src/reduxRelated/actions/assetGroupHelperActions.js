import * as types from '../ActionTypes/actionTypes.js'
import { CALL_API } from '../middleware/api'

export function createAssetGroupWorkPlan (assetGroup) {
  const options = {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    method: 'POST',
    body: JSON.stringify(assetGroup)
  }
  return {
    [CALL_API]: {
      endpoint: 'track/' + assetGroup._id,
      authenticated: true,
      types: [types.WORKPLAN_FROM_ASSETGROUP_REQUEST, types.WORKPLAN_FROM_ASSETGROUP_SUCCESS, types.WORKPLAN_FROM_ASSETGROUP_FAILURE],
      config: options
    }
  }
}
