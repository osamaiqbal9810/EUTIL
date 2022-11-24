"use strict";
let ServiceLocator = require("../framework/servicelocator");

export default class SocketIOService {
  constructor(socketio) {
    this.socketio = socketio;
    // handle incoming connections from clients
    this.socketio.sockets.on('connection', function(socket) {
      // once a client has connected, we expect to get a ping from them saying what room they want to join
      socket.on('room', function(room) {
        socket.join(room);
      });

      socket.on('notificationReceived', function(notificationId) {

        const notificationService = ServiceLocator.resolve('NotificationService');

        notificationService.updateStatus(notificationId, 'unread');
      })
    });
  }

  sendMessageToRoom(room, data) {
    this.socketio.sockets.in(room).emit('notification', data);
  }
}
