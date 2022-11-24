import * as types from '../ActionTypes/actionTypes.js'

export default function (
  state = {
    isFetching: false,
    authenticated: false,
    isAuthenticated: !!localStorage.getItem('access_token'),
    actionType: '',
    errorMessage: '',
    lineRunNumbers: []
  },
  action
) {
  switch (action.type) {
    case types.GET_LINE_RUN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: '',
        actionType: action.type
      }
    case types.GET_LINE_RUN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        isSuccess: true,
        lineRunNumbers: action.response,
        actionType: action.type
      }
    case types.GET_LINE_RUN_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || 'Error: Unable to Get Lines.',
        isSuccess: false,
        actionType: action.type
      }

    default:
      return state
  }
}
