import * as types from '../ActionTypes/actionTypes.js';
import {CALL_API} from '../middleware/api';

export function loginUser(userCred) {
    let user = {user: {email: userCred.email, password: userCred.password}};
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(user)
    };

    return {
        [CALL_API]: {
            endpoint: 'login',
            config: options,
            types: [types.LOGIN_REQUEST, types.LOGIN_SUCCESS, types.LOGIN_FAILURE]
        }
    };
}

export function logoutUser(userId) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('permissions');
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'PUT'
    };
    return {
            [CALL_API]: {
                endpoint: 'users/logout/'+userId,
                config: options,
                types: [types.LOGOUT_REQUEST, types.LOGOUT_SUCCESS, types.LOGOUT_FAILURE]
            }
        };
}
