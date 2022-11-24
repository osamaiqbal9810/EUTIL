//During the test the env variable is set to test
process.env.NODE_ENV = "test";
let mongoose = require("mongoose");
import WPlanTemplatesModelMock from "../../../mocks/api/wPlanTemplate/wPlanTemplateMock.model";
let WPlanTemplatesModelMockInstance = new WPlanTemplatesModelMock();
let ServiceLocator = require("../../../framework/servicelocator");
import WPlanTemplateService from "../../../timps/api/wPlanTemplate/wPlanTemplate.service";
import "babel-polyfill";
import {
  completionData,
  completionDataFail,
  completionDataFailStart,
  completionDataFailEnd,
  completionTemplateSessionQAData,
} from "./testData";

//Require the dev-dependencies
let chai = require("chai");
// let chaiHttp = require("chai-http");
let should = chai.should();
const assert = require("chai").assert;

//Utils
//import { permChecker } from "../../../utilities/permCheck";

describe("-WPlanTemplate-", () => {
  it("WPlanTemplate Completion Service", async () => {
    let wplanService = new WPlanTemplateService();
    let tolerance = 0.3;
    let result = wplanService.completionCalculation(
      completionData.completionObj,
      completionData.template.tasks[0].runStart,
      completionData.template.tasks[0].runEnd,
      tolerance,
    );
    let resultFail = wplanService.completionCalculation(
      completionDataFail.completionObj,
      completionDataFail.template.tasks[0].runStart,
      completionDataFail.template.tasks[0].runEnd,
      tolerance,
    );
    let resultFailStart = wplanService.completionCalculation(
      completionDataFailStart.completionObj,
      completionDataFailStart.template.tasks[0].runStart,
      completionDataFailStart.template.tasks[0].runEnd,
      tolerance,
    );
    let resultFailEnd = wplanService.completionCalculation(
      completionDataFailEnd.completionObj,
      completionDataFailEnd.template.tasks[0].runStart,
      completionDataFailEnd.template.tasks[0].runEnd,
      tolerance,
    );
    let resultQAData = wplanService.completionCalculation(
      completionTemplateSessionQAData.completionObj,
      completionTemplateSessionQAData.template.tasks[0].runStart,
      completionTemplateSessionQAData.template.tasks[0].runEnd,
      tolerance,
    );
    // console.log("About to assert");
    // console.log(result);
    // console.log(resultFail);
    // console.log(resultFailStart);
    // console.log(resultFailEnd);
    assert.equal(resultQAData, true, "QA data should give true for calculation");
    assert.equal(result, true, "It should be true for completion");
    assert.equal(resultFail, false, "It should be false for missing range");
    assert.equal(resultFailStart, false, "It should be false for start case");
    assert.equal(resultFailEnd, false, "It should be false for end case");
  });
});
