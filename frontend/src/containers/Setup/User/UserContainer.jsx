import { connect } from "react-redux";

//import UserCreate from 'components/Users/UserForm/index.jsx'
import User from "components/SetupPage/User/index.jsx";
import { getUserGroups, getUserSignature } from "reduxRelated/actions/userActions.js";
import { getUserByEmail, getUserWithDetail } from "reduxRelated/actions/userActions.js";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import { curdActions } from "reduxCURD/actions";
import { getAssetLinesWithSelf } from "../../../reduxRelated/actions/assetHelperAction";
import { inspectorsPlan } from "../../../reduxRelated/actions/templateHelperActions";

let getAssets = curdActions.getAssets;

const mapStateToProps = (state) => {
  const { userReducer, diagnosticsReducer, assetReducer, applicationlookupsReducer, assetHelperReducer, templateHelperReducer } = state;
  //    const {errorMessage, actionType, permissionList, isFetching} = userReducer;
  const { userGroups, actionType, userList, userGroupActionType, userDetail, userDetailActionType, usersSignatures } = userReducer;
  const { assets } = assetReducer;
  const { workplans } = templateHelperReducer;
  const { lineAssets } = assetHelperReducer;
  const assetHelperActionType = assetHelperReducer.actionType;
  const templateHelperActionType = templateHelperReducer.actionType;
  const { applicationlookupss } = applicationlookupsReducer;
  const { subdivisions } = diagnosticsReducer;
  const assetActionType = assetReducer.actionType;
  const applicationlookupsActionType = applicationlookupsReducer.actionType;
  return {
    userGroups,
    actionType,
    userGroupActionType,
    assets,
    assetActionType,
    lineAssets,
    assetHelperActionType,
    userWorkPlans: workplans,
    templateHelperActionType,
    userList,
    userDetail,
    userDetailActionType,
    usersSignatures,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserAssets: (args) => {
      return dispatch(getAssets(args));
    },
    getUserGroups: () => {
      return dispatch(getUserGroups());
    },
    getUserByEmail: (email) => {
      return dispatch(getUserByEmail(email));
    },
    getUserWithDetail: (id) => {
      return dispatch(getUserWithDetail(id));
    },
    getAssetLinesWithSelf: () => {
      return dispatch(getAssetLinesWithSelf({ location: true }));
    },
    getUserInspectionPlan: (users) => {
      return dispatch(inspectorsPlan(users));
    },
    getAppMockupsTypes: (listName) => {
      return dispatch(getAppMockupsTypes(listName));
    },
    getUserSignature: (query) => {
      return dispatch(getUserSignature(query));
    },
  };
};

const UserContainer = connect(mapStateToProps, mapDispatchToProps)(User);
export default UserContainer;
