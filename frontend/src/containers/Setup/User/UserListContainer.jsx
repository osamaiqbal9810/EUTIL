import { connect } from "react-redux";

import UserList from "components/SetupPage/User/UserList/UserList.jsx";

import { userListRequest, userIdUpdate, userRequest } from "reduxRelated/actions/userActions.js";

const mapStateToProps = state => {
    const { userReducer } = state;
    const { userList, errorMessage, actionType, isFetching, user } = userReducer;
    return {
        user,
        userList,
        errorMessage,
        actionType,
        isFetching,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getSelectedUser: userID => {
            return dispatch(userRequest(userID));
        },
        getUserList: () => {
            return dispatch(userListRequest());
        },
        updateUserIDtoFetch: userID => {
            return dispatch(userIdUpdate(userID));
        },
    };
};
const UserListContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserList);
export default UserListContainer;
