let ServiceLocator = require("../framework/servicelocator");
let utils = require("../utilities/utils");
const actionTypes = require('./taskqueue/actionTypes');
const TaskQueue = require('./taskqueue/taskQueue');
const JUpdateSuccessWorker = require('./taskqueue/JUpdateSuccessWorker');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export default class DataOperaionsLogic {
  constructor(logger) {

    this.taskQueues = new Map();
    let es = ServiceLocator.resolve("DataOpEventService");
    
    es.on("JourneyPlan+AddOrUpdateSuccess", async (itm)=>{this.JPAddorUpdateSuccessCallback(itm);});
    // stop creating maintenance automatically // es.on('JourneyPlan+BeforeAddOrUpdate', itm =>{this.JPUpdateRequestCallback(itm)});
    this.logger = logger;
    this.JPAddorUpdateSuccessCallback = this.JPAddorUpdateSuccessCallback.bind(this);
  }
  async JPAddorUpdateSuccessCallback(itm)
  { // add to different task queues based on unique wpt._id
      if(!itm|| !itm.newItem || !itm.newItem.workplanTemplateId)
      {
        console.log('Cannot get wptId:', itm);
      }
      let wptId = itm.newItem.workplanTemplateId;
      let taskQueue = this.taskQueues.get(wptId);
      if(!taskQueue)
      {
        this.taskQueues.set(wptId, new TaskQueue(this.logger));
        taskQueue = this.taskQueues.get(wptId);
        taskQueue.setOwner(wptId);
      }
     let DBService = ServiceLocator.resolve("DBService");

     let worker = new JUpdateSuccessWorker(DBService, this, this.logger);
     worker.setArguments({actionType: actionTypes.JP_UPDATE_SUCCESS, itm: itm});
     taskQueue.enqueue(actionTypes.JP_UPDATE_SUCCESS, worker);
     
     
      // await this.JUpdateSuccessCallback(itm);
      // await this.JPUpdateCallback(itm);
      // await DBService.checkTestsFormFilling(itm);
      // await DBService.workPlanIntervalReceivedMethod(itm);
      // await DBService.checkForTemplateScheduleReCalculateFlag(itm);
      // await DBService.fixedAssetGPSupdate(itm);
      // await this.JPUpdateCallbackForAlertRecalculate(itm);
      // await DBService.JPUpdateCallbackForAlertRecalculate(itm);
      // await DBService.maintenanceExecution(itm);
      // await DBService.updateDefaultAppFormsValues(itm);
      // await DBService.pushDefectIssues(itm);
      // await DBService.inspectionOnFinished(itm);
      // await DBService.userProfileUpdate(itm);
  }
  async JUpdateSuccessCallback(data) {
    let jp = data.newItem;
    let user = data.user;
    let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
    let JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    let jpId = jp._id;
    try {
      // # check for remedial action resolve case
      // get the latest jp from database
      let jp = await JourneyPlanModel.findOne({ _id: jpId }).exec();
      let jpChanged = false;
      let tasks = jp.tasks ? jp.tasks : [];
      for (let task of tasks) {
        let issues = task && task.issues ? task.issues : [];
        for (let issue of issues) {
          if (issue && issue.remedialAction) {
            // issue has the remedialAction, let's compare and resolve it if required
            let remedialActionResolveIssue = await ApplicationLookupsModel.findOne({ listName: "resolveIssueRemedialAction" }).exec();
            let checkRemedialActionConfig = await ApplicationLookupsModel.findOne({
              listName: "config",
              code: "issueResolveRemedialAction",
            }).exec();
            if (checkRemedialActionConfig.opt2 === false && remedialActionResolveIssue && remedialActionResolveIssue.opt1.length) {
              if (remedialActionResolveIssue.opt1.includes(issue.remedialAction)) {
                issue.status = "Resolved";
                issue.serverObject = { repairDate: issue.timeStamp };
                jpChanged = true;
              }
            }
          }
        }
      }
      if (jpChanged) {
        jp.markModified("tasks");
        await jp.save();
      }
    } catch (err) {
      console.log("DataOperationsLogic:JPUpdateRequestCallback, catch:", err.toString());
      this.logger.error(err, err.toString());
    }
  }

  // async JPUpdateRequestCallback(data)
  // {
  //     let item = data.item;
  //     let user = data.user;
  //     let oldJp={};
  //     let maintenanceService = ServiceLocator.resolve('MaintenanceService');

  //     try
  //     {
  //         if(item && item.code && item.code!='')
  //         {
  //             let JPModel = ServiceLocator.resolve("JourneyPlanModel");
  //             oldJp = await JPModel.findOne({_id:item.code}).exec();
  //         }

  //         let additional = utils.substractObjects(item.optParam1, oldJp);
  //         let tasks = additional.tasks ? additional.tasks : [];
  //         for(const task of tasks)
  //         {
  //             let issues = task && task.issues ? task.issues:[];

  //             for(const issue of issues)
  //             {
  //                 if(issue && issue.timeStamp) // new issue being logged, check for creating maintenance
  //                 {
  //                     // if issue.typeOfAction==ImmediateFix then maintenanceState=fixed
  //                     //
  //                     if(issue.priority!="Info")
  //                     {
  //                         //create a maintenance
  //                         await maintenanceService.createNewMaintenance(issue, user, item.code, oldJp.workplanTemplateId ? oldJp.workplanTemplateId : issue.workplanTemplateId ? issue.workplanTemplateId : '' );
  //                     }
  //                     //console.log('new=>', issue.timeStamp, issue.description,{issue});
  //                 }
  //             }
  //         }
  //     }
  //     catch(err)
  //     {
  //         console.log('DataOperationsLogic:JPUpdateRequestCallback, catch:', err.toString());
  //         this.logger.error(err, err.toString());
  //     }
  // }

  async JPUpdateCallback(data) {
    let item = data.item;
    let user = data.user;
    //this.logger.info('JPUpdateCallback: code: '+ item.code);
    //console.log('actual cb : code : ' + item.code);
    // check if this jp is new and being created
    try {
      if (item.code == "" || item.code == null) {
        let wptId = item.optParam1.workplanTemplateId; // TODO: Discuss to make sure 'workplanTemplateId' being transmitted

        if (wptId) {
          let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
          workPlanTemplateService.workPlanExecuted(item, wptId);

          //   let WPTModel = ServiceLocator.resolve("WorkPlanTemplateModel");

          //   WPTModel.findOne({ _id: wptId }).exec((err, wpt) => {
          //     //console.log('WorkplanTemplate: '+ wpt);
          //     if (wpt) {
          //       wpt.lastInspection = new Date();
          //       wpt.nextInspectionDate = new Date();
          //       wpt.nextInspectionDate.setDate(wpt.nextInspectionDate.getDate() + wpt.inspectionFrequency);
          //       wpt.markModified("nextInspectionDate");
          //       wpt.markModified("lastInspection");
          //       wpt.save((err, result) => {
          //         if (err) {
          //           this.logger.error("Error saving inspeciton dates: user:" + user.email + ", err:" + err);
          //           console.log(err);
          //         }
          //       });
          //     } else {
          //       this.logger.warn("wptId: " + wptId + " not found, not updating nextInspectionDate, user:" + user.email);
          //       console.log("wptId: " + wptId + " not found, not updating nextInspectionDate");
          //     }
          //   });
        } else {
          this.logger.warn("workplanTemplateId not included in call to create inspection, user:" + user.email);
        }
      } else {
        // let DBService = ServiceLocator.resolve("DBService");
        // DBService.updateInspectionConditions(item);
        let socketIO = ServiceLocator.resolve("SocketIOService");
        socketIO.inspectionUpdated(item.code);
      }
    } catch (error) {
      console.log(error);
      this.logger.error("catch: err:" + error);
    }
  }

  JPUpdateCallbackForAlertRecalculate(data) {
    let item = data.item;
    try {
      let alertService = ServiceLocator.resolve("AlertService");
      // JPUpdateCallbackForAlertRecalculate(data) {
      //   let item = data.item;
      //   try {
      //     let alertService = ServiceLocator.resolve("AlertService");

      if (!item.code || item.code == "") {
        alertService.recalculateAlertMonitoringByModelId(item.optParam1.workplanTemplateId);
      }
    } catch (error) {
      console.log(error);
      this.logger.error("DataOperationsLogin:JPUpdateCallbackForAlertRecalculate:catch: err:" + error);
    }
  }
  //     if (item.code) {
  //       alertService.recalculateAlertMonitoringByModelId(item.optParam1.workplanTemplateId);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     this.logger.error("DataOperationsLogin:JPUpdateCallbackForAlertRecalculate:catch: err:" + error);
  //   }
  // }
}
