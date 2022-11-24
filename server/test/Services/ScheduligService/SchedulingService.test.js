//During the test the env variable is set to test
process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
//let ApplicationLookups = require("../../../api/ApplicationLookups/ApplicationLookups.model");
//import WPlanTemplatesModelMock from "../../../mocks/api/wPlanTemplate/wPlanTemplateMock.model";
// let WPlanTemplatesModelMockInstance = new WPlanTemplatesModelMock();
// let ServiceLocator = require("../../../framework/servicelocator");
// import WPlanTemplateService from "../../../timps/api/wPlanTemplate/wPlanTemplate.service";
// let getSubdivisionService = require("../../../api/ApplicationLookups/ApplicationLookups.service").getSubdivisionService;
// import { data_01, data_01_Result, data_02, data_02_Result, data_03, data_03_Result } from "./dataFile";
// import "babel-polyfill";
import SchedulerService from "../../../service/SchedulerService";
import _ from "lodash";
import TimezoneMethodService from "../../../service/timeZoneMethodService";

//Require the dev-dependencies
let chai = require("chai");
// let chaiHttp = require("chai-http");
// //let app = require("../../../app");
let should = chai.should();
const assert = require("chai").assert;
import moment from "moment";
//Utils
//import { permChecker } from "../../../utilities/permCheck";

