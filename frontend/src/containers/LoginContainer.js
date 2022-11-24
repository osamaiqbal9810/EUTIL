import { connect } from 'react-redux';

import LoginPage from './../components/Login/LoginPage';
import { loginUser, logoutUser } from '../reduxRelated/actions/loginActions.js'


const mapStateToProps = (state) => {
    const { loginReducer } = state;
    const {actionType, errorMessage, isFetching} = loginReducer;
    return {
        isFetching,
        errorMessage,
        actionType
    };
};


const mapDispatchToProps = dispatch => {
    return {
        onLoginClick: (creds) => {
            return dispatch(loginUser(creds));
        },
        onLogoutClick: () => {
            return dispatch(logoutUser())
        },
    };
};
const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(LoginPage);
export default LoginContainer
