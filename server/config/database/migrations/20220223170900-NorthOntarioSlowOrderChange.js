import _ from "lodash";
import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";

var ObjectId = require("mongodb").ObjectID;
module.exports = {
  async up() {
    console.log("Add TSO instead of Slow order in Ontario Northland");
    await ApplicationLookupsModel.deleteOne({ listName: "remedialAction", code: "01 slowOrderApplied" });
    let tso = {
      tenantId: "ps19",
      listName: "remedialAction",
      code: "01 tsoApplied",
      description: "Temporary Slow Order",
      opt1: [
        {
          id: "tsoApplied",
          fieldName: "TSO Limit",
          fieldType: "text",
        },
        {
          id: "rtcInitials",
          fieldName: "RTC Initials",
          fieldType: "text",
        },
      ],
    };
    let tsoRem = new ApplicationLookupsModel(tso);
    await tsoRem.save();
  },
  attributes: { customer: "Ontario Northland" },
};
