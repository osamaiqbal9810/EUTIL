let ServiceLocator = require("../../framework/servicelocator");
let WorkOrderModel = require("./WorkOrder.model");
let UserModel = require("../user/user.model");
var ObjectId = require("mongodb").ObjectID;
let _ = require("lodash");
import moment from "moment-timezone";

class WorkOrderService {
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

  async createNewMWONumber() {
    let utils = ServiceLocator.resolve("utils");
    let wo1 = await WorkOrderModel.find().sort({ mwoNumber: -1 }).limit(1).exec();

    let mwocode = "MWO#0001";
    if (wo1 && wo1.length > 0 && wo1[0].mwoNumber) mwocode = wo1[0].mwoNumber;

    mwocode = this.makeNewCode("MWO", "#", 1, 4, mwocode);

    return mwocode;
  }
  async create(workOrder, user) {
    let resultObj = { value: "default", status: 200 };
    try {
      if (workOrder.mwoNumber) {
        resultObj = { errorVal: "mwoNumber already assigned, cannot create WO", status: 500 };
        return resultObj;
      }
      if (workOrder.locationId && workOrder.locationName && user) {
        let newMwoCode = await this.createNewMWONumber();
        let assignedUser = {};
        if (workOrder.assignedTo !== undefined && workOrder.assignedTo.id) {
          assignedUser = await UserModel.findOne({ _id: workOrder.assignedTo.id });
          assignedUser = { id: assignedUser._id, name: assignedUser.name, email: assignedUser.email };
        }

        let mwo1 = {
          tenantId: user.tenantId,
          locationId: workOrder.locationId,
          locationName: workOrder.locationName,
          estimate: workOrder.estimate,
          description: workOrder.description ? workOrder.description : "",
          maintenanceRequests: workOrder.maintenanceRequests ? workOrder.maintenanceRequests : [],
          priority: workOrder.priority,
          dueDate: workOrder.dueDate,
          createdBy: { id: user._id, name: user.name, email: user.email },
          assignedTo: assignedUser,
          title: workOrder.title,
          status: workOrder.dueDate ? "Planned" : "New",
          mwoNumber: newMwoCode,
        };

        if (mwo1.dueDate) mwo1.dueDate = await this.applyTimezone(mwo1.dueDate, workOrder.locationId);

        let result = await WorkOrderModel.create(mwo1);
        if (result) {
          let maintenanceService = ServiceLocator.resolve("MaintenanceService");
          if (mwo1.maintenanceRequests.length > 0) {
            await maintenanceService.setWorkOrderNumber(mwo1.maintenanceRequests, mwo1.mwoNumber);
            if (mwo1.status !== "New") {
              await maintenanceService.setMRsFields(mwo1.maintenanceRequests, { status: mwo1.status, dueDate: mwo1.dueDate });
            }
          }
        }
        resultObj = { value: result, status: 200 };
      } else {
        resultObj = { errorVal: "locationId, locationName and user are required", status: 500 };
      }
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("workorder.service.create.catch:", err.toString());
    }

    return resultObj;
  }

  // async createByMaintenanceRequest(maintenanceRequest, user) {
  //   let resultObj = { value: "Ok", status: 200 };

  //   try {
  //     if (maintenanceRequest && maintenanceRequest.mrCode) {
  //       let newMwoCode = await this.createNewMWONumber();
  //       let locationId = maintenanceRequest.lineId;
  //       let locationName = maintenanceRequest.lineName;

  //       let mwo1 = {
  //         tenantId: maintenanceRequest.tenantId ? maintenanceRequest.tenantId : user.tenantId,
  //         locationId: locationId,
  //         locationName: locationName,
  //         description: "",
  //         maintenanceRequests: [maintenanceRequest.mrNumber],
  //         priority: maintenanceRequest.priority,

  //         createdBy: { id: user._id, name: user.name, email: user.email },

  //         status: "New",
  //         mwoNumber: newMwoCode,
  //       };

  //       let result = await WorkOrderModel.create(mwo1);
  //       if (result) {
  //         // Change MaintenanceRequest's status to 'WorkOrderCreated'
  //         maintenanceRequest.status = "WorkOrderCreated";
  //         maintenanceRequest.workOrderId = result._id;
  //         // maintenanceRequest.save(); // would this be a model ?
  //       }
  //       resultObj = { value: result, status: 200 };
  //     } else {
  //       resultObj = { value: "Invalid maintenance request", status: 404 };
  //     }
  //   } catch (err) {
  //     resultObj = { errorVal: err.toString(), status: 500 };
  //     console.log("workorder.service.createByMaintenanceRequest.catch:", err.toString());
  //   }

