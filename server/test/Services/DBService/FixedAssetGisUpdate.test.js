import DatabaseSerivce, {
  assetExistenceInInspection,
  assetsWithAdjCords,
  updateAssetInTemplateWithAdjCords,
  clearGpsAdustmentCords,
} from "../../../service/DBService";
import {
  D1nullTasks,
  D2ContainsUnits,
  D3ContainsUnitsNoAdjCoordinates,
  D4UnitsWithAdjCoordinates,
  D5WorkplanTemplate,
  RD5WorkplanTemplate,
  D6UnsetAssetGPSAdj,
  D7WorkPlanTemplate,
} from "./FixedAssetGpsTestData";

process.env.NODE_ENV = "test";
let chai = require("chai");
const assert = require("chai").assert;

describe("Fixed Asset GPS update - ", () => {
  it("Assets exist in the inspection received", () => {
    let resultNotExist = assetExistenceInInspection(D1nullTasks);
    let reusltExist = assetExistenceInInspection(D2ContainsUnits);
    assert.equal(resultNotExist, false, "it should be false since D1 inspection does not contain asset");
    assert.equal(reusltExist, true, "it should be true since D2 inspection does contain asset");
  });
  it("Collect All Asset with Updated Coords", () => {
    let resultAssets = assetsWithAdjCords(D4UnitsWithAdjCoordinates);
    let resultAssets2 = assetsWithAdjCords(D3ContainsUnitsNoAdjCoordinates);
    let resultAssets3 = assetsWithAdjCords(D7WorkPlanTemplate);
    assert.lengthOf(resultAssets, 3, "Expected length to match");
    assert.lengthOf(resultAssets2, 0, "Expected length to be 0");
    assert.lengthOf(resultAssets3, 0, "Expected length to be 0");
  });
  it("Update Asset in Workplans", () => {
    let resultAssets = assetsWithAdjCords(D4UnitsWithAdjCoordinates);
    let updatedTemplate = D5WorkplanTemplate;
    for (let asset of resultAssets) {
      updatedTemplate = updateAssetInTemplateWithAdjCords(D5WorkplanTemplate, asset);
    }
    assert.deepEqual(updatedTemplate.tasks[0].units, RD5WorkplanTemplate.tasks[0].units);
  });
  it("Unset Adj cooridnates", () => {
    let resultValueA1 = clearGpsAdustmentCords(D6UnsetAssetGPSAdj[0]);
    let resultValueA2 = clearGpsAdustmentCords(D6UnsetAssetGPSAdj[1]);
    assert.equal(resultValueA1, true, "should return true because it need to be unset");
    assert.equal(resultValueA2, false, "does not need to be unset");
  });
});
