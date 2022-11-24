let ServiceLocator = require("../../framework/servicelocator");
const NotificationModel = require('./Notification.model');
//const emailService = require('./../../service/EmailService');

class NotificationService {
  constructor() {
    this.logger = ServiceLocator.resolve("logger");
    this.emailService = ServiceLocator.resolve("EmailService");
  }

  async createFromAlert(data) {
    if (data && data.destinations && data.destinations.length) {
      data.destinations.forEach(async destination => {
        data.destination = destination;

        let notification = new NotificationModel(data);
        await notification.save();
      })
    }
  }

  async sendNewNotifications() {
    try {
      const SocketIORoomService = ServiceLocator.resolve('SocketIORoomService');

      NotificationModel.find({status: 'new'},(err, notifications) => {
          notifications.forEach(async notify => {
            const {title, message, destination} = notify;
  
            switch(notify.notificationType) {
              case 'email':
                const userModel = ServiceLocator.resolve('userModel');
                let user = await userModel.findById(destination).exec();
                // Send notification to email
                  this.sendEmail(title, message, user.genericEmail, user.name).then(async () => {
                    await this.updateStatus(notify._id, 'sent')
                  }).catch(async (err) => {
                    console.log('Notification email sending failed', err);
                    await this.updateStatus(notify._id, 'failed')
                  });
                // Updating email status in database without knowing the actual return msg
                await this.updateStatus(notify._id, 'sent')
                break;
              case 'sms':
                // Send notification to sms 
                console.log('Mobile messaging notification not implemented yet, Notification.service.sendNewNotifications')
                break;
              case 'mobile':
                // Send notification to mobile (push notification)
                console.log('Mobile push notification not implemented yet, Notification.service.sendNewNotifications')
                break;
              default:
                SocketIORoomService.sendMessageToRoom(notify.destination, {notificationId: notify._id, title: notify.title, message: notify.message});
            }
  
          })
      })
  
      return {success: true, message: 'Notification created'};
    } catch (err) {
      //resultObj = { errorVal: err.toString(), status: 500 };
      console.log("notification.service.sendNewNotification.catch", err.toString());
    }

  }

  async sendEmail(title, message, email, name) {
    return new Promise((resolve, reject) => {
      let nameSplitted = name.split(' ');

      if (nameSplitted && nameSplitted.length)
        name = nameSplitted[0];

      let mailOptions = {
        to: email,
        subject: title,
        html: `
        <div>Hi ${name}</div>
        <p>${message}</p></br></br>
          <div><b>This email is auto generated and is intended for your information only. Please do not reply to this email.</b></div>
          <h3><b>TekTracking Team</b></h4>
        `
      };
  
      this.emailService.sendEmail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          reject(new Error(err));
        }
        
        resolve({success: true});
      });
    })
  }

  async updateStatus(notificationId, status) {
    let notification = await NotificationModel.findById(notificationId);

    notification.status = status;

    await notification.save();

    return {success: true, message: 'Notification updated', status: 200};
  }

  async pullNotificationForUser(userId) {
      const notifications = await NotificationModel.find({destination: userId, isRemoved: false, notificationType: 'web'}).sort({createdAt: 'desc'}).exec();

      notifications.forEach(async (notification) => {
        if (notification.status === 'new') {
          notification.status = 'unread';

          await notification.save();
        }
      });
      
      return notifications;
    }

    async delete(_id) {
      const notification = await NotificationModel.findById(_id);

      if (notification) {
        notification.isRemoved = true;

        await notification.save();

        return {success: true, value: 'Notification deleted', status: 200};

      } else {
        return {success: false, value: "Notfication deletion delete", status: 500};

      }
    }
}

export default NotificationService;
