import DatabaseSerivce, {
  checkWorkPlanTemplateIdAndInspectionIsFinished,
  checkIfInspectedAndLinear,
  validateIntervalsAndFilter,
  createOrUpdateIntervals,
} from "../../../service/DBService";
import { checkCompletedForFixedTestSchedule } from "../../../api/AssetTests/assetTests.service";
process.env.NODE_ENV = "test";

let chai = require("chai");
const assert = require("chai").assert;

describe("Asset Test Fixed And Linear Scheduling", () => {
  it("validate inspection Finished and task", () => {
    let jPlan = { status: "Finished", tasks: [{ units: [] }] };
    let wJplan = { status: "Finished" };
    let sJplan = { status: "In Progress", tasks: [{ units: [] }] };
    let result = checkWorkPlanTemplateIdAndInspectionIsFinished("id", jPlan);
    let wresult = checkWorkPlanTemplateIdAndInspectionIsFinished("id", wJplan);
    let sresult = checkWorkPlanTemplateIdAndInspectionIsFinished("id", sJplan);
    let mresult = checkWorkPlanTemplateIdAndInspectionIsFinished("-1", jPlan);
    assert.equal(result, true, "should be valid");
    assert.equal(wresult, false, "should be invalid for no tasks");
    assert.equal(sresult, false, "should be invalid for not finished");
    assert.equal(mresult, false, "should be invalid for maintenance template");
  });
  it("linear and Inspected check", async () => {
    let result = checkIfInspectedAndLinear(true, { form: [{ id: "inspected", value: true }] });
    let result1 = checkIfInspectedAndLinear(true, { form: [{ id: "Oui", value: true }] });
    let result2 = checkIfInspectedAndLinear(true, { form: [{ id: "inspected", value: "true" }] });
    let result3 = checkIfInspectedAndLinear(true, { form: [{ id: "inspected", value: "false" }] });
    let result4 = checkIfInspectedAndLinear(false, { form: [{ id: "inspected", value: "false" }] });
    assert.equal(result, true, "should be true");
    assert.equal(result1, false, "should be false");
    assert.equal(result2, true, "should be true");
    assert.equal(result3, false, "should be false");
    assert.equal(result4, false, "should be false");
  });
  it("interval validation and filter interavls", async () => {
    let intervals = [
      {
        start: "20",
        end: "30",
        traversed: "12345",
        observed: "54321",
        status: "closed",
      },
      {
        start: "0",
        end: "20",
        traversed: "54321",
        observed: "12345",
        status: "closed",
      },
      {
        start: "30",
        end: "50",
        traversed: "12345",
        observed: "54321",
        status: "closed",
      },
    ];
    let assetTest = {
      assetId: "12345",
      linearProps: {
        inspectionType: "traversed",
      },
    };
    let assetTestObv = {
      assetId: "54321",
      linearProps: {
        inspectionType: "observed",
      },
    };
    let assetTestTrav = {
      assetId: "54321",
      linearProps: {
        inspectionType: "traversed",
      },
    };

    let result = await validateIntervalsAndFilter(intervals, assetTest, { _id: "abc" });
    let resultObv = await validateIntervalsAndFilter(intervals, assetTestObv, { _id: "abc" });
    let resultTra = await validateIntervalsAndFilter(intervals, assetTestTrav, { _id: "abc" });
    assert.equal(result.length, 2, "should be 2 intervals");
    assert.equal(resultObv.length, 2, "should be 2 intervals");
    assert.equal(resultTra.length, 1, "should be 1 intervals");
  });
  it("create or update inspection interval object for template/test", async () => {
    let intervals = [
      {
        start: "20",
        end: "30",
        traversed: "12345",
        observed: "54321",
        status: "closed",
      },
      {
        start: "30",
        end: "50",
        traversed: "12345",
        observed: "54321",
        status: "closed",
      },
    ];
    let inspection = {
      _id: "ins_abc123",
      title: "inspect main",
      user: { email: "abc@abc.com", name: "abc" },
    };
    let inspectObj = {
      inspectionId: "ins_abc123",
      inspectionName: "inspect main",
      user: { email: "abc@abc.com", name: "abc" },
      intervals: intervals,
    };

    let assetTest = {
      completion: { ranges: [] },
    };
    let result = createOrUpdateIntervals(inspectObj, inspection, intervals, assetTest);
    let resultNew = createOrUpdateIntervals(null, inspection, intervals, assetTest);
    assert.deepEqual(result, inspectObj);
    assert.deepEqual(resultNew, inspectObj);
  });
  it("test for completion for fixedAsset", async () => {
    let form = { form: [{ id: "yes", value: "true" }] };
    let form1 = { form: [{ id: "yes", value: true }] };
    let form2 = { form: [{ id: "yes", value: false }] };
    let form3 = { form: [{ id: "yes" }] };
    let form4 = { form: [{ id: "inspected", value: true }] };
    let result = checkCompletedForFixedTestSchedule(form);
    let result1 = checkCompletedForFixedTestSchedule(form1);
    let result2 = checkCompletedForFixedTestSchedule(form2);
    let result3 = checkCompletedForFixedTestSchedule(form3);
    let result4 = checkCompletedForFixedTestSchedule(form4);

    assert.equal(result, true);
    assert.equal(result1, true);
    assert.equal(result2, false);
    assert.equal(result3, false);
    assert.equal(result4, true);
  });
});
