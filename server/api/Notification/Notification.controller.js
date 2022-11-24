let ServiceLocator = require("../../framework/servicelocator");


exports.loggedInUserNotifications = async function(req, res) {
    let notificationService = ServiceLocator.resolve("NotificationService");
    let resultObj = { status: 500, errorVal: "default" };
    try 
    {
      resultObj.value = await notificationService.pullNotificationForUser(req.user._id);
      resultObj.status = 200;
    } 
    catch (err) 
    {
      resultObj.status = 500;
      resultObj.errorVal = err.toString();
      console.log("Notification.controller.all.catch", err.toString());
    }
  
    res.status(resultObj.status);
    if (resultObj.value) res.json(resultObj.value);
    else res.json(resultObj.errorVal);
};


exports.update = async function(req, res) {
    const {notificationId, status} = req.body;
    let notificationService = ServiceLocator.resolve("NotificationService");
    let resultObj = { status: 500, errorVal: "default" };
    try 
    {
      resultObj = await notificationService.updateStatus(notificationId, status);
    } 
    catch (err) 
    {
      resultObj.status = 500;
      resultObj.errorVal = err.toString();
      console.log("Notification.controller.all.catch", err.toString());
    }
  
    res.status(resultObj.status);
    if (resultObj.value) res.json(resultObj);
    else res.json(resultObj.errorVal);
};

exports.delete = async function(req, res) {
  const {_id} = req.body;
  let notificationService = ServiceLocator.resolve("NotificationService");
  let resultObj = { status: 500, errorVal: "default" };
  try 
  {
    resultObj = await notificationService.delete(_id);
  } 
  catch (err) 
  {
    resultObj.status = 500;
    resultObj.errorVal = err.toString();
    console.log("Notification.controller.all.catch", err.toString());
  }

  res.status(resultObj.status);
  if (resultObj.value) res.json(resultObj);
  else res.json(resultObj.errorVal);
};