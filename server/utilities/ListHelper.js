let mongoose = require("mongoose");
let ServiceLocator = require("../framework/servicelocator");
let utils = require("../utilities/utils");
let moment = require("moment");

const isValidJsonString = (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
};
export default class ListHelper {
  constructor(logger) {
    this.logger = logger;
  }
  // let listModel = {
  //      tenantId = 0,
  //      listName = "",
  //      code = "",
  //      description = "",
  //      optParam1 = "",
  //      optParam2 = ""
  //  };

  async getList(listname, timestamp, settings, user, tz, callbacks) {
    timestamp = this.transformTimestamp(timestamp.toString());

    let filter = { updatedAt: { $gt: timestamp } };
    let fieldMap = {};
    let limit = 0;
    let sort = {};
    let projection = {}; // used to filter attributes
    let customFilter = {};

    if (settings && settings != "") {
      let settingsObj = await this.processCriteria(settings, user, tz);
      filter = Object.assign(filter, settingsObj.criteria);
      fieldMap = Object.assign(fieldMap, settingsObj.fieldMap);
      if (settingsObj.hasOwnProperty("limit")) {
        var parsedLimit = Number.parseInt(settingsObj.limit, 10);
        if (Number.isNaN(parsedLimit)) {
          this.logger.warn(listName + ": limit parameter was not parsed, ignoring the limit");
          console.log(listName + ": limit parameter was not parsed, ignoring the limit");
        } else {
          limit = parsedLimit;
        }
      }

      if (settingsObj.hasOwnProperty("sort")) {
        sort = Object.assign(sort, settingsObj.sort);
      }
      if (settingsObj.hasOwnProperty("project")) {
        projection = Object.assign(projection, settingsObj.project);
      }
      if (settingsObj.hasOwnProperty("customFilter")) {
        customFilter = Object.assign(customFilter, settingsObj.customFilter);
      }
    }

    let modelName = listname + "Model";

    let listModel = ServiceLocator.resolve(modelName);

    if (!listModel) {
      console.log("Could not find the model named:" + modelName);
      this.logger.error("Could not find the model named:" + modelName);
      callbacks.success([]);
      return;
    }
    //console.log('getList', modelName);

    let isSortEmpty = Object.keys(sort).length == 0;
    let isProjectionEmpty = Object.keys(projection).length == 0;

    var query = listModel.find(filter, isProjectionEmpty ? null : projection);

    if (limit > 0 && !isSortEmpty) {
      query = listModel
        .find(filter, isProjectionEmpty ? null : projection)
        .limit(limit)
        .sort(sort);
    } else if (limit <= 0 && !isSortEmpty) {
      query = listModel.find(filter, isProjectionEmpty ? null : projection).sort(sort);
    } else if (isSortEmpty && limit > 0) {
      query = listModel.find(filter, isProjectionEmpty ? null : projection).limit(limit);
    }

    query.exec(async (err, data) => {
      if (err) {
        this.logger.error("Error reading data: " + err.description);
        callbacks.fail("error:" + err.description);
      }

      if (data) {
        let itemsList = [];

        if (customFilter && customFilter.module && customFilter.func) {
          let module = ServiceLocator.resolve(customFilter.module);
          if (module && module[customFilter.func]) {
            data = await module[customFilter.func](data, user, tz, timestamp);
          }
        }

        data.forEach((element) => {
          let codeValue = "";
          let descriptionValue = "";
          let optParam2Value = "";

          codeValue = this.getValueNested(element._doc, fieldMap.code);
          descriptionValue = this.getValueNested(element._doc, fieldMap.description);
          optParam2Value = this.getValueNested(element._doc, fieldMap.optParam2);

          let item = {
            tenantId: user.tenantId,
            listName: listname,
            code: codeValue, // element._id.toString(),
            description: descriptionValue, // timestamp,
            optParam1: JSON.stringify(element._doc),
            optParam2: optParam2Value,
          };

          itemsList.push(item);
        });

        callbacks.success(itemsList);
      }
    });
  }
  getValueNested(obj, field) {
    if (obj)
      if (field) {
        if (field.includes(".") && field.split(".").length == 2) {
          let memberName = field.split(".")[0];
          field = field.split(".")[1];
          if (!obj.hasOwnProperty(memberName)) {
            return "";
          }
          obj = obj[memberName];
        }

        if (obj && obj.hasOwnProperty(field)) {
          return obj[field];
        }
      }
    return "";
  }

