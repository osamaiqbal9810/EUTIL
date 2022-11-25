let ServiceLocator = require("../../framework/servicelocator");
let MaintenanceModel = require("./Maintenance.model");
var ObjectId = require("mongodb").ObjectID;
let _ = require("lodash");

class MaintenanceService {
  constructor() {}

  makeNewCode(prefix, separator, startNumber, length, currentMax) {
    let utils = ServiceLocator.resolve("utils");
    //let number = 1, len = 4;
    let mcode = prefix + separator + utils.assureDigits(length, startNumber); //"MR#0001";

    //if (ment1 && ment1.length > 0 && ment1[0].mrNumber) mwocode = ment1[0].mrNumber;
    if (currentMax && typeof currentMax == "string" && currentMax.length > length) {
      mcode = currentMax;
    }

    if (mcode.includes(separator) && parseInt(mcode.split(separator)[1]) != NaN) {
      let s = mcode.split(separator)[1];
      length = s.length;
      startNumber = parseInt(s);
      if (startNumber.toString().length < (startNumber + 1).toString().length && s[0] != "0") length++;

      startNumber++;
    }

    let newCode = prefix + separator + utils.assureDigits(length, startNumber.toString());

    return newCode;
  }

  async workOrderNumberCreator() {
    let utils = ServiceLocator.resolve("utils");
    let ment1 = await MaintenanceModel.find().sort({ workOrderNumber: -1 }).limit(1).exec();

    let mrcode = "MWO#0001";
    if (ment1 && ment1.length > 0 && ment1[0].workOrderNumber) mrcode = ment1[0].workOrderNumber;

    mrcode = this.makeNewCode("MWO", "#", 1, 4, mrcode);

    return mrcode;
  }

  async maintainenceReqNumberCreator() {
    let utils = ServiceLocator.resolve("utils");
    let ment1 = await MaintenanceModel.find().sort({ mrNumber: -1 }).limit(1).exec();

    let mrcode = "MR#0001";
    if (ment1 && ment1.length > 0 && ment1[0].mrNumber) mrcode = ment1[0].mrNumber;

    mrcode = this.makeNewCode("MR", "#", 1, 4, mrcode);

    return mrcode;
  }
  async createNewMaintenanceFromIssue(issue, user, inspection) {
    let maintenanceCreated = null;
    try {
      if (issue && user && issue.planId) {
        //inspectionRun)
        let inspectionId = issue.planId; //
        let wPlanTemplate = ServiceLocator.resolve("WorkPlanTemplateModel");
        let utils = ServiceLocator.resolve("utils");
        let assetService = ServiceLocator.resolve("AssetsService");

        let inspectionRun = inspection.workplanTemplateId;
        let newMrCode = await this.maintainenceReqNumberCreator();

        let wpt = await wPlanTemplate.findOne({ _id: inspectionRun }).exec();
        let lineId = wpt.lineId;
        let lineasset = await assetService.find(lineId);
        lineasset = lineasset.value ? lineasset.value : null;
        let lineName = lineasset ? lineasset.unitId : "";

        let subdivision = await this.getLineSubdivision(lineId);

        // subdivision: wpt.subdivision ? wpt.subdivision : inspection.subdivision ? inspection.subdivision : '';

        let maint1 = {
          tenantId: user.tenantId,
          lineId: lineId,
          lineName: lineName ? lineName : "",
          mrNumber: newMrCode,
          description: issue.description,
          images: issue.imgList ? [...issue.imgList] : [],
          voices: issue.voiceList ? [...issue.voiceList] : [],
          coordinates: issue.location,
          location: this.addLocation([], issue.location, "GPS"),
          markedOnSite: issue.marked,
          priority: issue.priority,
          asset: issue.unit,
          sourceType: "app-issue",
          createdBy: { id: user.id, name: user.name, email: user.email },
          inspectionRun: inspectionRun,
          inspection: inspectionId,
          timestamp: issue.timeStamp,
          status: "New",
          defectCodes: issue.defectCodes,
          attributes: {},
          maintenanceType: issue.maintenanceType ? issue.maintenanceType : "other",
          subdivision: subdivision,
          issueId: issue.uniqueGuid ? issue.uniqueGuid : "",
          maintenanceRole: issue.serverObject && issue.serverObject.maintenanceRole,
          issue: _.cloneDeep(issue),
        };
        if ((issue.startMP && issue.endMP) || (issue.startMp && issue.endMp)) {
          let start = utils.toFixed(issue.startMP ? issue.startMP : issue.startMp);
          let end = utils.toFixed(issue.endMP ? issue.endMP : issue.endMp);
          if (start > end) {
            // swap if start is greater than end
            let end1 = end;
            end = start;
            start = end1;
          }
          maint1.location.push({ start: start, end: end, type: "Milepost" });
        }
        if (issue.startMarker && issue.endMarker) {
          maint1.location.push({ start: issue.startMarker, end: issue.endMarker, type: "Marker" });
        }
        let savedMaintenance = await MaintenanceModel.create(maint1);
        if (savedMaintenance) {
          maintenanceCreated = savedMaintenance;
        }
      } else {
        /*todo log*/
      }
    } catch (err) {
      maintenanceCreated = null;
      console.log("maintenance.service.createNewMaintenance error:", err.toString());
    }

    return maintenanceCreated;
  }
  //"createNewMaintenance" NOT BEING USER ANYMORE , instead 'createNewMaintenanceFromIssue' is being used now
  // async createNewMaintenance(
  //   issue,
  //   user, // inspection,  inspectionRun, //create new maintenance based on an issue
  // ) {
  //   let resultObj = { value: "Ok", status: 200 };

