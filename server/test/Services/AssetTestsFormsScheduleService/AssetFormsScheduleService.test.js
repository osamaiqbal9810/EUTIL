//During the test the env variable is set to test
process.env.NODE_ENV = "test";
let mongoose = require("mongoose");
import SchedulerService, { getEndTimePeriod } from "../../../service/SchedulerService";
import _ from "lodash";
import TimezoneMethodService from "../../../service/timeZoneMethodService";
//Require the dev-dependencies
let chai = require("chai");
let should = chai.should();
const assert = require("chai").assert;
import moment from "moment";
import { adjustDateToStartOfLocation, checkToIgnoreTestSchedule } from "../../../api/AssetTests/assetTests.service";

describe("Test Form Scheduling - ", () => {
  it("Case 1 future form schedule ", async () => {
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let testForm = {
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      inspectionFrequencies: {
        freq: 2,
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
    let expectedResult = [{ status: "Future", date: "2021-03-17 04:00:00.000Z", dueDate: "2021-03-15 04:00:00.000Z" }];
    let expectedTestFormObject = {
      ...testForm,
      updatedNextDates: {
        nextDueDate: new Date("2021-03-15 04:00:00.000Z"),
        nextExpiryDate: new Date("2021-03-19 03:59:59.000Z"),
        currentPeriodStart: new Date("2021-03-15 04:00:00.000Z"),
        currentPeriodEnd: new Date("2021-03-22 03:59:59.000Z"),
      },
    };
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

    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.deepEqual(new Date(results[0].dueDate), new Date(expectedResult[0].dueDate), "result 0 dueDate should be same");
    assert.deepEqual(
      new Date(testForm.updatedNextDates.nextDueDate),
      expectedTestFormObject.updatedNextDates.nextDueDate,
      "updatedNextDates.nextDueDate Should be same",
    );
    assert.deepEqual(
      new Date(testForm.updatedNextDates.nextExpiryDate),
      expectedTestFormObject.updatedNextDates.nextExpiryDate,
      "updatedNextDates.nextExpiryDate Should be same",
    );
    assert.deepEqual(
      new Date(testForm.updatedNextDates.currentPeriodStart),
      expectedTestFormObject.updatedNextDates.currentPeriodStart,
      "updatedNextDates.currentPeriodStart Should be same",
    );
    assert.deepEqual(
      new Date(testForm.updatedNextDates.currentPeriodEnd),
      expectedTestFormObject.updatedNextDates.currentPeriodEnd,
      "updatedNextDates.currentPeriodEnd Should be same",
    );
  });
  it("test for location start date time ", () => {
    let startDate = "2021-03-15 09:00:00.000Z";

    let expectedDate = new Date("2021-03-15 04:00:00.000Z");
    let locationAsset = {
      attributes: {
        timezone: "Canada/Eastern",
      },
    };
    let result = adjustDateToStartOfLocation(locationAsset, startDate);
    assert.deepEqual(result, expectedDate, "start date should be same as expected for adjusted timezone");
  });

  it("test for getting end period date of single interval/period date range", () => {
    let testForm = {
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      inspectionFrequencies: {
        freq: 2,
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
    let timezoneMethodService = new TimezoneMethodService();
    let expectedDate = new Date("2021-03-22 03:59:59.000Z");
    let result = getEndTimePeriod(testForm.startDate, testForm.inspectionFrequencies, locationTimezone, timezoneMethodService);
    assert.deepEqual(result.toDate(), expectedDate, "end date should be as expected");
  });
  it("test for single interval session scheduling date range", () => {
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
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let locationTimezone = "Canada/Eastern";
    let dateRange = {
      from: moment(testForm.startDate),
      to: moment("2021-03-22 04:00:00.000Z"),
      today: moment("2021-03-17 04:00:00.000Z"),
    };
    let expectedResult = [{ status: "Future", date: "2021-03-17 04:00:00.000Z", dueDate: "2021-03-15 04:00:00.000Z" }];
    let expectedTestFormObject = {
      ...testForm,
      updatedNextDates: {
        nextDueDate: new Date("2021-03-15 04:00:00.000Z"),
        nextExpiryDate: new Date("2021-03-22 03:59:59.000Z"),
        currentPeriodStart: new Date("2021-03-15 04:00:00.000Z"),
        currentPeriodEnd: new Date("2021-03-22 03:59:59.000Z"),
      },
    };

    let results = schService.getTestSchedule(
      testForm,
      testForm.startDate,
      [],
      dateRange,
      null,
      locationTimezone,
      timezoneMethodService,
      null,
    );
    assert.equal(results[0].status, expectedResult[0].status, "result 0 status should be same");
    assert.deepEqual(new Date(results[0].date), new Date(expectedResult[0].date), "result 0 date should be same");
    assert.deepEqual(new Date(results[0].dueDate), new Date(expectedResult[0].dueDate), "result 0 dueDate should be same");
    assert.deepEqual(
      new Date(testForm.updatedNextDates.nextDueDate),
      expectedTestFormObject.updatedNextDates.nextDueDate,
      "updatedNextDates.nextDueDate Should be same",
    );
    assert.deepEqual(
      new Date(testForm.updatedNextDates.nextExpiryDate),
      expectedTestFormObject.updatedNextDates.nextExpiryDate,
      "updatedNextDates.nextExpiryDate Should be same",
    );
    assert.deepEqual(
      new Date(testForm.updatedNextDates.currentPeriodStart),
      expectedTestFormObject.updatedNextDates.currentPeriodStart,
      "updatedNextDates.currentPeriodStart Should be same",
    );
    assert.deepEqual(
      new Date(testForm.updatedNextDates.currentPeriodEnd),
      expectedTestFormObject.updatedNextDates.currentPeriodEnd,
      "updatedNextDates.currentPeriodEnd Should be same",
    );
  });
  it("test for multiple interval session scheduling date range with 1 min days", () => {
    let testForm = {
      testCode: "test 01",
      title: "Test name",
      startDate: new Date("2021-04-11 04:00:00.000Z"),
      inspectionFrequencies: {
        freq: 2,
        timeFrame: "Week",
        timeFrameNumber: "1",
        recurNumber: 1,
        recurTimeFrame: "Week",
        maxInterval: 0,
        minDays: 1,
        id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
      },
    };
    let schService = new SchedulerService();
    let timezoneMethodService = new TimezoneMethodService();
    let locationTimezone = "Canada/Eastern";
    let dateRange = {
      from: moment(testForm.startDate),
      to: moment("2021-04-17 04:00:00.000Z"),
      today: moment("2021-04-14 04:00:00.000Z"),
    };
    let expectedResult = [
      { status: null, date: "2021-04-14T13:08:38.000Z" },
      { status: "Future", date: "2021-04-16 04:00:00.000Z", dueDate: "2021-04-16 04:00:00.000Z", expiryDate: "2021-04-18 03:59:59.000Z" },
    ];
    let expectedTestFormObject = {
      ...testForm,
      updatedNextDates: {
        nextDueDate: new Date("2021-04-16 04:00:00.000Z"),
        nextExpiryDate: new Date("2021-04-18 03:59:59.000Z"),
        currentPeriodStart: new Date("2021-04-11 04:00:00.000Z"),
        currentPeriodEnd: new Date("2021-04-18 03:59:59.000Z"),
      },
    };

    let results = schService.getTestSchedule(
      testForm,
      testForm.startDate,
      [{ status: null, date: "2021-04-14T13:08:38.000Z" }],
      dateRange,
      null,
      locationTimezone,
      timezoneMethodService,
      null,
    );

    assert.equal(results[1].status, expectedResult[1].status, "result 1 status should be same");
    assert.deepEqual(new Date(results[1].date), new Date(expectedResult[1].date), "result 1 date should be same");
    assert.deepEqual(new Date(results[1].dueDate), new Date(expectedResult[1].dueDate), "result 1 dueDate should be same");
    assert.deepEqual(new Date(results[1].expiryDate), new Date(expectedResult[1].expiryDate), "result 1 expiryDate should be same");
    assert.deepEqual(
      new Date(testForm.updatedNextDates.nextDueDate),
      expectedTestFormObject.updatedNextDates.nextDueDate,
      "updatedNextDates.nextDueDate Should be same",
    );
    assert.deepEqual(
      new Date(testForm.updatedNextDates.nextExpiryDate),
      expectedTestFormObject.updatedNextDates.nextExpiryDate,
      "updatedNextDates.nextExpiryDate Should be same",
    );
    assert.deepEqual(
      new Date(testForm.updatedNextDates.currentPeriodStart),
      expectedTestFormObject.updatedNextDates.currentPeriodStart,
      "updatedNextDates.currentPeriodStart Should be same",
    );
    assert.deepEqual(
      new Date(testForm.updatedNextDates.currentPeriodEnd),
      expectedTestFormObject.updatedNextDates.currentPeriodEnd,
      "updatedNextDates.currentPeriodEnd Should be same",
    );
  });
  it("completion for test schedules", () => {
    let execs = [
      { completed: true, formData: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "yes", value: "true" }] },
      { completed: false, formData: [{ id: "aa" }, { id: "bb" }, { id: "cc" }, { id: "yes", value: "false" }] },
      { completed: false, formData: [{ id: "aaa" }, { id: "bbb" }, { id: "ccc" }] },
    ];

    let result0 = checkToIgnoreTestSchedule(execs[0]);
    let result1 = checkToIgnoreTestSchedule(execs[1]);
    let result2 = checkToIgnoreTestSchedule(execs[2]);
    assert.equal(result0, false);
    assert.equal(result1, true);
    assert.equal(result2, true);
  });
});
