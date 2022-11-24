import * as CURDACTIONS from './types'
import * as types from 'reduxRelated/ActionTypes/actionTypes'
export let commonReducers = {}

export function setcommonReducers (name) {
  let capName = name.toUpperCase()
  let myReducer = function (
    state = {
      [name]: null,
      [name + 's']: [],
      actionType: '',
      isFetching: false,
      isAuthenticated: true,
      authenticated: false
    },
    action
  ) {
    switch (action.type) {
      case CURDACTIONS.commonTasks[capName + '_READ_REQUEST']:
        return {
          ...state,
          isFetching: true,
          isAuthenticated: false,
          isSuccess: false,
          errorMessage: '',
          actionType: action.type
        }
      case CURDACTIONS.commonTasks[capName + '_READ_SUCCESS']:
        return {
          ...state,
          isFetching: false,
          isAuthenticated: true,
          errorMessage: '',
          isSuccess: true,
          actionType: action.type,
          [name]: action.response
        }
      case CURDACTIONS.commonTasks[capName + '_READ_FAILURE']:
        return {
          ...state,
          isFetching: false,
          isAuthenticated: false,
          errorMessage: action.error.status ? action.error : 'Error: Could not get',
          isSuccess: false,
          actionType: action.type
        }

      case CURDACTIONS.commonTasks[capName + 'S_READ_REQUEST']:
        return {
          ...state,
          isFetching: true,
          isAuthenticated: false,
          isSuccess: false,
          errorMessage: '',
          actionType: action.type
        }
      case CURDACTIONS.commonTasks[capName + 'S_READ_SUCCESS']:
        return {
          ...state,
          isFetching: false,
          isAuthenticated: true,
          errorMessage: '',
          isSuccess: true,
          actionType: action.type,
          [name + 's']: action.response
        }
      case CURDACTIONS.commonTasks[capName + 'S_READ_FAILURE']:
        return {
          ...state,
          isFetching: false,
          isAuthenticated: false,
          errorMessage: action.error.status ? action.error : 'Error: Could not get',
          isSuccess: false,
          actionType: action.type
        }
      case CURDACTIONS.commonTasks[capName + '_UPDATE_REQUEST']:
        return {
          ...state,
          isFetching: true,
          isSuccess: false,
          errorMessage: '',
          actionType: action.type
        }
      case CURDACTIONS.commonTasks[capName + '_UPDATE_SUCCESS']:
        return {
          ...state,
          isFetching: false,
          errorMessage: '',
          [name]: action.response,
          isSuccess: true,
          actionType: action.type
        }
      case CURDACTIONS.commonTasks[capName + '_UPDATE_FAILURE']:
        return {
          ...state,
          isFetching: false,
          errorMessage: action.error.status ? action.error : 'Unable to Update',
          isSuccess: false,
          actionType: action.type
        }
      case CURDACTIONS.commonTasks[capName + '_DELETE_REQUEST']:
        return {
          ...state,
          isFetching: true,
          isSuccess: false,
          errorMessage: '',
          actionType: action.type
        }
      case CURDACTIONS.commonTasks[capName + '_DELETE_SUCCESS']:
        return {
          ...state,
          isFetching: false,
          errorMessage: '',
          user: action.response,
          isSuccess: true,
          actionType: action.type
        }
      case CURDACTIONS.commonTasks[capName + '_DELETE_FAILURE']:
        return {
          ...state,
          isFetching: false,
          errorMessage: action.error.status ? action.error : 'Unable to Delete',
          isSuccess: false,
          actionType: action.type
        }
      case CURDACTIONS.commonTasks[capName + '_CREATE_REQUEST']:
        return {
          ...state,
          isFetching: true,
          isSuccess: false,
          errorMessage: '',
          actionType: action.type
        }
      case CURDACTIONS.commonTasks[capName + '_CREATE_SUCCESS']:
        let newObjs = Object.assign(state[name + 's'], action.response)
        return {
          ...state,
          isFetching: false,
          errorMessage: '',
          [name]: action.response,
          [name + 's']: newObjs,
          isSuccess: true,
          actionType: action.type
        }
      case CURDACTIONS.commonTasks[capName + '_CREATE_FAILURE']:
        return {
          ...state,
          isFetching: false,
          errorMessage: action.error.status ? action.error : 'Unable to Create',
          isSuccess: false,
          actionType: action.type
        }
      case types.CLEAR_STORE_DATA:
        return {
          ...state,
          actionType: action.type,
          [name]: null,
          [name + 's']: []
        }
      default:
        return state
    }
  }

  commonReducers[[name] + 'Reducer'] = myReducer
}
