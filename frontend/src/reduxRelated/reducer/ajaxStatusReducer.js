import * as types from '../ActionTypes/actionTypes.js';

export default function (state = {
    ajaxCallsInProgress: 0
}, action) {
    if (action.type === types.BEGIN_AJAX_CALL) {
        return {
            ajaxCallsInProgress: state.ajaxCallsInProgress + 1
        }
    } else if (actionTypeEndsInSuccess(action.type)) {
        return {
            ajaxCallsInProgress: state.ajaxCallsInProgress - 1
        }
    }

    return state;
};

function actionTypeEndsInSuccess(type) {
    return type.substring(type.length - 8) === '_SUCCESS';
}