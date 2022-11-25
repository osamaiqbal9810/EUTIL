let _ = require("lodash");
let ServiceLocator = require("../framework/servicelocator");
var fs = require("fs");

import moment from "moment";
class utils {
  constructor() {}
  ensureFolderExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
  assure2Digits(str) {
    let newstr = str;
    if (str.length == 1) {
      newstr = "0" + newstr;
    }

    return newstr;
  }
  assure3Digits(str) {
    let newstr = str;
    if (str.length == 1) {
      newstr = "00" + newstr;
    } else if (str.length == 2) {
      newstr = "0" + newstr;
    }

    return newstr;
  }
  assureDigits(
    numberOfDigits,
    str, // append 0's at start of a numbered string
  ) {
    let newstr = str;
    if (str.length < numberOfDigits) {
      newstr = "0".repeat(numberOfDigits - str.length) + newstr;
    }

    return newstr;
  }

  mergeDeep(target, source) {
    if (typeof target == "object" && typeof source == "object" && !(source instanceof Array)) {
      if (source["__replace"] && source["__replace"] == true) {
        target = _.cloneDeep(source);
      } else {
        for (const key in source) {
          if (source[key] === null && (target[key] === undefined || target[key] === null)) {
            target[key] = null;
          } else if (source[key] instanceof Array) {
            let sKey = key;
            if (sKey.charAt(0) == "*") {
              sKey = key.slice(1);
              target[sKey] = _.cloneDeep(source[key]);
              // From source, remove the element with '*' prefix and add regular field without '*' with the same value
              source[sKey] = target[sKey];
              delete source[key];
            } else {
              if (!target[sKey]) target[sKey] = [];
              target[key] = this.mergeDeep(target[key], source[key]);
            }

            // //concatenate arrays
            // target[key] = target[key].concat(source[key]);
            //target[key] = this.mergeDeep(target[key], source[key]);
          } else if (typeof source[key] == "object") {
            if (!target[key]) target[key] = {};
            if (source[key]["__replace"] && source[key]["__replace"] == true)
              ////this.mergeDeep(target[key], source[key], true);
              target[key] = _.cloneDeep(source[key]);
            else target[key] = this.mergeDeep(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
    } else if (
      typeof source === "number" ||
      typeof source === "boolean" ||
      typeof source === "bigint" ||
      typeof source === "symbol" ||
      typeof source === "string"
    ) {
      target = source;
    } else if (source instanceof Array) {
      //if(target.length == source.length)
      let j = 0;
      for (var i = 0; i < source.length; i++) {
        if (!target[j]) {
          target[j] = source[i] instanceof Array ? [] : typeof source[i] == "object" ? {} : source[i];
        } else if (source[i] == null) {
          target.splice(j, 1);
          j--;
        }
        if (j >= 0) target[j] = this.mergeDeep(target[i], source[j]);
        j++;
      }
    } else {
      console.log("utils.mergeDeep.error: Encountered and unknown type.", typeof source);
    }
    return target;
  }
  substractObjects(source, dest) {
    let difference = {};

    if (typeof source == "object") {
      //&& typeof dest == "object")   //&& !(source instanceof Array
      for (const key in source) {
        if (typeof source[key] == "object") {
          // && !(source[key] instanceof Array))
          let diff = this.substractObjects(source[key], !dest || dest == undefined ? {} : dest[key]);
          if (diff != {}) {
            difference[key] = source[key] instanceof Array ? [] : {};
            difference[key] = Object.assign(source[key] instanceof Array ? [] : {}, diff);
          }
        } else if (!dest || dest[key] == undefined || source[key] != dest[key]) {
          difference[key] = source[key];
        }
      }
    }
    return difference;
  }
  areObjectsEqual(obj1, obj2) {
      try{
        let str1 = JSON.stringify(obj1);
        let str2 = JSON.stringify(obj2);
        return str1===str2;
      }catch(err){
        console.log('utils.compareObjects.catch:', err);
      }
      return false;
  }
  
  toFixed(
    value,
    decimalPlaces = 2, // default percision nnnnn.nn
  ) {
    let retValue = value;
    if (value && decimalPlaces) {
      if (typeof value !== "string" && typeof value !== "number") {
        // console.log('utils.toPrecision: bad argument type while parsing for fixed :', value);
        value = value.toString();
      }

      if (typeof value === "string") {
        retValue = parseFloat(value);
        if (isNaN(retValue)) {
          retValue = 0;
          // console.log('utils.toPrecision: bad number in while parsing for fixed :', value);
        }
      }

      retValue = +retValue.toFixed(decimalPlaces);
    }

    return parseFloat(retValue);
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
  handleMongoDbError(err) {
    let logger = ServiceLocator.resolve("logger");
    let str = "Mongodb Connection Error:";
    str += this.convertErrorToStr(err);
    logger.error(str);

    console.log(str);
  }
  compareTwoDates(d1, d2, method) {
    let result;
    switch (method) {
      case "ISOB":
        result = moment(moment(d1).format("YYYY-MM-DD")).isSameOrBefore(moment(moment(d2).format("YYYY-MM-DD")));
        break;
      case "IB":
        result = moment(moment(d1).format("YYYY-MM-DD")).isBefore(moment(moment(d2).format("YYYY-MM-DD")));
        break;
      case "ISOA":
        result = moment(moment(d1).format("YYYY-MM-DD")).isSameOrAfter(moment(moment(d2).format("YYYY-MM-DD")));
        break;
      case "IA":
        result = moment(moment(d1).format("YYYY-MM-DD")).isAfter(moment(moment(d2).format("YYYY-MM-DD")));
        break;
      default:
        break;
    }
    return result;
  }
  checkSameDates(d1, d2) {
    let result;
    result = moment(moment(d1).format("YYYY-MM-DD")).isSame(moment(moment(d2).format("YYYY-MM-DD")));
    return result;
  }
  getFilesList(path) {
    let fileslist = [];
    try {
      fileslist = fs.readdirSync(path);
    } catch (e) {
      console.log("utils.getFilesList.catch", e);
    }
    return fileslist;
  }
  loadJson(fullPath) {
    let retVal = {};
    try {
      let data = fs.readFileSync(fullPath);
      retVal = JSON.parse(data);
    } catch (e) {
      console.log("utils.loadJson.catch", e);
    }
    return retVal;
  }
}
var util = new utils();
ServiceLocator.register("utils", util);
module.exports = util;
