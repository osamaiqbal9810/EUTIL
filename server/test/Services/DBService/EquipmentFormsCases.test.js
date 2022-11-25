import { equipmentFormMethod } from "../../../service/DBServiceHelper/EquipmentFormsMethods";
process.env.NODE_ENV = "test";
let chai = require("chai");
const assert = require("chai").assert;

describe("Equipment Forms Filling Test", () => {});
const line = { unitId: "Line Test", id: "abc" };
const parent = { unitId: "Parent Asset", id: "p_asset", equipments: [{}], appForms: [{ id: "parentTest", name: "Parent Test", form: [] }] };
const parent1 = { unitId: "Parent Asset 1", id: "p_asset1", appForms: [{ id: "parentTest1", name: "Parent Test 1", form: [] }] };
const child = {
  unitId: "Child Equipment Assset",
  id: "eq_asset",
  appFormsEquipment: [{ id: "equipForm", name: "Equipment Form", code: "equip1", parentTestCode: "parentTest", form: [] }],
};
const child1 = { unitId: "Child Equipment Assset 1", id: "eq_asset1" };

const units = [line, parent, parent1, child, child1];
const inspectionData = {
  id: "123",
  lineId: "abc",
  tasks: { units: units },
  date: new Date(),
};
