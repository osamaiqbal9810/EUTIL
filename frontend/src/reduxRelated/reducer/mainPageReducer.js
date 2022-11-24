/**
 * Created by zqureshi on 8/31/2018.
 */
import * as types from '../ActionTypes/actionTypes.js'

export default function (state = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('access_token') ? true : false,
    authenticated: false,
    actionType: '',
    errorMessage: ''
}, action) {
    switch (action.type) {
        case types.ATTENDANCE_GET_REQUEST:
            return {
                ...state,
                isFetching: true,
                isAuthenticated: true,
                isSuccess: false,
                errorMessage: '',
                actionType: action.type
            };
        case types.ATTENDANCE_GET_SUCCESS:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: true,
                errorMessage: '',
                isSuccess: true,
                attendance: action.response,
                actionType: action.type
            };
        case types.ATTENDANCE_GET_FAILURE:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: false,
                errorMessage: action.error || 'Error: Unable to get attendance.',
                isSuccess: false,
                actionType: action.type
            };
        case types.ATTENDANCE_CHECKIN_REQUEST:
            return {
                ...state,
                isFetching: true,
                isAuthenticated: true,
                isSuccess: false,
                errorMessage: '',
                actionType: action.type
            };
        case types.ATTENDANCE_CHECKIN_SUCCESS:
           /* localStorage.setItem('access_token', action.response.token);
            const toJson = JSON.stringify(action.response.result);
            localStorage.setItem('loggedInUser', toJson);
            localStorage.setItem('permissions', JSON.stringify(action.response.result.userGroup.permissions));*/
            return {
                ...state,
                isFetching: false,
                isAuthenticated: true,
                errorMessage: '',
                isSuccess: true,
                attendance: action.response,
                actionType: action.type
            };
        case types.ATTENDANCE_CHECKIN_FAILURE:
            //action.error.message = "Email or Password Invalid !";
            return {
                ...state,
                isFetching: false,
                isAuthenticated: false,
                errorMessage: action.error || 'Error: Unable to login.',
                isSuccess: false,
                actionType: action.type
            };
        case types.ATTENDANCE_CHECKOUT_REQUEST:
            return {
                ...state,
                isFetching: true,
                isAuthenticated: true,
                isSuccess: false,
                errorMessage: '',
                actionType: action.type
            };
        case types.ATTENDANCE_CHECKOUT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: true,
                errorMessage: '',
                isSuccess: true,
                userSession: action.response,
                actionType: action.type
            };
        case types.ATTENDANCE_CHECKOUT_FAILURE:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: false,
                errorMessage: action.error || 'Error: Unable to checkout.',
                isSuccess: false,
                actionType: action.type
            };
        case types.ATTENDANCE_SUMMARY_REQUEST:
            return {
                ...state,
                isFetching: true,
                isAuthenticated: true,
                isSuccess: false,
                errorMessage: '',
                actionType: action.type
            };
        case types.ATTENDANCE_SUMMARY_SUCCESS:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: true,
                errorMessage: '',
                isSuccess: true,
                attendance: action.response,
                actionType: action.type
            };
        case types.ATTENDANCE_SUMMARY_FAILURE:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: false,
                errorMessage: action.error || 'Error: Unable to get attendance.',
                isSuccess: false,
                actionType: action.type
            };
        default:
            return state;
    }
}