describe("-Scheduling Service-", () => {
  it("Case 1 Schedule two inspection per week (2 min days) No execution ", async () => {
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let template = {
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      inspectionFrequencies: [
        {
          freq: 2,
          timeFrame: "Week",
          timeFrameNumber: "1",
          recurNumber: 1,
          recurTimeFrame: "Week",
          maxInterval: 0,
          minDays: 2,
          id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        },
      ],
    };
    let locationTimezone = "Canada/Eastern";
    let executions = [];
    let expectedResult = [{ date: "2021-03-17 04:00:00.000Z", dueDate: "2021-03-15 04:00:00.000Z", status: "Future Inspection" }];
    let dateRange = { today: moment("2021-03-17 16:00:00.000Z") };
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.deepEqual(new Date(results[0].dueDate), new Date(expectedResult[0].dueDate), "result 0 dueDate should be same");
  });
  it("Case 2 Schedule two inspection per week (4 min days) Missed Execution ", async () => {
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let template = {
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      inspectionFrequencies: [
        {
          freq: 2,
          timeFrame: "Week",
          timeFrameNumber: "1",
          recurNumber: 1,
          recurTimeFrame: "Week",
          maxInterval: 0,
          minDays: 4,
          id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        },
      ],
    };
    let locationTimezone = "Canada/Eastern";
    let executions = [];
    let expectedResult = [
      { date: "2021-03-17 03:59:59.000Z", status: "Missed" },
      { date: "2021-03-17 04:00:00.000Z", status: "Future Inspection" },
    ];
    let dateRange = { today: moment("2021-03-17 16:00:00.000Z") };
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.equal(results[1].status, expectedResult[1].status, "result 1 status should be same");
    assert.deepEqual(new Date(results[1].date), new Date(expectedResult[1].date), "result 1 date should be same");
  });
  it("Case 3 Schedule two inspection per week (2 min days) One Execution ", async () => {
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let template = {
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      inspectionFrequencies: [
        {
          freq: 2,
          timeFrame: "Week",
          timeFrameNumber: "1",
          recurNumber: 1,
          recurTimeFrame: "Week",
          maxInterval: 0,
          minDays: 2,
          id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        },
      ],
    };
    let locationTimezone = "Canada/Eastern";
    let executions = [{ date: new Date("2021-03-16 16:00:00.000Z"), status: "Finished" }];
    let expectedResult = [
      { date: "2021-03-16 16:00:00.000Z", status: "Finished" },
      { date: "2021-03-19 04:00:00.000Z", status: "Future Inspection" },
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.equal(results[1].status, expectedResult[1].status, "result 1 status should be same");
    assert.deepEqual(new Date(results[1].date), new Date(expectedResult[1].date), "result 1 date should be same");
  });
  it("Case 4 Schedule two inspection per week (2 min days) Two Execution ", async () => {
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let template = {
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      inspectionFrequencies: [
        {
          freq: 2,
          timeFrame: "Week",
          timeFrameNumber: "1",
          recurNumber: 1,
          recurTimeFrame: "Week",
          maxInterval: 0,
          minDays: 2,
          id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        },
      ],
    };
    let locationTimezone = "Canada/Eastern";
    let executions = [
      { date: new Date("2021-03-16 16:00:00.000Z"), status: "Finished" },
      { date: new Date("2021-03-20 13:00:00.000Z"), status: "Finished" },
    ];
    let expectedResult = [
      { date: "2021-03-16 16:00:00.000Z", status: "Finished" },
      { date: "2021-03-20 13:00:00.000Z", status: "Finished" },
      { date: "2021-03-23 04:00:00.000Z", status: "Future Inspection" },
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.equal(results[1].status, expectedResult[1].status, "result 1 status should be same");
    assert.deepEqual(new Date(results[1].date), new Date(expectedResult[1].date), "result 1 date should be same");
    assert.equal(results[2].status, expectedResult[2].status, "result 2 status should be same");
    assert.deepEqual(new Date(results[2].date), new Date(expectedResult[2].date), "result 2 date should be same");
  });
  it("Case 5 Schedule two inspection per week (2 min days) Two Execution (next interval due date should not be less then current execution + min days)  ", async () => {
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let template = {
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      inspectionFrequencies: [
        {
          freq: 2,
          timeFrame: "Week",
          timeFrameNumber: "1",
          recurNumber: 1,
          recurTimeFrame: "Week",
          maxInterval: 0,
          minDays: 2,
          id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        },
      ],
    };
    let locationTimezone = "Canada/Eastern";
    let executions = [
      { date: new Date("2021-03-16 16:00:00.000Z"), status: "Finished" },
      { date: new Date("2021-03-20 13:00:00.000Z"), status: "Finished" },
    ];
    let expectedResult = [
      { date: "2021-03-16 16:00:00.000Z", status: "Finished" },
      { date: "2021-03-20 13:00:00.000Z", status: "Finished" },
      { date: "2021-03-23 04:00:00.000Z", status: "Future Inspection" },
    ];
    let dateRange = { today: moment("2021-03-21 14:00:00.000Z") };
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.equal(results[1].status, expectedResult[1].status, "result 1 status should be same");
    assert.deepEqual(new Date(results[1].date), new Date(expectedResult[1].date), "result 1 date should be same");
    assert.equal(results[2].status, expectedResult[2].status, "result 2 status should be same");
    assert.deepEqual(new Date(results[2].date), new Date(expectedResult[2].date), "result 2 date should be same");
  });
  it("Case 6 (next interval due date should be start of period) Schedule two inspection per week (1 min days) Two Execution ", async () => {
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let template = {
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      inspectionFrequencies: [
        {
          freq: 2,
          timeFrame: "Week",
          timeFrameNumber: "1",
          recurNumber: 1,
          recurTimeFrame: "Week",
          maxInterval: 0,
          minDays: 2,
          id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        },
      ],
    };
    let locationTimezone = "Canada/Eastern";
    let executions = [
      { date: new Date("2021-03-16 16:00:00.000Z"), status: "Finished" },
      { date: new Date("2021-03-18 13:00:00.000Z"), status: "Finished" },
    ];
    let expectedResult = [
      { date: "2021-03-16 16:00:00.000Z", status: "Finished" },
      { date: "2021-03-18 13:00:00.000Z", status: "Finished" },
      { date: "2021-03-22 04:00:00.000Z", status: "Future Inspection" },
    ];
    let dateRange = { today: moment("2021-03-19 14:00:00.000Z") };
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.equal(results[1].status, expectedResult[1].status, "result 1 status should be same");
    assert.deepEqual(new Date(results[1].date), new Date(expectedResult[1].date), "result 1 date should be same");
    assert.equal(results[2].status, expectedResult[2].status, "result 2 status should be same");
    assert.deepEqual(new Date(results[2].date), new Date(expectedResult[2].date), "result 2 date should be same");
  });
  it("Case 7 Schedule two inspection per week (1 min days) One Execution Inspection", async () => {
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let template = {
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      inspectionFrequencies: [
        {
          freq: 2,
          timeFrame: "Week",
          timeFrameNumber: "1",
          recurNumber: 1,
          recurTimeFrame: "Week",
          maxInterval: 0,
          minDays: 2,
          id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        },
      ],
    };
    let locationTimezone = "Canada/Eastern";
    let executions = [{ date: new Date("2021-03-16 16:00:00.000Z"), status: "Finished" }];
    let expectedResult = [
      { date: "2021-03-16 16:00:00.000Z", status: "Finished" },
      { date: "2021-03-22 03:59:59.000Z", status: "Missed" },
      { date: "2021-03-22 04:00:00.000Z", status: "Future Inspection" },
    ];
    let dateRange = { today: moment("2021-03-22 14:00:00.000Z") };
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.equal(results[1].status, expectedResult[1].status, "result 1 status should be same");
    assert.deepEqual(new Date(results[1].date), new Date(expectedResult[1].date), "result 1 date should be same");
    assert.equal(results[2].status, expectedResult[2].status, "result 2 status should be same");
    assert.deepEqual(new Date(results[2].date), new Date(expectedResult[2].date), "result 2 date should be same");
  });
  it("Case 8 Schedule two inspection per week (3 min days) One Execution Inspection", async () => {
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let template = {
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      inspectionFrequencies: [
        {
          freq: 2,
          timeFrame: "Week",
          timeFrameNumber: "1",
          recurNumber: 1,
          recurTimeFrame: "Week",
          maxInterval: 0,
          minDays: 3,
          id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        },
      ],
    };
    let locationTimezone = "Canada/Eastern";
    let executions = [{ date: new Date("2021-03-19 16:00:00.000Z"), status: "Finished" }];
    let expectedResult = [
      { date: "2021-03-18 03:59:59.000Z", status: "Missed" },
      { date: "2021-03-19 16:00:00.000Z", status: "Finished" },
      { date: "2021-03-23 04:00:00.000Z", status: "Future Inspection" },
    ];
    let dateRange = { today: moment("2021-03-19 14:00:00.000Z") };
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.equal(results[1].status, expectedResult[1].status, "result 1 status should be same");
    assert.deepEqual(new Date(results[1].date), new Date(expectedResult[1].date), "result 1 date should be same");
    assert.equal(results[2].status, expectedResult[2].status, "result 2 status should be same");
    assert.deepEqual(new Date(results[2].date), new Date(expectedResult[2].date), "result 2 date should be same");
  });
  it("Case 9 Schedule one inspection per week (9 max days) One Execution Inspection", async () => {
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
      {
        date: "2021-03-22 04:00:00.000Z",
        status: "Future Inspection",
        dueDate: "2021-03-22 04:00:00.000Z",
        expiryDate: "2021-03-27 03:59:59.000Z",
      },
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.equal(results[1].status, expectedResult[1].status, "result 1 status should be same");
    assert.deepEqual(new Date(results[1].date), new Date(expectedResult[1].date), "result 1 date should be same");
    assert.deepEqual(new Date(results[1].dueDate), new Date(expectedResult[1].dueDate), "result 2 expiry date should be same");
    assert.deepEqual(new Date(results[1].expiryDate), new Date(expectedResult[1].expiryDate), "result 2 expiry date should be same");
  });
  it("Case 10 Schedule one inspection per week (3 max days) One Execution Inspection ( if max interval is within current interval then inspection should be due and expire according to next interval)", async () => {
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
          maxInterval: 3,
          minDays: 0,
          id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        },
      ],
    };
    let locationTimezone = "Canada/Eastern";
    let executions = [{ date: new Date("2021-03-17 16:00:00.000Z"), status: "Finished" }];
    let expectedResult = [
      { date: "2021-03-17 16:00:00.000Z", status: "Finished" },
      { date: "2021-03-22 04:00:00.000Z", status: "Future Inspection", expiryDate: "2021-03-29 03:59:59.000Z" },
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.equal(results[1].status, expectedResult[1].status, "result 1 status should be same");
    assert.deepEqual(new Date(results[1].date), new Date(expectedResult[1].date), "result 1 date should be same");
    assert.deepEqual(new Date(results[1].expiryDate), new Date(expectedResult[1].expiryDate), "result 2 expiry date should be same");
  });
  it("Case 11 Schedule two inspection per week (4 max days) One Execution Inspection ", async () => {
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let template = {
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      inspectionFrequencies: [
        {
          freq: 2,
          timeFrame: "Week",
          timeFrameNumber: "1",
          recurNumber: 1,
          recurTimeFrame: "Week",
          maxInterval: 3,
          minDays: 0,
          id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        },
      ],
    };
    let locationTimezone = "Canada/Eastern";
    let executions = [{ date: new Date("2021-03-17 16:00:00.000Z"), status: "Finished" }];
    let expectedResult = [
      { date: "2021-03-17 16:00:00.000Z", status: "Finished" },
      {
        date: "2021-03-19 04:00:00.000Z",
        status: "Future Inspection",
        dueDate: "2021-03-18 04:00:00.000Z",
        expiryDate: "2021-03-21 03:59:59.000Z",
      },
    ];
    let dateRange = { today: moment("2021-03-19 14:00:00.000Z") };
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.equal(results[1].status, expectedResult[1].status, "result 1 status should be same");
    assert.deepEqual(new Date(results[1].date), new Date(expectedResult[1].date), "result 1 date should be same");
    assert.deepEqual(new Date(results[1].expiryDate), new Date(expectedResult[1].expiryDate), "result 2 expiry date should be same");
  });
});
