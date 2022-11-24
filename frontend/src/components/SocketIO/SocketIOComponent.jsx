import React, {PropTypes} from 'react'
import socketIOClient from 'socket.io-client'
import {getServerEndpoint} from 'utils/serverEndpoint.js'
import * as types from 'reduxRelated/ActionTypes/actionTypes.js'

class SocketIOComponent extends React.Component {
  constructor(props) {
    super(props);
    this.socket;

    this.socketOnNotification = this.socketOnNotification.bind(this);
  }

  componentDidMount() {
    let simulatedServerPort = 'http://localhost:2500/';
    let loginCheck = localStorage.getItem('access_token');
    if (loginCheck) {
      if (!this.socket) {
        this.socket = socketIOClient(getServerEndpoint()); //,{transports:['websocket', 'polling', 'flashsocket']})
        // console.log('Called in Component Did Mount')
        // console.log(this.socket)
        this.socket.on('InspectionUpdated', this.inspectionUpdateCallBack());
        this.socket.on('testSocket', this.testSocket());

        this.socket.on('connect', this.socketOnConnect());

        this.socket.on('notification', (data) => {
          this.socketOnNotification(data);

        });
      }
    }
  }

  socketOnNotification(data) {
    console.log('Incoming message:', data);
    this.props.getNotifications();
    this.socket.emit('notificationReceived', data.notificationId);
  };

  socketOnConnect() {
      return () => {
        let LoggedInUser = localStorage.getItem('loggedInUser');
        try {
            LoggedInUser = JSON.parse(LoggedInUser);
        } catch (e) {
            console.log('Error in parsing logged in user.. SocketIOComponent: line:41')
        }
        //console.log('socket on connect');
        if (LoggedInUser) {
            //console.log('socket connected', LoggedInUser._id);
            this.socket.emit('room', LoggedInUser._id);
        }
    };

  };

  componentWillReceiveProps(nextProps) {
    if (this.props.loginActionType !== nextProps.loginActionType && nextProps.loginActionType == types.LOGIN_SUCCESS) {
      if (!this.socket) {
        this.socket = socketIOClient(getServerEndpoint());
        // console.log('Called in Component Will Receive Props')
        // console.log(this.socket)

        this.socket.on('InspectionUpdated', this.inspectionUpdateCallBack());
        this.socket.on('testSocket', this.testSocket());

        this.socket.on('connect', this.socketOnConnect());
          this.socket.on('notification', (data) => {
             // console.log('Incoming message:', data);
              this.socketOnNotification(data);
          });
      }
    }
    if (this.props.loginActionType !== nextProps.loginActionType && nextProps.loginActionType == types.LOGOUT_SUCCESS) {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
      }
    }
  }

  inspectionUpdateCallBack() {
    let handleFromServer = id => {
      this.props.getJourneyPlan(id)
    };
    return handleFromServer
  }
  testSocket() {
    let handleFromServer = msg => {
      // console.log(msg)
    };
    return handleFromServer
  }

  render() {
    return <div />
  }
}

export default SocketIOComponent
