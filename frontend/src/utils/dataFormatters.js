import { getDate } from "./dateParser";
import moment from "moment";

// let dateTimeFormatWithoutSecs = {
//   year: "numeric",
//   month: "2-digit",
//   day: "2-digit",
//   hour: "2-digit",
//   minute: "2-digit",
// };
// let timezoneFormatArgsWithoutSeconds = [
//   /*locale will always be undefined in our case*/
//   undefined,
//   /*For local timezone, we don't need to provide any timezone. Otherwise, use the timezone as it is.*/
//   tz === "Local" ? dateTimeFormatWithoutSecs : { timeZone: tz, ...dateTimeFormatWithoutSecs },
// ];

export const dataFormatters = {
  dateFormatter: (date) => {
    let tempDate = getDate(date);
    if (tempDate === null) {
      return date;
    } else {
      let momentDate = moment(date);
      return momentDate.format("MM-DD-YYYY");
    }
  },
  timeFormatter: (date) => {
    let tempDate = getDate(date);
    if (tempDate === null) {
      return date;
    } else {
      let momentDate = moment(date);
      return momentDate.format("hh:mm:ss A");
    }
  },
  timeFormatterWithoutSecs: (date) => {
    let tempDate = getDate(date);
    if (tempDate === null) {
      return date;
    } else {
      let momentDate = moment(date);
      return momentDate.format("hh:mm A");
    }
  },
  dateTimeFormatter: (date) => {
    let tempDate = getDate(date);
    if (tempDate === null) {
      return date;
    } else {
      let momentDate = moment(date);
      return momentDate.format("MM-DD-YYYY,  hh:mm:ss A");
    }
  },
  dateTimeFormatterWithoutSecs: (date) => {
    let tempDate = getDate(date);
    if (tempDate === null) {
      return date;
    } else {
      let momentDate = moment(date);
      return momentDate.format("MM-DD-YYYY, hh:mm A");
    }
  },
  stringArrayFormatter: (val) => {
    return val !== undefined && Array.isArray(val) ? val.join(", ") : "";
  },
  stringFormatter: (val) => {
    return val !== undefined ? val.toString() : "";
  },
  formatTimeDuration: (durationInMs) => {
    const hours = Math.floor(moment.duration(durationInMs).asHours()) || "00";
    return hours + ":" + moment.utc(durationInMs).format("mm:ss");
  },
  formatPercentage: (percentage) => {
    return percentage ? parseFloat(percentage).toFixed(2) : "0";
  },
};
