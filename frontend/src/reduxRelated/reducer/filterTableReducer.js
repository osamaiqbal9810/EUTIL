import * as types from '../ActionTypes/actionTypes.js'

export default function (
  state = {
    isFetching: false,
    authenticated: false,
    actionType: '',
    errorMessage: '',
    taskStatus: []
  },
  action
) {
  switch (action.type) {
    case types.TASKSTATUS_GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: '',
        actionType: action.type
      }
    case types.TASKSTATUS_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        isSuccess: true,
        actionType: action.type,
        taskStatus: action.response
      }
    case types.TASKSTATUS_GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || 'Error: Unable to logout.',
        isSuccess: false,
        actionType: action.type
      }
    default:
      return state
  }
}
