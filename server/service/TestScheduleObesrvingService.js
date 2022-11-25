import assetTestModel from "../api/AssetTests/assetTests.model";
import { getNextTimePeriod, getLastPeriodStart } from "./SchedulerService";
import testSchedulesModel from "../timps/api/testSchedules/testSchedules.model";
import moment from "moment";
import { checkToIgnoreTestSchedule } from "../api/AssetTests/assetTests.service";
let ServiceLocator = require("../framework/servicelocator");
let mongoose = require("mongoose");

export class TestScheduleObserverService {
  constructor() {
    this.executionQueue = [];
    this.timeOutsActions = {};
  }
  checkIfExecutionNeeded() {
    return this.executionQueue.length == 0;
  }
  async initialize() {
    try {
      let assetTests = await assetTestModel.find({ isRemoved: false }).exec();
      if (assetTests && assetTests.length > 0) {
        for (let assetTest of assetTests) {
          this.createTimeInstancePeriod(assetTest);
        }
      }
    } catch (err) {
      console.log("err : ", err);
    }
  }
  createTimeInstancePeriod(assetTest) {
    if (assetTest) {
      let newDate = new Date();
      let startOfNextDay = this.getStartOfNextDay(newDate, assetTest);
      let timeToCall = this.timeToCalCalculate(newDate, startOfNextDay);
      setTimeout(() => {
        this.addToQueue(assetTest.id);
      }, timeToCall);
    }
  }
  timeToCalCalculate(date, startOfNextDay) {
    return moment.duration(moment(startOfNextDay).diff(date)).asMilliseconds();
  }
  addToQueue(assetTestId) {
    // console.log("Adding to Queue: ", assetTestId);
    let check = this.checkIfExecutionNeeded();
    this.executionQueue.push(assetTestId);
    // check && await this.executeTestSchedule(this.executionQueue[0]);
    check && this.nextExecution();
  }

  async nextExecution() {
    try {
      if (this.executionQueue.length > 0) {
        let assetTest = await this.fetchTest(this.executionQueue[0]);
        if (assetTest) {
          let dateRange = this.getDateRangeOfPrevCurrNextPeriod(assetTest);
          await this.executeTestSchedule(assetTest, dateRange);
          await this.createTimeInstancePeriod(assetTest);
        }
        this.executionQueue.shift();
        await this.nextExecution();
      }
    } catch (err) {
      console.log("err in nextExecution : ", err);
    }
  }
  async executeTestSchedule(assetTest, dateRange) {
    try {
      // console.log("Called on ", assetTest.id);
      let WorkPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
      let AssetTestsService = ServiceLocator.resolve("AssetTestsService");
      let utils = ServiceLocator.resolve("utils");
      if (assetTest) {
        let lastPeriodStart = getLastPeriodStart(assetTest.currentPeriodStart, assetTest.inspectionFrequencies);
        let execs = await this.fetchExecs(lastPeriodStart, assetTest.currentPeriodEnd, assetTest);
        !dateRange && (dateRange = this.getDateRangeOfPrevCurrNextPeriod(assetTest));
        let testScheds = await this.periodsScheduling(assetTest, execs, dateRange);
        if (testScheds && testScheds.length > 0) {
          await this.updateRequiredTest(testScheds, assetTest);
        }
        let nextDatesChanged = WorkPlanTemplateService.checkWorkPlanNextDueExpiryDate(assetTest, utils, 1);
        WorkPlanTemplateService.checkCurrentTimePeriodUpdate(assetTest, utils);
        let savedAssetTest = await assetTest.save();
        if (nextDatesChanged) {
          let testObject = AssetTestsService.assetTestObj(savedAssetTest);
          let testObjWithAssetIdForTemplate = {};
          testObjWithAssetIdForTemplate[testObject.assetId] = testObject;
          await AssetTestsService.updateTestOnTemplateUnits(
            { aType: testObject.assetType, assetId: testObject.assetId },
            testObject.testCode,
            "addUpdate",
            testObjWithAssetIdForTemplate,
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  getDateRangeOfPrevCurrNextPeriod(assetTest) {
    let dateRange = {
      from: moment(assetTest.currentPeriodStart),
      to: moment(getNextTimePeriod(assetTest.currentPeriodEnd, assetTest.inspectionFrequencies)),
      today: moment(),
    };
    return dateRange;
  }

  async periodsScheduling(assetTest, execs, dateRange) {
    let scheduleService = ServiceLocator.resolve("scheduleService");
    let timezoneMethodService = ServiceLocator.resolve("timezoneMethodService");

    let testScheds = await scheduleService.getTestSchedule(
      assetTest,
      assetTest.startDate,
      execs,
      dateRange,
      null,
      assetTest.timezone,
      timezoneMethodService,
      checkToIgnoreTestSchedule, // ignore method
    );
    return testScheds;
  }
  async updateRequiredTest(testScheds, assetTest) {
    let TestSchedulesModel = ServiceLocator.resolve("TestSchedulesModel");
    for (let test of testScheds) {
      if (test.status == "Missed") {
        // if exist then avoid otherwise add
        test.testCode = assetTest.testCode;
        test.assetId = assetTest.assetId;
        let missed = await testSchedulesModel.findOne({
          assetId: assetTest.assetId,
          testCode: assetTest.testCode,
          date: { $gte: new Date(test.date) },
        });
        if (!missed) {
          let newTest = new TestSchedulesModel(test);
          await newTest.save();
        }
      } else if (test.status == "Future") {
        let upcoming = await testSchedulesModel
          .findOne({ $and: [{ assetId: assetTest.assetId }, { testCode: assetTest.testCode }, { status: "Future" }] })
          .exec();
        if (upcoming) {
          upcoming.title = test.title;
          upcoming.date = test.date;
          upcoming.dueDate = test.dueDate;
          upcoming.expiryDate = test.expiryDate;
          await upcoming.save();
        } else {
          test.testCode = assetTest.testCode;
          test.assetId = assetTest.assetId;
          let newTest = new TestSchedulesModel(test);
          await newTest.save();
        }
      }
    }
  }
  async fetchExecs(start, end, assetTest) {
    let testScheds = await testSchedulesModel
      .find({ date: { $gt: start, $lt: end }, status: null, testCode: assetTest.testCode, assetId: assetTest.assetId })
      .exec();
    return testScheds;
  }

  async fetchTest(id, assetId, testCode) {
    try {
      let criteria = {};
      if (id) {
        criteria = { _id: mongoose.Types.ObjectId(id), isRemoved: false };
      } else {
        criteria = { assetId: assetId, testCode: testCode, isRemoved: false };
      }

      let assetTest = await assetTestModel.findOne(criteria).exec();
      return assetTest;
    } catch (err) {
      console.log(err);
    }
  }
  getStartOfNextDay(date, test) {
    let sDate = moment.tz(date.toISOString().slice(0, 10), test.timezone).add(1, "day");
    return sDate;
  }
}

/* 
Flow : 
- create queue that wil execute its contents
- initialize :
  1- get all test objects
  2- get start of today and add 1 day
  3- set interval for that time ( ms between now and then)
  4- upon execution add the test object id in queue and execute if length is 1 after adding it
  5- execute method of test scheduling
  6- schedule prev, current and next time period
  7- update test plan
  8- create any missed execution
  9- update/create future execution
  10- set the simulated flag on execution of missed and upcoming status.
  - 
*/