  async getDirectList(listname, timestamp, settings, user, tz, callbacks) {
    timestamp = this.transformTimestamp(timestamp.toString());

    let filter = { updatedAt: { $gt: timestamp } };
    let fieldMap = {};
    let limit = 0;
    let sort = {};
    let customFilter = {};

    if (settings != "") {
      let settingsObj = await this.processCriteria(settings, user, tz);
      filter = Object.assign(filter, settingsObj.criteria);
      fieldMap = Object.assign(fieldMap, settingsObj.fieldMap);

      if (settingsObj.hasOwnProperty("limit")) {
        var parsedLimit = Number.parseInt(settingsObj.limit, 10);
        if (Number.isNaN(parsedLimit)) {
          console.log(listName + ": limit parameter was not parsed, ignoring the limit");
          this.logger.warn(listName + ": limit parameter was not parsed, ignoring the limit");
        } else {
          limit = parsedLimit;
        }
      }

      if (settingsObj.hasOwnProperty("sort")) {
        sort = Object.assign(sort, settingsObj.sort);
      }

      if (settingsObj.hasOwnProperty("customFilter")) {
        customFilter = Object.assign(customFilter, settingsObj.customFilter);
      }
    }

    let modelName = listname + "Model";

    let listModel = ServiceLocator.resolve(modelName);

    if (!listModel) {
      console.log("Could not find the model named:" + modelName);
      this.logger.error("Could not find the model named:" + modelName);
      callbacks.success([]);
      return;
    }
    //console.log('getDirectList', modelName);
    var query = listModel.find(filter);

    if (limit > 0 && sort != {}) {
      query = listModel.find(filter).limit(limit).sort(sort);
    } else if (limit <= 0 && sort != {}) {
      query = listModel.find(filter).sort(sort);
    } else if (sort == {} && limit > 0) {
      query = listModel.find(filter).limit(limit);
    }

    query.find(filter).exec(async (err, data) => {
      if (err) {
        this.logger.error("Error: " + err.description);
        callbacks.fail("error:" + err.description);
      }

      if (data) {
        if (customFilter && customFilter.module && customFilter.func) {
          let module = ServiceLocator.resolve(customFilter.module);
          if (module && module[customFilter.func]) {
            data = await module[customFilter.func](data, user, tz);
          }
        }
        let itemsList = [];
        data.forEach((element) => {
          itemsList.push(element._doc);
        });

        callbacks.success(itemsList);
      }
    });
  }
  convertErrorToStr(err) {
    let str = "[";
    str += err && err.name ? err.name : "";

    if (err && err.errors) {
      let errs = Object.keys(err.errors);
      for (let e of errs) {
        if (e) str += "{" + e + "}=>";
        if (err.errors[e]) str += err.errors[e];
      }
    }
    if (err && err.message) {
      str += "message: " + err.message;
    }
    if (err && err.stack) {
      str += "stack: " + err.stack;
    }

    str += "]";
    return str;
  }
  handleError(text, err, displayConsole = false) {
    let str = text;
    str += this.convertErrorToStr(err);
    this.logger.error(str);

    if (displayConsole) console.log(str);
  }
  async addOrUpdate(item, callbacks) {
    try {

    let modelName = item.listName + "Model";
    let listModel = ServiceLocator.resolve(modelName);
    if (!listModel) {
      this.logger.error("addOrUpdate: Model not found: " + modelName);
      callbacks.fail("error: no model found");
      return;
    }

    if (item.code == "" || item.code == null) {
      if (item.description === "" || item.description == null || !isValidJsonString(item.description)) {
        delete item.optParam1._id;
        listModel.create(item.optParam1, (err, result) => {
          if (err) {
            // this.logger.error("Error creating listname:" + item.listName);
            // console.log(err);
            this.handleError("Error creating item" + JSON.stringify(item.optParam1) + " listname:" + item.listName, err, true);
            callbacks.fail(err);
            return;
          }
          callbacks.success("success", result);
        });
        return;
      } else {
        let filterObj;
        try {
          filterObj = JSON.parse(item.description);
        } catch (e) {
          this.handleError("Error parsing description " + JSON.stringify(item) + " listname:" + item.listName, e, true);
          callbacks.fail(e);
          return;
        }
        listModel.findOne(filterObj, (err, itms) => {
          let itm = null;
          if (!itms) {
            itm = listModel.create(item.optParam1, (err, result) => {
              if (err) {
                //this.logger.error("Error creating listname:" + item.listName);
                this.handleError("Error creating item" + JSON.stringify(item.optParam1) + " listname:" + item.listName, err, true);
                //console.log(err);
                callbacks.fail(err);
                return;
              }
              callbacks.success("success", result);
            });

            return;
          } else {
            itm = itms;
          }

          if (err || !itm) {
            this.handleError("could not find item to update listName: " + item.listName + ", id:" + item.code, err, true);
            callbacks.fail(err);
            return "could not find the item to update";
          }
          itm = utils.mergeDeep(itm, item.optParam1);
          if (typeof item.optParam1 == "object") {
            for (const key in item.optParam1) {
              itm.markModified(key);
            }
          }

          itm.save((err, result) => {
            if (err) {
              this.handleError("could not save item to listName: " + item.listName + ", id:" + item.code, err, true);
              callbacks.fail(err);
              return;
            }
            callbacks.success("success", result);
          });

          return;
        });
      }
    } else {
      let itm = await listModel.findById(item.code).exec();
      if (!itm) {
        this.handleError("could not find item to update listName: " + item.listName + ", id:" + item.code, {}, true);
        callbacks.fail({});
        return "could not find the item to update";
      }

      itm = utils.mergeDeep(itm, item.optParam1);

      itm.updatedAt = Date.now();
      listModel.findByIdAndUpdate(item.code, itm, { new: true }, function (err, result) {
        if (err) {
          this.handleError("could not save item, listName: " + item.listName + ", id:" + item.code, err, true);
          callbacks.fail(err);
          return;
        }

        callbacks.success("success", itm, item.optParam1);
        return;
      });
    }
    }
    catch(err) {
      callbacks.fail(err);
      return;
    }
  }

