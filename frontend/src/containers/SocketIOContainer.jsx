import SocketIOComponent from 'components/SocketIO/SocketIOComponent'
import { connect } from 'react-redux'
import { curdActions } from 'reduxCURD/actions'
const getJourneyPlan = curdActions.getJourneyPlan
const getNotifications = curdActions.getNotifications
const mapStateToProps = state => {
  const { loginReducer } = state
  let loginActionType = loginReducer.actionType
  return {
    loginActionType
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getJourneyPlan: id => {
      return dispatch(getJourneyPlan(id))
    },
    getNotifications: () => {
      return dispatch(getNotifications());
    }
  }
}
const SocketIOComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SocketIOComponent)
export default SocketIOComponentContainer
