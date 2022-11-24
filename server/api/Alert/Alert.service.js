const ServiceLocator = require("../../framework/servicelocator");
const _ = require("lodash");
import moment from "moment-timezone";

const schedule = require("node-schedule");
const AlertModel = require("./Alert.model");
class AlertService {
  constructor() {
    this.logger = ServiceLocator.resolve("logger");
    // this.NotificationService = ServiceLocator.resolve("NotificationService");
  }

  async all(user = null) {
    let resultObj = { errorVal: "default", status: 500 };
    try {
      let criteria = {};

      if (user) {
        criteria.destinations = user._id ;
      }

      let alerts = await AlertModel.find(criteria);

      alerts = await this.getAlertJsonObjectFiltered(alerts);

      resultObj = { value: alerts, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("alert.service.all.catch", err.toString());
    }

    return resultObj;
  }

  async fetchAlertsByModelId(modelId, customeQuery = null) {
    return new Promise((resolve, reject) => {
      let criteria = {
        "reference.modelId": modelId,
      };

      if (customeQuery) criteria = { ...criteria, ...customeQuery };

      AlertModel.find(criteria, (err, alerts) => {
        if (err) {
          console.log("Error in startAlertsMonitoring");
          reject(new Error(err));
          return false;
        }

        resolve(alerts);
      });
    });
  }

  // create new alert.
  async create(data, cronJobId) {
    try {
    // initialize a object for alert model to store in db
    let alertData = {
      cronJobId,
      ...data,
    };

    let created = null;
    let isFoundAlertCronJobId = await AlertModel.findOne({cronJobId: alertData.cronJobId}).exec();
    
    if (isFoundAlertCronJobId) {
      created = isFoundAlertCronJobId;
    } else {
      const newAlert = new AlertModel(alertData);
      created = await newAlert.save();
    }

      return created;
    } catch (e) {
      console.log("Error in creating alert Alert.serive.create", e);
    }
  }

  async rule2139bAlertCreate(item) {
    if (item.optParam1.tasks[0] && item.optParam1.tasks[0].issues && item.optParam1.tasks[0].issues.length) {
      let issues = item.optParam1.tasks[0].issues.filter(value => Object.keys(value).length !== 0);

      for(let newIssue of issues) {
        let issueTitle = newIssue.title;
      // Set alert if rule213b applied
      if (newIssue.ruleApplied) {
        if (newIssue.issueType === 'Defect' && newIssue.defectCodes && newIssue.defectCodes[0]) {
          try { 
            let splittedDCode =  newIssue.defectCodes[0].split('.');
            if (splittedDCode.length) 
            issueTitle = issueTitle.replace(splittedDCode[0], newIssue.defectCodes[0]);
          } catch(e) {
            console.log('Alert.service.rule2139bAlertCreate.error', e.toString())
          }
        }
        let JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
        let workplanTemplateId = '';
        let jPlanTitle = '';
        let jPlanId = '';
        // Handle offile case : If inspection created in offline mode
        if (item.code) {
          let existedJPlan = await JourneyPlanModel.findOne({ _id: item.code });
          workplanTemplateId = existedJPlan.workplanTemplateId;
          jPlanTitle = existedJPlan.title;
          jPlanId = existedJPlan._id;
        } else {
          workplanTemplateId = item.optParam1.workplanTemplateId;
          jPlanTitle = item.optParam1.title;
          let existedJPlan = await JourneyPlanModel.findOne({ privateKey: item.privateKey });
          jPlanId = existedJPlan._id;
        }
  
          this
            .fetchAlertsByModelId(workplanTemplateId, { "reference.field": "rule2139bIssue", isTemplate: true })
            .then(async (alerts) => {
              if (alerts && alerts.length) {
                for (let alert of alerts) {
                  if (!alert.isClone) {
                    let cpyAlert = alert.toJSON();
                    delete cpyAlert._id;
                    cpyAlert.title = cpyAlert.title.replace("{issueTitle}", issueTitle);
                    cpyAlert.message = cpyAlert.message.replace("{issueTitle}", issueTitle);
                    cpyAlert.message = cpyAlert.message.replace("{modelTitle}", jPlanTitle);
                    cpyAlert.isClone = true;
                    cpyAlert.isTemplate = false;
                    cpyAlert.eventExactDate = moment().add(30, "days").utc();
                    cpyAlert = this.calculateAlertTime(cpyAlert, cpyAlert.timezone);
                    cpyAlert.cronJobId = cpyAlert.cronJobId + "_" + newIssue.issueId;
                    cpyAlert.reference.issueId = newIssue.issueId;
                    cpyAlert.reference.jPlanId = jPlanId;
                    let createdAlert = await this.create(cpyAlert, cpyAlert.cronJobId);
                    this.startAlertsMonitoring();
                  }
                }
              }
            });
          }
      }
    }
  }

  // create new alert.
  async update(data) {
    const alert = AlertModel.update({ _id: data._id }, data, { upset: true, setDefaultsOnInsert: true }).exec();
  }

  
  // 1st param "fields" array of objects
  // 2nd param uniqueId for cronJob ex: modelId
  // 3rd param model of event
  // 4th param object title
  // This function is use for add or update alert.
  async addAlerts(alertRule, modelId, model, modelObjectTitle, timezone, modelObj) {
    if (modelObj) {
      // alertRule.eventExactDate = modelObj[alertRule.field];
      alertRule.eventExactDate = modelObj[alertRule.reference.field];
    }

    let field = this.processAlertObjectToSaveInDB(alertRule, modelId, model, timezone);
    if (!alertRule.isTemplate) {
      let constructedMessage = this.constructMessage(alertRule, modelObjectTitle);
      field = {
        ...field,
        ...constructedMessage,
      };
    } else {
      alertRule.message = alertRule.message.replace('{time}', this.timeConvert(alertRule.time, alertRule.unitOfTime));
    }

    let oldAlert = await AlertModel.findOne({ cronJobId: field.cronJobId }).exec();

    if (alertRule._id || oldAlert) {
      field = await this.update(field);
    } else {
      field = await this.create(field);
    }

    return field;
  }

  async addMultipleAlerts(alerts, modelId, model, modelObjectTitle, timezone) {
    let modelService = ServiceLocator.resolve(model);

    let modelObj = await modelService.findOne({ _id: modelId }).exec();

    if (alerts && alerts.length) {
      for (let alert of alerts) {
        await this.addAlerts(alert, modelId, model, modelObjectTitle, timezone, modelObj);
      }
    }

    this.startAlertsMonitoring(timezone);
  }

  async updateMultipleAlerts(alerts, modelId, model, modelObjectTitle, timezone) {
    let modelService = ServiceLocator.resolve(model);

    let modelObj = await modelService.findOne({ _id: modelId }).exec();

    // Delete old alerts
    let alertRules = await this.fetchAlertsByModelId(modelId);

    if (alertRules && alertRules.length) {
      for (let alertRule of alertRules) {
        let alertRuleObj = alertRule.toObject();

        let find = alerts.find((al) => {
          if (!al._id || !alertRuleObj._id) return false;
          return al._id.toString() === alertRuleObj._id.toString();
        });

        if (!find && !alertRule.isClone) {
          await alertRule.remove();
        }
      }
    }

    // Add or update alert
    if (alerts && alerts.length) {
      for (let alert of alerts) {
        await this.addAlerts(alert, modelId, model, modelObjectTitle, timezone, modelObj);
      }
    }

    this.startAlertsMonitoring();
  }



  async deleteIssueAlerts(issueId) {
    try {
      AlertModel.deleteMany({isClone: true, 'reference.issueId': issueId}, (err) => {
        if (err) {
          console.log('Error in deleting issue alert with id: ', issueId, err.toString);
          return false;
        }

        this.startAlertsMonitoring();
      });
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("alert.service.deleteIssueAlerts.catch", err.toString());
    }

  }

  async getAlertJsonObjectFiltered(alerts) {
    let alertRules = [];
    
    for(let al of alerts) {
      let alertTimeLocal = "";

      if (al.eventExactDate) alertTimeLocal = moment(al.eventExactDate).local();

      al = al.toObject();
      al.field = al.reference.field;
      al.time = al.timeDifference;
      al.alertTimeLocal = alertTimeLocal;

      if (al.reference.issueId && al.reference.jPlanId) {
        let JourneyPlanService = ServiceLocator.resolve("JourneyPlanService");
        al.reference.issueObj = await JourneyPlanService.getJourneyIssueById(al.reference.jPlanId, al.reference.issueId);
        if (al.reference.issueObj)
          al.reference.issueObj.planId = al.reference.jPlanId;
      }

      alertRules.push(al);
    };

    return alertRules;
  }

  // This function recieves modelId
  async recalculateAlertMonitoringByModelId(modelId) {
    return new Promise((resolve, reject) => {
      this.fetchAlertsByModelId(modelId)
        .then((alerts) => {
          alerts.forEach(async (alert) => {
            let model = ServiceLocator.resolve(alert.reference.model);

            let modelObj = await model.findOne({ _id: modelId }).exec();

            if (modelObj && !modelObj.isClone) {
              if (modelObj[alert.reference.field] && !moment(alert.eventExactDate).isSame(modelObj[alert.reference.field])) {
                alert.eventExactDate = modelObj[alert.reference.field];
                alert = this.calculateAlertTime(alert, alert.timezone);

                if (alert.event === "exact") {
                  let constructedMessage = this.constructMessage(alert, modelObj.title);

                  alert.title = constructedMessage.title;
                  alert.message = constructedMessage.message;
                }

                alert.status = "pending";

                await alert.save();
              }
            }

            // start monitoring job
            this.stopMonitoring(alert.cronJobId);
            this.startMonitoringAlert(alert.cronJobId, { date: alert.alertTime, type: "date", timezone: alert.timezone });
          });
          resolve("success recalculate alert monitoring by modelID");
        })
        .catch((err) => {
          console.log("Alert.service.recalculateAlertMonitoringByModelId", err.toString());
          reject(err);
        });
    });
  }

  // Restart all cron jobs.
  async startAlertsMonitoring() {
    AlertModel.find({}, (err, alerts) => {
      if (err) {
        console.log("Error in startAlertsMonitoring");
        return false;
      }

      alerts.forEach((alert) => {
        // first cancel the previous job;
        this.stopMonitoring(alert.cronJobId);
        // start monitoring job
        this.startMonitoringAlert(alert.cronJobId, { date: alert.alertTime, type: "date", timezone: alert.timezone });
      });
    });
  }

  timeConvert(time, unitOfTime) {
    let days, minutes, hours;
    switch (unitOfTime) {
      case "minutes":
        days = parseInt(time / 24 / 60);
        hours = parseInt((time / 60) % 24);
        minutes = parseInt(time % 60);

        if (days > 0) return `${days} days ${hours} hours and ${minutes} minutes`;
        else if (hours > 0) return `${hours} hours and ${minutes} minutes`;

        return `${minutes} minutes`;
      case "hours":
        days = parseInt(time / 24);
        hours = parseInt(time % 24);

        if (days > 0) return `${days} days and ${hours} hours`;
        else if (hours > 0) return `${hours} hours`;

        return `${minutes} minutes`;
      default:
        return `${time} ${unitOfTime}`;
    }
  }

  constructMessage(alertRule, modelObjectTitle) {
    let title = "";
    let message = "";

    // let fieldDisplayText = alertRule.field;
    let fieldDisplayText = alertRule.reference.field;

    if (alertRule.reference && alertRule.reference.fieldDisplayText) fieldDisplayText = alertRule.reference.fieldDisplayText;

    if (alertRule.fieldDisplayText) fieldDisplayText = alertRule.fieldDisplayText;

    if (alertRule.event === "exact") {
      title = `Inspection ${modelObjectTitle} Started`;
      message = `Inspection ${modelObjectTitle} has been started on ${moment(alertRule.eventExactDate).format("LLLL")}`;
    } else if (alertRule.event === "before") {
      title = `Inspection ${modelObjectTitle} is approaching its ${fieldDisplayText}`;
      message = `${title} in ${this.timeConvert(alertRule.time, alertRule.unitOfTime)}, Please take appropriate action`;
    } else {
      title = `Inspection ${modelObjectTitle} has passed its ${fieldDisplayText}`;
      message = `${title}, Please take appropriate action`;
    }

    return {
      title,
      message,
    };
  }

  processAlertObjectToSaveInDB(object, modelId, model, timezone) {
    // let field = object.field;
    let event = object.event;
    // let fieldDisplayText = object.fieldDisplayText;
    object.timezone = timezone;
    object.reference = {
      ...object.reference,
      modelId,
      model,
    };

    let type = Array.isArray(object.type) ? object.type[0] : object.type;
    // object.cronJobId = `${modelId}_${field}_${type}_${event}_${object.time}`;
    object.cronJobId = `${modelId}_${object.reference.field}_${type}_${event}_${object.time}`;
    object.timeDifference = object.time;

    object = this.calculateAlertTime(object, timezone);

    return object;
  }

  calculateAlertTime(object, timezone) {
    let date = moment(object.eventExactDate).tz(timezone);
    if (object.event === "before") {
      object.alertTime = date.subtract(object.timeDifference, object.unitOfTime).format("LLLL");
    } else {
      object.alertTime = date.add(object.timeDifference, object.unitOfTime).format("LLLL");
    }

    return object;
  }

  async deleteAlertByModelId(modelId) {
    AlertModel.find({ "reference.modelId": modelId }, async (err, res) => {
      if (err) {
        console.log("Error in delete alert.service.deleteAlertByModelId", err);
        return false;
      }

      for (let alert of res) {
        // First stop cronjob for this alert then delete the model from database;
        this.stopMonitoring(alert.cronJobId);
        await alert.remove();
      }
    });
  }

  async startMonitoringAlert(cronJobId, interval) {
    let rule = new schedule.RecurrenceRule();
    rule.tz = interval.timezone || "America/New_York";
    // console.log('timezone: ', interval.timezone);
    // rule.tz = "Asia/Karachi";
    let formatOfDate = "LLLL";

    switch (interval.type) {
      case "hourly":
        rule.minute = moment(interval.date, formatOfDate).minute();
        break;
      case "daily":
        rule.minute = moment(interval.date, formatOfDate).minute();
        rule.hour = moment(interval.date, formatOfDate).hour();
        rule.date = moment(interval.date, formatOfDate).format("DD");
        break;
      case "weekly":
        rule.minute = moment(interval.date, formatOfDate).minute();
        rule.hour = moment(interval.date, formatOfDate).hour();
        rule.dayOfWeek = 0;
        break;
      case "monthly":
        break;
      case "yearly":
        break;
      default:
        rule.year = moment(interval.date, formatOfDate).year();
        rule.month = parseInt(moment(interval.date, formatOfDate).format("M")) - 1;
        rule.date = moment(interval.date, formatOfDate).format("DD");
        rule.hour = moment(interval.date, formatOfDate).hour();
        rule.minute = moment(interval.date, formatOfDate).minute();
    }

    //start schedule
    schedule.scheduleJob(cronJobId, rule, async (fireDate) => {
      // Cron job logic.
      // console.log("Cron job called its schedule at: " + fireDate + "With job id: " + cronJobId);
      AlertModel.findOne({ cronJobId }, async (err, alert) => {
        if (err) {
          console.log("Error in running cronjob", err);
          return false;
        }

        if (!alert) {
          console.log("Error in running cronjob", err);
          return false;
        }

        let alertJsonObj = alert.toJSON();

        const NotificationService = ServiceLocator.resolve("NotificationService");

        const data = {
          destinations: alertJsonObj.destinations,
          title: alert.title || "New nofication",
          message: alert.message || "You have a new notification",
          alertId: alert._id,
          notificationType: alertJsonObj.type[0],
        };

        if (alert.eventExactDate) {
          NotificationService.createFromAlert(data);
          alert.status = "generated";
          await alert.save();
        }
      });
    });
  }

  async stopMonitoring(cronJobId) {
    // gets id of running job
    const schedule_id = cronJobId;

    // cancel the job
    const cancelJob = schedule.scheduledJobs[schedule_id];
    if (cancelJob == null) {
      return false;
    }
    cancelJob.cancel();
    return true;
  }
}

export default AlertService;
