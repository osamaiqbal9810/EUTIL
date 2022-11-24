import * as types from '../ActionTypes/actionTypes';

export function beginAjaxCall() {
    return {
        type: types.BEGIN_AJAX_CALL
    }
}