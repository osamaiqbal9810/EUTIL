import _ from "lodash";
import moment from "moment";
import { guid } from "../../../utilities/UUID.js";
let ServiceLocator = require("../../../framework/servicelocator");

class ATIVDataService {
  async getAll() {
    let resultObj = {};
    try {
      let ATIVDataModel = ServiceLocator.resolve("ATIVDataModel");
      let records = await ATIVDataModel.find({});
      resultObj = { status: 200, data: records };
    } catch (err) {
      resultObj = { status: 500 };
      console.log(`ATIVDataService.getAll.catch:${err}`);
    }

    return resultObj;
  }
  async getNotRemoved() {
    let resultObj = {};
    try {
      let ATIVDataModel = ServiceLocator.resolve("ATIVDataModel");
      let records = await ATIVDataModel.find({ isRemoved: false }).sort({ _id: -1 });
      resultObj = { status: 200, data: records };
    } catch (err) {
      resultObj = { status: 500 };
      console.log(`ATIVDataService.getNotRemoved.catch:${err}`);
    }

    return resultObj;
  }
  async getRemoved() {
    let resultObj = {};
    try {
      let ATIVDataModel = ServiceLocator.resolve("ATIVDataModel");
      let records = await ATIVDataModel.find({ isRemoved: true });
      resultObj = { status: 200, data: records };
    } catch (err) {
      resultObj = { status: 500 };
      console.log(`ATIVDataService.getRemoved.catch:${err}`);
    }

    return resultObj;
  }
  async deleteRecord(id) {
    let resultObj = {};
    try {
      let ATIVDataModel = ServiceLocator.resolve("ATIVDataModel");
      let result = await ATIVDataModel.updateOne({ _id: id }, { isRemoved: true });
      resultObj = { status: 200 };
    } catch (err) {
      resultObj = { status: 500 };
      console.log(`ATIVDataService.deleteRecord.catch:${err}`);
    }

    return resultObj;
  }
  async insertRecords(records) {
    let resultObj = {};
    try {
      let ATIVDataModel = ServiceLocator.resolve("ATIVDataModel");
      records.forEach((element) => {
        element.isRemoved = false;
        element.status = "New";
      });
      await ATIVDataModel.insertMany(records);

      resultObj = { status: 200 };
    } catch (err) {
      resultObj = { status: 500 };
      console.log(`ATIVDataService.insertRecords.catch:${err}`);
    }

    return resultObj;
  }
  async addRecordToWorkplan(updatedRecord) {
    let resultObj = {};
    try {
      let recordId = updatedRecord._id;
      let ATIVDataModel = ServiceLocator.resolve("ATIVDataModel");
      let wptService = ServiceLocator.resolve("WorkPlanTemplateService");

      let record = await ATIVDataModel.findOne({ _id: recordId });

      //  Update workplanId in the record
      record.workplanId = updatedRecord.workplanId;
      record.markModified("workplanId");
      await record.save();

      resultObj = wptService.assignAtivData(updatedRecord.workplanId, record);
    } catch (err) {
      resultObj = { status: 500 };
      console.log(`ATIVDataService.addRecordToWorkplan.catch:${err}`);
    }

    return resultObj;
  }
}

export default ATIVDataService;