  //   try {
  //     if (issue && user && issue.planId) {
  //       //inspectionRun)
  //       let inspectionId = issue.planId; //
  //       let jpModel = ServiceLocator.resolve("JourneyPlanModel");
  //       let wPlanTemplate = ServiceLocator.resolve("WorkPlanTemplateModel");
  //       let utils = ServiceLocator.resolve("utils");
  //       let inspection = await jpModel.findOne({ _id: inspectionId }).exec();
  //       let inspectionRun = inspection.workplanTemplateId;
  //       let newMrCode = await this.maintainenceReqNumberCreator();

  //       let wpt = await wPlanTemplate.findOne({ _id: inspectionRun }).exec();
  //       let lineId = wpt.lineId;

  //       let subdivision = await this.getLineSubdivision(lineId);

  //       // subdivision: wpt.subdivision ? wpt.subdivision : inspection.subdivision ? inspection.subdivision : '';

  //       let maint1 = {
  //         tenantId: user.tenantId,
  //         lineId: lineId,
  //         lineName: wpt.lineName ? wpt.lineName : "",
  //         mrNumber: newMrCode,
  //         description: issue.description,
  //         images: issue.imgList ? [...issue.imgList] : [],
  //         voices: issue.voiceList ? [...issue.voiceList] : [],
  //         coordinates: issue.location,
  //         location: this.addLocation([], issue.location, "GPS"),
  //         markedOnSite: issue.marked,
  //         priority: issue.priority,
  //         asset: issue.unit,
  //         sourceType: "app-issue",
  //         createdBy: { id: user.id, name: user.name, email: user.email },
  //         inspectionRun: inspectionRun,
  //         inspection: inspectionId,
  //         timestamp: issue.timeStamp,
  //         status: "New",
  //         defectCodes: issue.defectCodes,
  //         attributes: {},
  //         maintenanceType: issue.maintenanceType ? issue.maintenanceType : "other",
  //         subdivision: subdivision,
  //       };
  //       if (issue.startMP && issue.endMP) {
  //         let start = utils.toFixed(issue.startMP);
  //         let end = utils.toFixed(issue.endMP);
  //         maint1.location.push({ start: start, end: end, type: "Milepost" });
  //       }

