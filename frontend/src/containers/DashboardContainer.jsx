/**
 * Created by zqureshi on 9/25/2018.
 */
import { connect } from 'react-redux';

import Dashboard from './../components/Dashboard/DashboardPage.jsx';
import { attendanceSummary } from '../reduxRelated/actions/mainPageActions.js'
import { userListRequest } from "../reduxRelated/actions/userActions.js";

const mapStateToProps = (state) => {
    const { mainPageReducer,userReducer } = state;
    const {actionType, errorMessage, isFetching, attendance, userSession} = mainPageReducer;
    const { userList } = userReducer;
    let userActionType = userReducer.actionType;
    return {
        userActionType,
        userList,
        isFetching,
        errorMessage,
        actionType,
        attendance,
        userSession
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAttendanceSummary: (query) => {
            return dispatch(attendanceSummary(query));
        },
        getUserList: () => {
            return dispatch(userListRequest());
        }
    };
};
const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export default DashboardContainer