  //   return resultObj;
  // }
  async getAll(user) {
    let resultObj = { errorVal: "default", status: 500 };
    try {
      let criteria = {}; //{ lineId: lineid };
      // let assetTreeService = ServiceLocator.resolve("AssetsTreeService");
      // let result = await assetTreeService.getPlannableLocations(user);
      // let plannableLocations = result.value ? result.value : [];

      let assetsService = ServiceLocator.resolve("AssetsService");

      let assetIds = await assetsService.getFilteredAssetsIds(user, { plannable: true, location: true }, true);

      if (assetIds.assetIds) {
        criteria.locationId = { $in: assetIds.assetIds };
      }

      let workOrders = await WorkOrderModel.find(criteria);
      resultObj = { value: workOrders, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("workorder.service.getAll.catch", err.toString());
    }

    return resultObj;
  }
  async getLocationWO(loc) {
    let resultObj = { errorVal: "default", status: 500 };
    try {
      let criteria = { locationId: loc };
      let workOrders = await WorkOrderModel.find(criteria);
      resultObj = { value: workOrders, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("workorder.service.getAll.catch", err.toString());
    }

    return resultObj;
  }
  async getNotStarted(user) {
    let resultObj = { errorVal: "default", status: 500 };
    try {
      let criteria = { status: { $in: ["New", "Planned"] } }; //{ lineId: lineid };
      let assetTreeService = ServiceLocator.resolve("AssetsTreeService");
      let result = await assetTreeService.getPlannableLocations(user);
      let plannableLocations = result.value ? result.value : [];

      criteria.locationId = { $in: plannableLocations };
      let workOrders = await WorkOrderModel.find(criteria);
      resultObj = { value: workOrders, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("workorder.service.getAll.catch", err.toString());
    }

    return resultObj;
  }
  async get(id, user) {
    let resultObj = { errorVal: "default", status: 500 },
      criteria = { _id: id };

    try {
      let assetTreeService = ServiceLocator.resolve("AssetsTreeService");
      let maintenanceService = ServiceLocator.resolve("MaintenanceService");

      let result = await assetTreeService.getPlannableLocations(user);
      let plannableLocations = result.value ? result.value : [];

      criteria.locationId = { $in: plannableLocations };

      let workorder = await WorkOrderModel.findOne(criteria);
      let res = await maintenanceService.getByMRNoList(workorder.maintenanceRequests, user, true);

      if (res && res.value) workorder.maintenanceRequests = res.value;

      resultObj = { value: workorder, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("workorder.service.get.catch", err.toString());
    }

    return resultObj;
  }

  async update(workOrder, user) {
    let resultObj = { errorVal: "default", status: 500 };
    try {
      let woToUpdate = null;
      if (workOrder._id) woToUpdate = await WorkOrderModel.findOne({ _id: workOrder._id }).exec();
      else woToUpdate = await WorkOrderModel.findOne({ mwoNumber: workOrder.mwoNumber }).exec();

      if (woToUpdate) {
        if (workOrder.maintenanceRequests && Array.isArray(workOrder.maintenanceRequests)) {
          // set old maintenanceRequests free, and set new maintenanceRequests to this WO
          let mrsToInclude = _.difference(workOrder.maintenanceRequests, woToUpdate.maintenanceRequests);
          let mrsToExclude = _.difference(woToUpdate.maintenanceRequests, workOrder.maintenanceRequests);

          let maintenanceService = ServiceLocator.resolve("MaintenanceService");
          if (mrsToInclude.length > 0) await maintenanceService.setWorkOrderNumber(mrsToInclude, workOrder.mwoNumber);

          if (mrsToExclude.length > 0)
            await maintenanceService.setWorkOrderNumber(mrsToExclude, null, {
              status: "New",
              dueDate: null,
            });

          woToUpdate.maintenanceRequests = workOrder.maintenanceRequests;

          // console.log('exclude', mrsToExclude, ' - ', 'include:', mrsToInclude);
        }

        if (workOrder.maintenanceRequests && Array.isArray(workOrder.maintenanceRequests)) {
          // set old estimate free, and set new estimate to this WO
          let estimateToInclude = _.difference(workOrder.estimate, woToUpdate.estimate);
          let estimateToExclude = _.difference(woToUpdate.estimate, workOrder.estimate);

          let maintenanceService = ServiceLocator.resolve("MaintenanceService");
          if (estimateToInclude.length > 0) await maintenanceService.setWorkOrderNumber(estimateToInclude, workOrder.mwoNumber);

          if (estimateToExclude.length > 0) await maintenanceService.setWorkOrderNumber(estimateToExclude, null);

          woToUpdate.estimate = workOrder.estimate;

          // console.log('exclude', estimateToExclude, ' - ', 'include:', estimateToInclude);
        }

        if ((woToUpdate.status === "New" || woToUpdate.status === "Planned") && workOrder.dueDate) {
          // if dueDate, assignedTo and priority are added, change status to 'Planned'
          const desiredStatus = "Planned";

          woToUpdate.dueDate = await this.applyTimezone(workOrder.dueDate, woToUpdate.locationId);
          woToUpdate.status = desiredStatus;

          let maintenanceService = ServiceLocator.resolve("MaintenanceService");
          await maintenanceService.setMRsFields(
            woToUpdate.maintenanceRequests,
            {
              status: desiredStatus,
              dueDate: workOrder.dueDate,
            },
            true,
          );
        } else if (woToUpdate.status === "Planned" && workOrder.executionDate) {
          // set execution date
          // set status to 'InProgress'
          const desiredStatus = "In Progress";
          woToUpdate.executionDate = await this.applyTimezone(workOrder.executionDate, woToUpdate.locationId);
          woToUpdate.status = desiredStatus;

          let maintenanceService = ServiceLocator.resolve("MaintenanceService");
          await maintenanceService.setMRsFields(woToUpdate.maintenanceRequests, {
            status: desiredStatus,
            executionDate: workOrder.executionDate,
          });
        } else if (woToUpdate.status === "In Progress" && workOrder.closedDate) {
          // set closedDate and status='Closed'
          const desiredStatus = "Closed";
          woToUpdate.closedDate = await this.applyTimezone(workOrder.closedDate, woToUpdate.locationId);

          woToUpdate.status = desiredStatus;
          let maintenanceService = ServiceLocator.resolve("MaintenanceService");
          await maintenanceService.setMRsFields(woToUpdate.maintenanceRequests, {
            status: desiredStatus,
            closedDate: workOrder.closedDate,
          });
        }

        if (workOrder.description && workOrder.description !== "" && woToUpdate.description !== workOrder.description)
          woToUpdate.description = workOrder.description;

        if (workOrder.priority && workOrder.priority !== "" && woToUpdate.priority !== workOrder.priority)
          woToUpdate.priority = workOrder.priority;

        let assignedUser = {};
        if (workOrder.assignedTo !== undefined && workOrder.assignedTo.id) {
          assignedUser = await UserModel.findOne({ _id: workOrder.assignedTo.id });
          woToUpdate.assignedTo = { id: assignedUser._id, name: assignedUser.name, email: assignedUser.email };
        }
        if (workOrder.title && workOrder.title !== "" && woToUpdate.title !== workOrder.title) woToUpdate.title = workOrder.title;

        let updatedWo = await woToUpdate.save();
        resultObj = { value: updatedWo, status: 200 };
      } else {
        resultObj = { errorVal: "Not Found", status: 404 };
      }
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("workorder.service.update.catch", err.toString());
    }
    return resultObj;
  }
  async delete(id, user) {
    let resultObj = { errorVal: "default", status: 500 },
      criteria = { _id: id };

    try {
      // todo implement delete, unset all MRS' workOrderNumber field
      // console.log('implement delete workorder', id, 'by', user);

      let woToDelete = await WorkOrderModel.findOne(criteria);
      if (woToDelete) {
        let maintenanceService = ServiceLocator.resolve("MaintenanceService");
        await maintenanceService.setWorkOrderNumber(woToDelete.maintenanceRequests, null);

        let res = await WorkOrderModel.remove(criteria);
        resultObj = { value: res, status: 200 };
      } else {
        resultObj = { errorVal: "Could not find the workorder", status: 404 };
      }
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("workorder.service.delete.catch", err.toString());
    }

    return resultObj;
  }
  async applyTimezone(date, locationId) {
    // apply plannable location asset's timezone to the startDate to make it 00:00 AM of local time to that particular location
    let assetService = ServiceLocator.resolve("AssetsService");
    let timezone = await assetService.getTimezone(locationId);
    if (timezone) {
      if (moment.tz.zone(timezone)) {
        // verify if the timezone id is valid, todo: validate date too.
        let dayBasedLocalDate = moment.tz(new Date(date).toISOString().slice(0, 10), timezone).toDate();
        return dayBasedLocalDate;
      } else {
        console.log("could not found timezone id", timezone);
      }
    } else {
      // todo: log warning here
      console.log("WorkOrder.service.applyTimezone: Warning: Time zone information not available for", locationId, " using UTC");
    }

    return date;
  }
}
export default WorkOrderService;
