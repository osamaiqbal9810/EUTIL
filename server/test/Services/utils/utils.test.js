import { FixedGpsDataChange, FixedGPSDataOrig, simpleCordsOrig, simpleCordsChange } from "./utilsData";
process.env.NODE_ENV = "test";
let chai = require("chai");
const assert = require("chai").assert;
let utils = require("../../../utilities/utils");
describe("UtilsTest", () => {
  it("test mergeDeep for simple coords object", () => {
    let result = utils.mergeDeep(simpleCordsOrig, simpleCordsChange);
    assert.equal(result.coordinates[0], simpleCordsChange.coordinates[0]);
    assert.equal(result.coordinates[1], simpleCordsChange.coordinates[1]);
  });
  it("test mergeDeep for coorindates", () => {
    let newItem = utils.mergeDeep(FixedGPSDataOrig, FixedGpsDataChange);
    assert.equal(
      newItem.tasks[0].units[2].adjCoordinates.coordinates[0],
      FixedGpsDataChange.tasks[0].units[2].adjCoordinates.coordinates[0],
    );
    assert.equal(
      newItem.tasks[0].units[2].adjCoordinates.coordinates[1],
      FixedGpsDataChange.tasks[0].units[2].adjCoordinates.coordinates[1],
    );
  });
});
