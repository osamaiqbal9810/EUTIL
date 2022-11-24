/**
 * Created by zqureshi on 10/01/2018.
 */
import { connect } from 'react-redux'

import Logout from './../components/Login/Logout'
import { logoutUser } from '../reduxRelated/actions/loginActions.js'
import { clearStore } from 'reduxRelated/actions/storeActions'
const mapStateToProps = state => {
  const { loginReducer } = state
  const { actionType, errorMessage, isFetching } = loginReducer
  return {
    isFetching,
    errorMessage,
    actionType
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogoutRequest: userId => {
      return dispatch(logoutUser(userId))
    },
    clearStore: () => {
      return dispatch(clearStore())
    }
  }
}
const LogoutContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout)
export default LogoutContainer
