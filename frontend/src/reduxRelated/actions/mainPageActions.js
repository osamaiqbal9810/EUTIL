/**
 * Created by zqureshi on 8/31/2018.
 */
import * as types from '../ActionTypes/actionTypes.js';
import {CALL_API} from '../middleware/api';

export function attendanceStatus(user) {
    //let user = {user: {email: userCred.email, password: userCred.password}};
    const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };

    return {
        [CALL_API]: {
            endpoint: 'attendance/'+user,
            config: options,
            types: [types.ATTENDANCE_GET_REQUEST, types.ATTENDANCE_GET_SUCCESS, types.ATTENDANCE_GET_FAILURE]
        }
    };
}

export function attendanceSummary(query) {
    const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };

    return {
        [CALL_API]: {
            endpoint: 'attendance/custom/'+query.user+'?'+'days='+query.days,
            config: options,
            types: [types.ATTENDANCE_SUMMARY_REQUEST, types.ATTENDANCE_SUMMARY_SUCCESS, types.ATTENDANCE_SUMMARY_FAILURE]
        }
    };
}

export function checkIn(checkInInfo) {
    //let user = {user: {email: userCred.email, password: userCred.password}};
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(checkInInfo)
    };

    return {
        [CALL_API]: {
            endpoint: 'attendance',
            config: options,
            types: [types.ATTENDANCE_CHECKIN_REQUEST, types.ATTENDANCE_CHECKIN_SUCCESS, types.ATTENDANCE_CHECKIN_FAILURE]
        }
    };
}
export function checkOut(checkOutInfo) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(checkOutInfo)
    };

    return {
        [CALL_API]: {
            endpoint: 'attendance/'+checkOutInfo.attendanceId,
            config: options,
            types: [types.ATTENDANCE_CHECKOUT_REQUEST, types.ATTENDANCE_CHECKOUT_SUCCESS, types.ATTENDANCE_CHECKOUT_FAILURE]
        }
    };
}

export function logoutUser() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('permissions');
    return {
        type: types.LOGOUT_SUCCESS,
    }
}

