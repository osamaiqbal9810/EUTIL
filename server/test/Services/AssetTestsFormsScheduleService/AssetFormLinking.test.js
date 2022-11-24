import AssetTestsService from "../../../api/AssetTests/assetTests.service";
process.env.NODE_ENV = "test";

let chai = require("chai");
const assert = require("chai").assert;

describe("Link test Form with Assets", () => {
  it("validate and compare test form addition, removal, update", () => {
    let assetTestsService = new AssetTestsService();
    let prevForm = {
      tenantId: "ps19",
      listName: "appForms",
      code: "GI001",
      description: "GI-001",
      opt1: [],
      opt2: {
        config: [
          {
            id: "1",
            startDate: new Date("2021-03-12 04:00:00.000Z"),
            inspectionFreq: {
              freq: 2,
              timeFrame: "Week",
              timeFrameNumber: "1",
              recurNumber: 1,
              recurTimeFrame: "Week",
              maxInterval: 9,
              minDays: 0,
              id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
            },
          },
          { id: "2" },
        ],
        allowedInstruction: ["GI303.pdf"],
      },
    };
    let prevRemoveForm = {
      tenantId: "ps19",
      listName: "appForms",
      code: "GI001",
      description: "GI-001",
      opt1: [],
      opt2: {
        config: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }],
        allowedInstruction: ["GI303.pdf"],
      },
    };
    let testForm = {
      tenantId: "ps19",
      listName: "appForms",
      code: "GI001",
      description: "GI-001",
      opt1: [],
      opt2: {
        config: [
          {
            id: "1",
            startDate: new Date("2021-03-15 04:00:00.000Z"),
            inspectionFreq: {
              freq: 1,
              timeFrame: "Week",
              timeFrameNumber: "1",
              recurNumber: 1,
              recurTimeFrame: "Week",
              maxInterval: 9,
              minDays: 0,
              id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
              startDate: new Date("2021-03-15 04:00:00.000Z"),
            },
          },
          { id: "2" },
          { id: "3" },
        ],
        allowedInstruction: ["GI303.pdf"],
      },
    };

    let result = assetTestsService.validateTestFormForAssetLink(testForm, prevForm);
    let removeForm = assetTestsService.checkIfRemoved(testForm.opt2.config, prevRemoveForm.opt2.config);
    let updateForm = assetTestsService.checkIfUpdateRequire(testForm.opt2.config[0], prevForm.opt2.config[0]);
    let addForm = assetTestsService.checkIfNewTestLink(testForm.opt2.config, prevForm.opt2.config);
    assert.equal(true, result, "should be valid");
    assert.equal(true, addForm, "should be true for new form");
    assert.equal(true, updateForm, "should be true for update require");
    assert.equal(true, removeForm, "should be true for removal of Form");
  });
  it("test cases for update require of assetTest Form linking", () => {
    let assetTestsService = new AssetTestsService();
    let prevSameForm = {
      id: "1",
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      name: "Test",
      inspectionFreq: {
        freq: 1,
        timeFrame: "Week",
        timeFrameNumber: 1,
        recurNumber: 1,
        recurTimeFrame: "Week",
        maxInterval: 0,
        minDays: 0,
        id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        startDate: new Date("2021-03-15 04:00:00.000Z"),
      },
    };

    let prevChangeNameForm = {
      id: "1",
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      name: "Test Form",
      inspectionFreq: {
        freq: 1,
        timeFrame: "Week",
        timeFrameNumber: 1,
        recurNumber: 1,
        recurTimeFrame: "Week",
        maxInterval: 9,
        minDays: 0,
        id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        startDate: new Date("2021-03-15 04:00:00.000Z"),
      },
    };

    let prevChangeFreqForm = {
      id: "1",
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      name: "Test",
      inspectionFreq: {
        freq: 1,
        timeFrame: "Week",
        timeFrameNumber: 1,
        recurNumber: 1,
        recurTimeFrame: "Week",
        maxInterval: 0,
        minDays: 2,
        id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        startDate: new Date("2021-03-15 04:00:00.000Z"),
      },
    };

    let prevChangeStartDateForm = {
      id: "1",
      startDate: new Date("2021-03-23 04:00:00.000Z"),
      name: "Test",
      inspectionFreq: {
        freq: 1,
        timeFrame: "Week",
        timeFrameNumber: 1,
        recurNumber: 1,
        recurTimeFrame: "Week",
        maxInterval: 0,
        minDays: 0,
        id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        startDate: new Date("2021-03-15 04:00:00.000Z"),
      },
    };

    let testForm = {
      id: "1",
      startDate: new Date("2021-03-15 04:00:00.000Z"),
      name: "Test",
      inspectionFreq: {
        freq: 1,
        timeFrame: "Week",
        timeFrameNumber: 1,
        recurNumber: 1,
        recurTimeFrame: "Week",
        maxInterval: 0,
        minDays: 0,
        id: "02dee9d1-3c8b-bfed-6575-c6387048459b",
        startDate: new Date("2021-03-15 04:00:00.000Z"),
      },
    };

    let updateFormSame = assetTestsService.checkIfUpdateRequire(testForm, prevSameForm);
    let updateFormName = assetTestsService.checkIfUpdateRequire(testForm, prevChangeNameForm);
    let updateFormDate = assetTestsService.checkIfUpdateRequire(testForm, prevChangeStartDateForm);
    let updateFormFreq = assetTestsService.checkIfUpdateRequire(testForm, prevChangeFreqForm);
    assert.equal(false, updateFormSame, "should be false for update require");
    assert.equal(true, updateFormName, "should be true for name update require");
    assert.equal(true, updateFormDate, "should be true for date update require");
    assert.equal(true, updateFormFreq, "should be true for freq update require");
  });
});