  async processCriteria(criteria, user, tz) {
    let today = new Date();
    //let startedsod = new Date(0); //
    //let roadmasterid = user.roadmasterid;

    today.setTime(today.getTime() + tz * 60 * 1000);

    today.setUTCHours(0);
    today.setMinutes(0);
    today.setSeconds(0, 0);

    let currentDate = moment(today).format("YYYYMMDD");

    if (criteria === undefined || !criteria) {
      return null;
    }

    // Discontinued using SOD
    // // see if this criteria needs startedsod then get it
    // if (criteria.indexOf("<startedsod>") > -1) {
    //   let SODModel = ServiceLocator.resolve("SODModel");
    //   // get last SOD
    //   let sod = await SODModel.findOne({ employee: user.email }).sort({
    //     day: -1
    //   });
    //   if (sod && !sod.hasOwnProperty("end")) {
    //     // if this day is not ended then use this day
    //     startedsod = sod.day;
    //   }
    // }

    let str = criteria.replace("<username>", user.name);
    str = str.replace(/<useremail>/g, user.email);
    str = str.replace("<userid>", user._id);
    str = str.replace("<today>", today.toISOString());
    //str = str.replace("<startedsod>", startedsod.toISOString());
    str = str.replace("<teamLeadEmail>", user.teamLead);
    str = str.replace("<currentDate>", currentDate);
    let obj = JSON.parse(str);
    return obj;
  }

  transformTimestamp(timestamp) {
    if (timestamp == "") {
      timestamp = "1-1-2001";
    }
    if (timestamp.length < 17 || timestamp.length > 17) {
      //timestamp.includes("-") || timestamp.includes(":"))
      return timestamp;
    }
    let newTimestamp = "";
    newTimestamp =
      timestamp.substr(0, 4) +
      "-" + // yyyy
      timestamp.substr(4, 2) +
      "-" + // MM
      timestamp.substr(6, 2) +
      " " + // dd
      timestamp.substr(8, 2) +
      ":" + // HH
      timestamp.substr(10, 2) +
      ":" + // mm
      timestamp.substr(12, 2) +
      ":" + // ss
      timestamp.substr(14, 3); //milliseconds

    return newTimestamp;
  }
  reverseTransformTimestamp(timestamp) {
    if (timestamp instanceof Date) {
      let newTimestamp = "";
      newTimestamp =
        timestamp.getFullYear().toString() +
        utils.assure2Digits((timestamp.getMonth() + 1).toString()) +
        utils.assure2Digits(timestamp.getDate().toString()) +
        utils.assure2Digits(timestamp.getHours().toString()) +
        utils.assure2Digits(timestamp.getMinutes().toString()) +
        utils.assure2Digits(timestamp.getSeconds().toString()) +
        utils.assure3Digits(timestamp.getMilliseconds().toString());

      return newTimestamp;
    }

    return "";
  }
}