  //       MaintenanceModel.create(maint1, (err, result) => {
  //         if (err) {
  //           console.log("error creating new maintenance based on issue");
  //           // todo error log
  //           return;
  //         }
  //         if (result) {
  //           // update issue to include MR. reference and change issue's status.
  //           const [jIndex, tIndex, iIndex] = issue.index.split("-");
  //           inspection.tasks[tIndex].issues[iIndex].status = "Resolved";
  //           inspection.tasks[tIndex].issues[iIndex].mrNumber = result.mrNumber;
  //           inspection.tasks[tIndex].issues[iIndex].maintenanceId = result._id;

  //           inspection.markModified("tasks");
  //           inspection.save();
  //         }
  //       });
  //     } else {
  //       /*todo log*/
  //     }
  //   } catch (err) {
  //     resultObj = { errorVal: err.toString(), status: 500 };
  //     console.log("maintenance.service.createNewMaintenance error:", err.toString());
  //   }

  //   return resultObj;
  // }
  async getAll(user) {
    let resultObj = { status: 500, errorVal: "default" };
    try {
      let maintenances = [];
      let criteria = {};
      let assetService = ServiceLocator.resolve("AssetsService");

      let assetIds = await assetService.getFilteredAssetsIds(user, { plannable: true }, true);

      if (assetIds && assetIds.assetIds && assetIds.assetIds.length > 0) {
        let ids = assetIds.assetIds;

        criteria.lineId = { $in: ids };
        maintenances = await MaintenanceModel.find(criteria);
      }

      resultObj = { value: maintenances, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("maintenance.service.getAll.catch", err.toString());
    }

    return resultObj;
  }
  async get(id, user) {
    let resultObj = {},
      criteria = { _id: id };

    // if (!user.isAdmin) criteria.subdivision = user.subdivision;

    try {
      let maintenance = await MaintenanceModel.findOne(criteria);
      let s = 0;
      resultObj = { value: maintenance, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("maintenance.service.get.catch", err.toString());
    }

    return resultObj;
  }

  addLocation(loc, loc2Add, type) {
    if (loc2Add instanceof Array) {
      console.log("maintenance service, location parse error: ", loc2Add, "type:", type);
    } else if (typeof loc2Add === "string" || loc2Add instanceof String) {
      if (type === "GPS") {
        // if GPS then a location should be lat, long
        let locations = loc2Add.split(",");

        let start = { lat: locations[0], lon: locations[1] },
          end = { lat: locations[0], lon: locations[1] };

        if (locations.length > 2) {
          console.log("maintenance service, location parse error: ", loc2Add, "type:", type);
          if (locations.length == 4) {
            end = { lat: locations[2], lon: locations[3] };
          }
        } else {
          start = { lat: locations[0], lon: locations[1] };
          end = { lat: locations[0], lon: locations[1] };
        }
        loc.push({
          start: start,
          end: end,
          type: type,
        });
      } else {
        console.log("maintenance service, location parse error: ", loc2Add, "type:", type);
      }
    }

    return loc;
  }
  async createFromWeb(mntnce, user) {
    let resultObj;
    let utils = ServiceLocator.resolve("utils");
    try {
      let copyMntnce = { ...mntnce };
      copyMntnce.status = "New";

      // If it is a history recored and status should be closed
      if (mntnce.closedDate) copyMntnce.status = "Closed";

      copyMntnce.sourceType = "web-issue";
      copyMntnce.mrNumber = await this.maintainenceReqNumberCreator();
      copyMntnce.createdBy = { id: user._id.toString(), name: user.name, email: user.email };

      // if (!copyMntnce.subdivision || copyMntnce.subdivision === "") {
      //   copyMntnce.subdivision = await this.getLineSubdivision(copyMntnce.lineId);
      // }

      if (copyMntnce.location && copyMntnce.location.length) {
        for (let l1 of copyMntnce.location) {
          if (l1.type === "Milepost") {
            l1.start = utils.toFixed(l1.start);
            l1.end = utils.toFixed(l1.end);
          }
        }
      }

      let newMntnce = new MaintenanceModel(copyMntnce);
      let savedMntnce = await newMntnce.save();
      resultObj = { value: savedMntnce, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("maintenance.service.createFromWeb.catch", err.toString());
    }
    return resultObj;
  }
  async updateFromWeb(mntnce) {
    let resultObj;

    try {
      let mntnceToUpdate = await MaintenanceModel.findOne({ _id: mntnce._id }).exec();
      if (mntnceToUpdate) {
        // if (mntnceToUpdate.status === "New") {
        //   if (mntnce.dueDate && mntnce.assignedTo && mntnce.priority) {
        //     mntnceToUpdate.dueDate = mntnce.dueDate;
        //     mntnceToUpdate.assignedTo = mntnce.assignedTo;
        //     mntnceToUpdate.priority = mntnce.priority;

        //     // assign workOrderNumber
        //     mntnceToUpdate.workOrderNumber = await this.workOrderNumberCreator();
        //     // change status
        //     mntnceToUpdate.status = "Planned";

        //     mntnceToUpdate.markModified("dueDate");
        //     mntnceToUpdate.markModified("assignedTo");
        //   }
        // }

        if (
          mntnceToUpdate.status === "New" ||
          mntnceToUpdate.status === "Planning" ||
          mntnceToUpdate.status === "Planned" ||
          mntnceToUpdate.status === "In Progress"
        ) {
          // allow change of estimate for In Progress status maintenances
          if (mntnce.estimate && mntnce.estimate.length > 0) {
            mntnceToUpdate.estimate = _.cloneDeep(mntnce.estimate);
            mntnceToUpdate.estimateHistoryRecord = _.cloneDeep(mntnce.estimateHistoryRecord);

            if (mntnceToUpdate.status === "New") mntnceToUpdate.status = "Planning";
            mntnceToUpdate.markModified("estimate");
            mntnceToUpdate.markModified("status");
          }

          if ((mntnceToUpdate.status === "New" || mntnceToUpdate.status === "Planning") && mntnce.closedDate) {
            mntnceToUpdate.workOrderNumber = mntnce.workOrderNumber;
            mntnceToUpdate.executionDate = mntnce.executionDate;
            mntnceToUpdate.closedDate = mntnce.closedDate;

            //mntnceToUpdate.status = mntnce.status; // do not update status from front-end. It should only be changed by server
            if (mntnce.closedDate) mntnceToUpdate.status = "Closed";

            mntnceToUpdate.markModified("status");
            mntnceToUpdate.markModified("executionDate");
            mntnceToUpdate.markModified("workOrderNumber");
            mntnceToUpdate.markModified("closedDate");
          }

          mntnceToUpdate.priority = mntnce.priority;
          mntnceToUpdate.markModified("priority");
        }
        // if (mntnceToUpdate.status === "Planned" && mntnce.executionDate) {
        //   mntnceToUpdate.executionDate = mntnce.executionDate;
        //   mntnceToUpdate.markModified("executionDate");

        //   mntnceToUpdate.status = "In Progress";
        // }

        // if (mntnceToUpdate.status === "In Progress" && mntnce.closedDate) {
        //   mntnceToUpdate.closedDate = mntnce.closedDate;
        //   mntnceToUpdate.markModified("closedDate");

        //   mntnceToUpdate.status = "Closed";
        // }

        // no need to update following
        if (mntnce.description) {
          mntnceToUpdate.description = mntnce.description;
          mntnceToUpdate.markModified("description");
        }

        if (mntnce.location && mntnce.sourceType !== "app-issue") {
          mntnceToUpdate.location = mntnce.location;
          mntnceToUpdate.markModified("location");
        }

        if (mntnce.maintenanceType) {
          mntnceToUpdate.maintenanceType = mntnce.maintenanceType;
          mntnceToUpdate.markModified("maintenanceType");
        }

        if (mntnce.documents) {
          mntnceToUpdate.documents = mntnce.documents;
          mntnceToUpdate.markModified("documents");
        }

        if (mntnce.images) {
          mntnceToUpdate.images = mntnce.images;
          mntnceToUpdate.markModified("images");
        }

        if (mntnce.voices) {
          mntnceToUpdate.voices = mntnce.voices;
          mntnceToUpdate.markModified("voices");
        }

        if (mntnce.location) {
          if (mntnce.location && mntnce.location.length) {
            let utils = ServiceLocator.resolve("utils");
            for (let l1 of mntnce.location) {
              if (l1.type === "Milepost") {
                l1.start = utils.toFixed(l1.start);
                l1.end = utils.toFixed(l1.end);
              }
            }
          }

          mntnceToUpdate.location = mntnce.location;
          mntnceToUpdate.markModified("location");
        }
        if (
          mntnceToUpdate.status !== "In Progress" &&
          mntnceToUpdate.status !== "Closed" &&
          mntnceToUpdate.status !== "Complete" &&
          mntnce.maintenanceRole
        ) {
          mntnceToUpdate.maintenanceRole = mntnce.maintenanceRole;
        }
        let updatedMntnce = await mntnceToUpdate.save();

        // Remove alerts of closed MR of Rule213b issue
        if (updatedMntnce.status === "Closed" && mntnce.issueId) {
          let alertService = ServiceLocator.resolve("AlertService");
          alertService.deleteIssueAlerts(mntnce.issueId);
        }

        resultObj = { value: updatedMntnce, status: 200 };
      } else {
        resultObj = { errorVal: "Not Found", status: 404 };
      }
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("maintenanc.service.updateFromWeb.catch", err.toString());
    }
    return resultObj;
  }
  async multiLineMaintenance(lines) {
    let resultObj = {},
      maintenances;

    try {
      let criteria = { lineId: { $in: lines } };
      maintenances = await MaintenanceModel.find(criteria);
      resultObj = { value: maintenances, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("maintenance.service.multiLineMaintenance.catch", err.toString());
    }

    return resultObj;
  }
  async getLineSubdivision(lineId) {
    try {
      let AssetsModel = ServiceLocator.resolve("AssetsModel");
      let line = await AssetsModel.findOne({ _id: lineId }).exec();
      if (!line || !line.subdivision || line.subdivision === "") {
        // todo: log
        console.log("Error while getting subdivision: lineId:", lineId);
        return "";
      }

      return line.subdivision;
    } catch (err) {
      console.log("maintenance.service.getLineSubdivision.catch:", err.toString());
    }

    return "";
  }
  async setWorkOrderNumber(maintenanceList, workOrderNumber, valuesObj) {
    // if workOrderNumber !== null, check to verify if current workOrderNumber in null, otherwise do not set and generate an error
    // if workOrderNumber === null, then optionally may check if current workOrderNumber is not null
    try {
      if (maintenanceList && maintenanceList.length) {
        for (let mr of maintenanceList) {
          let mrObj = await MaintenanceModel.findOne({ mrNumber: mr }).exec();
          if (mrObj) {
            mrObj.workOrderNumber = workOrderNumber;
            if (workOrderNumber) {
              mrObj.status !== "Complete" &&
                mrObj.status !== "In Progress" &&
                mrObj.status !== "Closed" &&
                (mrObj.maintenanceRole = "CapitalPlan");
            } else {
              mrObj.maintenanceRole == "CapitalPlan" && (mrObj.maintenanceRole = "WorkOrder");
            }
            if (valuesObj) {
              let keys = Object.keys(valuesObj);
              for (let key of keys) {
                if (key !== "status" || (mrObj[key] != "Complete" && mrObj[key] != "Closed")) {
                  mrObj[key] = valuesObj[key];
                }
              }
            }

            await mrObj.save();
          }
        }
      }
    } catch (err) {
      console.log("maintenance.service.setWorkOrderNumber.catch:", err.toString());
    }
  }
  async getByMRNoList(MrNoList, user, beefOut = false) {
    let resultObj = { errorVal: "default", status: 500 },
      maintenances;

    try {
      let criteria = { mrNumber: { $in: MrNoList } };
      let query = MaintenanceModel.find(criteria);

      if (beefOut) query.select("_id location description mrNumber priority createdAt createdBy maintenanceType");

      maintenances = await query.exec();
      resultObj = { value: maintenances, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("maintenance.service.getByMRNoList.catch", err.toString());
    }

    return resultObj;
  }

  async setMRsFields(
    maintenanceList,
    valuesObj, // {status: 'Planned', dueDate:'12/12/12'}
    checkComplete,
    user,
  ) {
    try {
      if (maintenanceList && maintenanceList.length) {
        let maintenances = await MaintenanceModel.find({ mrNumber: { $in: maintenanceList } });
        for (let mntnce of maintenances) {
          if (checkComplete ? mntnce.status !== "Complete" && mntnce.status !== "In Progress" && mntnce.status !== "Closed" : true) {
            await MaintenanceModel.update({ mrNumber: mntnce.mrNumber }, valuesObj);
          } else if (valuesObj.dueDate) {
            await MaintenanceModel.update({ mrNumber: mntnce.mrNumber }, { dueDate: valuesObj.dueDate });
          }
        }
        if (valuesObj && valuesObj.status && (valuesObj.status === "Closed" || valuesObj.status === "Complete")) {
          // if closed then set the repairDate in corresponding issue to closedDate
          for (let mntnance1 of maintenances) {
            // Remove alerts of closed MR of Rule213b issue
            if (mntnance1.issueId) {
              let alertService = ServiceLocator.resolve("AlertService");
              alertService.deleteIssueAlerts(mntnance1.issueId);
            }
          }

          let jpService = ServiceLocator.resolve("JourneyPlanService");
          for (let m1 of maintenanceList) {
            let maint1 = maintenances.find((m) => {
              return m.mrNumber === m1;
            });
            let associatedIssue = await jpService.findIssueByMRno(maint1.inspection, m1);

            if (associatedIssue) {
              if (!associatedIssue.serverObject) associatedIssue.serverObject = {};
              // associatedIssue.closeReason = m1;
              let issueObj = { action: "Close", issue: associatedIssue };
              await jpService.updateIssue(issueObj, null);
              user && (associatedIssue.serverObject.repairedBy = user);
              associatedIssue.serverObject.repairDate = valuesObj.closedDate;
              await jpService.updateIssue({ action: "serverChanges", issue: associatedIssue }, null);
            }
          }
        }
      }
    } catch (err) {
      console.log("maintenance.service.setMRsFields.catch:", err.toString());
    }
  }

  async filterForUser(
    maintenances,
    user,
    tzMinutes, // this function is called from listHelper based on criteria.customFilter in ApplicationLookups in database
  ) {
    let opt2 = {
      InspectorWork: ["inspector"],
      Maintainer: ["maintenance"],
    };

    let toReturn = this.filterMaintenanceRequestsByGroupId(maintenances, user, opt2);

    return toReturn;
  }
  filterMaintenanceRequestsByGroupId(mrs, user, mWorkLookup) {
    let mrsToRet = [];
    if (mrs && user && mWorkLookup) {
      for (let mr of mrs) {
        if (mr.maintenanceRole) {
          let exist = _.find(mWorkLookup[mr.maintenanceRole], (gId) => {
            return gId == user.group_id;
          });
          if (exist && mr.status !== "Complete") {
            mrsToRet.push(this.filteredMrForApp(mr));
          }
        }
      }
    }
    return mrsToRet;
  }

  filteredMrForApp(mr) {
    let mrToRet = mr;
    return mrToRet;
  }
}
var maintenanceService = new MaintenanceService();
ServiceLocator.register("MaintenanceService", maintenanceService);
module.exports = maintenanceService;
