import * as types from '../ActionTypes/actionTypes.js'

export default function (
  state = {
    isFetching: false,
    authenticated: false,
    isAuthenticated: !!localStorage.getItem('access_token'),
    actionType: '',
    errorMessage: '',
    sodList: []
  },
  action
) {
  switch (action.type) {
    case types.SOD_LIST_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: '',
        actionType: action.type
      }
    case types.SOD_LIST_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        isSuccess: true,
        actionType: action.type,
        sodList: action.response
      }
    case types.SOD_LIST_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || 'Error: Unable to Get List.',
        isSuccess: false,
        actionType: action.type
      }
    default:
      return state
  }
}
