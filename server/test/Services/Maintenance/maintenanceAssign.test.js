process.env.NODE_ENV = "test";
let chai = require("chai");
const assert = require("chai").assert;
import _ from "lodash";
describe("Maintenance Work Assignment - ", () => {
  it("filter Maintenance requests based on work assigned and user group", () => {
    let opt2 = {
      InspectorWork: ["inspector"],
      Maintainer: ["maintenance"],
    };
    let mrs = [{ maintenanceRole: "InspectorWork" }, { maintenanceRole: "InspectorWork" }, { maintenanceRole: "Maintainer" }];
    let user = {
      group_id: "inspector",
    };
    let user2 = {
      group_id: "maintenance",
    };
    let result = filterMaintenanceRequestsByGroupId(mrs, user, opt2);
    let result1 = filterMaintenanceRequestsByGroupId(mrs, user2, opt2);
    assert.equal(result.length, 2, "it should be 2 for inspector work");
    assert.equal(result1.length, 1, "it should be 1 for maintainer work");
  });
});

export function filterMaintenanceRequestsByGroupId(mrs, user, mWorkLookup) {
  let mrsToRet = [];
  if (mrs && user && mWorkLookup) {
    for (let mr of mrs) {
      if (mr.maintenanceRole) {
        let exist = _.find(mWorkLookup[mr.maintenanceRole], gId => {
          return gId == user.group_id;
        });
        if (exist) {
          mrsToRet.push(filteredMrForApp(mr));
        }
      }
    }
  }
  return mrsToRet;
}

export function filteredMrForApp(mr) {
  let mrToRet = mr;
  return mrToRet;
}
