import * as types from '../ActionTypes/actionTypes.js'

export default function (
  state = {
    isFetching: false,
    authenticated: false,
    isAuthenticated: !!localStorage.getItem('access_token'),
    actionType: '',
    errorMessage: '',
    noVar: ''
  },
  action
) {
  switch (action.type) {
    case types.WORKPLAN_FROM_ASSETGROUP_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: '',
        actionType: action.type
      }
    case types.WORKPLAN_FROM_ASSETGROUP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        isSuccess: true,
        actionType: action.type
      }
    case types.WORKPLAN_FROM_ASSETGROUP_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || 'Error: Unable to Update Sort.',
        isSuccess: false,
        actionType: action.type
      }
    default:
      return state
  }
}
