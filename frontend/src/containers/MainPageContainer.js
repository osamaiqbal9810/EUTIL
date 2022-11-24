/**
 * Created by zqureshi on 8/31/2018.
 */
import { connect } from 'react-redux';

import MainPage from './../components/MainPage/MainPage.jsx';
import { checkIn, checkOut, attendanceStatus, attendanceSummary } from '../reduxRelated/actions/mainPageActions.js'
import mainPageReducer from "../reduxRelated/reducer/mainPageReducer";

const mapStateToProps = (state) => {
    const { mainPageReducer, loginReducer } = state;
    const {actionType, errorMessage, isFetching, attendance, userSession} = mainPageReducer;
let loginActionType = loginReducer.actionType;
    return {
        loginActionType,
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
        onAttendanceStatus: (user) => {
            return dispatch(attendanceStatus(user));
        },
        onCheckIn: (checkInInfo) => {
            return dispatch(checkIn(checkInInfo));
        },
        onCheckOut: (checkOutInfo) => {
            return dispatch(checkOut(checkOutInfo))
        },
    };
};
const MainPageContainer = connect(mapStateToProps, mapDispatchToProps)(MainPage);
export default MainPageContainer
