import { connect } from 'react-redux'
import {curdActions} from "reduxCURD/actions";

// import UserCreate from 'components/Users/UserForm/index.jsx'
import UserForm from 'components/SetupPage/User/UserForm/index.jsx'
import {
  userRequest,
  userCreate,
  userUpdate,
  userDelete,
  updatePassword,
  userHoursUpdate,
  getUserHours,
  userListRequest
  // getPermissionList,
  // getLevelList
} from 'reduxRelated/actions/userActions.js'

const getApplicationlookupss = curdActions.getApplicationlookupss;

const mapStateToProps = state => {
  const { userReducer, applicationlookupsReducer} = state
  //    const {errorMessage, actionType, permissionList, isFetching} = userReducer;
  const { userId, selectedUser, errorMessage, actionType, permissionList, isFetching, user, levelList, userGroupActionType, userGroups } = userReducer
  const {applicationlookupss} = applicationlookupsReducer;
  const applicationlookupsActionType = applicationlookupsReducer.actionType;
  let userHours = userReducer.userHours
  return {
    selectedUser,
    userGroups,
    userGroupActionType,
    permissionList,
    errorMessage,
    actionType,
    isFetching,
    levelList,
    userHours,
    user,
    applicationlookupsActionType,
    applicationlookupss,
    /*
        user,
        selectedUser,
        userId,
        errorMessage,
        actionType,
        permissionList,
        currentUser,
        isFetching
*/
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getSelectedUser: userID => {
      return dispatch(userRequest(userID))
    },
    createUser: user => {
      return dispatch(userCreate(user))
    },
    // getPermissionList: () => {
    //     return dispatch(getPermissionList());
    // },
    updateUser: (user, userId) => {
      return dispatch(userUpdate(user, userId))
    },
    deleteUser: userId => {
      return dispatch(userDelete(userId))
    },
    passwordUpdate: (newPassword, userId) => {
      return dispatch(updatePassword(newPassword, userId))
    },
    getUserHours: userId => {
      return dispatch(getUserHours(userId))
    },
    getUserList: () => {
      return dispatch(userListRequest())
    },
    updateUserHours: (userId, userHours) => {
      return dispatch(userHoursUpdate(userId, userHours))
    },
    getApplicationLists: (listName) => {
            return dispatch(getApplicationlookupss(listName));
        }

    // getLevelList: () => {
    //     return dispatch(getLevelList());
    // },
  }
}
const UserFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserForm)
export default UserFormContainer
