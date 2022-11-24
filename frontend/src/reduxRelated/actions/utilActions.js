import * as types from '../ActionTypes/actionTypes.js'

export function savePageNum (arg) {
  let actionType = ''
  let planFilter = null

  if (arg.name === 'workPlan') {
    actionType = types.SAVE_WORKPLAN_PAGE_NUMBER
    planFilter = arg.filter
  }
  if (arg.name === 'track') {
    actionType = types.SAVE_TRACK_PAGE_NUMBER
  }

  return {
    type: actionType,
    page: arg.number,
    planFilter: planFilter,
    pageSize: arg.pageSize
  }
}
export function clearPageNum (name) {
  let actionType = ''
  if (name === 'workPlan') {
    actionType = types.CLEAR_WORKPLAN_PAGE_NUMBER
  }
  if (name === 'track') {
    actionType = types.CLEAR_TRACK_PAGE_NUMBER
  }

  return {
    type: actionType
  }
}
