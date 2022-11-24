import moment from "moment-timezone";
class TimezoneMethodService {
  endOfDayMethod(date, tz) {
    if (tz && date) {
      // //return moment(date).tz(tz).endOf("day");
      // let endOfDayAtLocation = moment.tz(date.toISOString().slice(0, 10) + "T23:59:59", tz).toDate();
      const endOfDayTime = "23:59:59";
      let stringDate = moment.tz(date, tz);
      stringDate = stringDate.format().split("T")[0];
      let endOfday = moment.tz(stringDate + " " + endOfDayTime, tz);
      return endOfday;
    } else return date;
  }
  startOfDayMethod(date, tz) {
    if (tz && date) {
      // let isoDate = date.toISOString();
      // let sliceDate = isoDate.slice(0, 10);
      // let startOfDayAtLocation = moment.tz(sliceDate + "T00:00:00", tz).toDate();
      // return startOfDayAtLocation;
      const startOfDayTime = "00:00:00";
      let stringDate = moment.tz(date, tz);
      stringDate = stringDate.format().split("T")[0];
      let startOfday = moment.tz(stringDate + " " + startOfDayTime, tz);
      return startOfday;
    } else return date;
  }
  setTimeZone(date, tz) {
    if (tz && date) {
      console.log(moment(date).tz(tz).format("Z"));
      return moment(date).tz(tz).format("Z");
    } else return date;
  }
  setToDateLocaToTImeZoneMethod(date, tz, method) {
    if (date && tz && method) {
      let returnDate = date;
      if (method == "startOf") {
        returnDate = moment.tz(date.format("YYYY-MM-DD"), tz).startOf("day").toDate();
        return returnDate;
      } else if (method == "endOf") {
        returnDate = moment.tz(date.format("YYYY-MM-DD"), tz).endOf("day").toDate();
        return returnDate;
      }
    } else return date;
  }
}

export default TimezoneMethodService;
