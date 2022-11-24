import TimezoneMethodService from "./service/timeZoneMethodService";
import SchedulerService from "./service/SchedulerService";
import moment from "moment";
export function testSchedule() {
  let schService = new SchedulerService();
  let timezoneMethodService = new TimezoneMethodService();
  let testForm = {
    startDate: new Date("2021-03-15 04:00:00.000Z"),
    inspectionFrequencies: {
      freq: 1,
      timeFrame: "Week",
      timeFrameNumber: "1",
      recurNumber: 1,
      recurTimeFrame: "Week",
      maxInterval: 0,
      minDays: 2,
      id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
    },
  };
  let locationTimezone = "Canada/Eastern";
  let executions = [];
  let expectedResult = [];
  let dateRange = { today: moment("2021-03-17 16:00:00.000Z") };
  dateRange.from = moment("2021-03-01 04:00:00.000Z");
  dateRange.to = moment("2021-04-01 03:59:59.000Z");

  let results = schService.getTestSchedule(
    testForm,
    testForm.startDate,
    executions,
    dateRange,
    null,
    locationTimezone,
    timezoneMethodService,
    null,
  );
  console.log(results);
}
export function testInspectionSchedule() {
  let schService = new SchedulerService();
  let timezoneMethodService = new TimezoneMethodService();
  let template = {
    startDate: new Date("2021-03-15 04:00:00.000Z"),
    inspectionFrequencies: [
      {
        freq: 1,
        timeFrame: "Week",
        timeFrameNumber: "1",
        recurNumber: 1,
        recurTimeFrame: "Week",
        maxInterval: 9,
        minDays: 0,
        id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
      },
    ],
  };
  let locationTimezone = "Canada/Eastern";
  let executions = [{ date: new Date("2021-03-17 16:00:00.000Z"), status: "Finished" }];
  let expectedResult = [
    { date: "2021-03-17 16:00:00.000Z", status: "Finished" },
    { date: "2021-03-22 04:00:00.000Z", status: "Future Inspection", expiryDate: "2021-03-27 03:59:59.000Z" },
  ];
  let dateRange = { today: moment("2021-03-17 14:00:00.000Z") };
  dateRange.from = moment("2021-03-01 04:00:00.000Z");
  dateRange.to = moment("2021-04-01 03:59:59.000Z");

  let results = schService.getSchedules(
    template,
    template.startDate,
    executions,
    dateRange,
    null,
    locationTimezone,
    timezoneMethodService,
    null,
  );

  console.log(results);
}
