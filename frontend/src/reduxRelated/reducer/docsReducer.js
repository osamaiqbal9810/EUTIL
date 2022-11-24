import * as types from '../ActionTypes/actionTypes.js'

export default function (
  state = {
    isFetching: false,
    authenticated: false,
    isAuthenticated: !!localStorage.getItem('access_token'),
    actionType: '',
    errorMessage: '',
    docsList: []
  },
  action
) {
  switch (action.type) {
    case types.DOCUMENTS_LOAD_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: '',
        actionType: action.type
      };
    case types.DOCUMENTS_LOAD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        isSuccess: true,
        actionType: action.type,
        docsList: action.response
      };
    case types.DOCUMENTS_LOAD_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || 'Error: Unable to Get List.',
        isSuccess: false,
        actionType: action.type
      };
    case types.DOCUMENT_UPLOAD_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isSuccess: false,
        errorMessage: '',
        actionType: action.type
      };
    case types.DOCUMENT_UPLOAD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        isSuccess: true,
        actionType: action.type
      };
    case types.DOCUMENT_UPLOAD_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.error || 'Error: Unable to Get List.',
        isSuccess: false,
        actionType: action.type
      };
    default:
      return state
  }
}
