
export const USER_LIST_TO_UPDATE = [
    'USER_UPDATE_SUCCESS',
    'USER_CREATE_SUCCESS',
    'USER_DELETE_SUCCESS',
    'PASSWORD_UPDATE_SUCCESS',
];

export const USER_TOAST_MESSAGES_ACTIONS = [
    ...USER_LIST_TO_UPDATE,
    'USER_UPDATE_FAILURE',
    'USER_CREATE_FAILURE',
    'USER_DELETE_FAILURE',
    'PASSWORD_UPDATE_FAILURE',
];

export const USER_LOADING_STOP_ACTIONS = [
    'USER_LIST_SUCCESS',
    'USER_LIST_FAILURE',
    'USER_WITH_DETAIL_SUCCESS',
    'USER_WITH_DETAIL_FAILURE',
    'USER_BY_EMAIL_SUCCESS',
    'USER_BY_EMAIL_FAILURE',
    ...USER_TOAST_MESSAGES_ACTIONS
];


export const getWarningMessage = key =>  {
    if (key in USER_TOAST_MESSAGES)
        return USER_TOAST_MESSAGES[key];
    return key;
};

const USER_TOAST_MESSAGES = {
    USER_CREATE_SUCCESS: 'User Created Successfully !',
    USER_UPDATE_SUCCESS: 'User Successfully Updated !',
    USER_DELETE_SUCCESS: 'User Successfully Deleted !', // lang
    PASSWORD_UPDATE_SUCCESS: 'Password Updated !',
    USER_CREATE_FAILURE: 'Failed to Create User !',
    USER_UPDATE_FAILURE: 'Failed to Update User !', // lang
    USER_DELETE_FAILURE: "Failed to Delete User!",
    PASSWORD_UPDATE_FAILURE: 'Failed to Update Password !' // lang
};


export const USER_LOADING_START_ACTIONS = [
    'USER_LIST_REQUEST',
    'USER_WITH_DETAIL_REQUEST',
    'USER_BY_EMAIL_REQUEST',
    'USER_UPDATE_REQUEST',
    'USER_CREATE_REQUEST',
    'USER_DELETE_REQUEST',
    'PASSWORD_UPDATE_REQUEST'
];
