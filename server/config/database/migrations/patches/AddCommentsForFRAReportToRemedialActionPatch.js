import ApplicationLookupsModel from "../../../../api/ApplicationLookups/ApplicationLookups.model";

module.exports = {
  async apply() {
    console.log("Add CommentsForFRA to remedial action config");
    let notRep = {
      opt1: [
        {
          id: "describe",
          fieldName: "Comments for FRA Report",
          fieldType: "text",
        },
        {
          id: "repairBy",
          fieldName: "Date Repair by",
          fieldType: "date",
        },
      ],
    };
    let slowOrder = {
      opt1: [
        {
          id: "slowOrderNumber",
          fieldName: "Slow Order Authority #",
          fieldType: "text",
        },
        {
          id: "slowOrderSpeedRestict",
          fieldName: "Speed restricted to:",
          fieldType: "list",
          required: true,
          options: ["Class #4", "Class #3", "Class #2", "Class #1", "Excepted Track"],
        },
        {
          id: "describe",
          fieldName: "Comments for FRA Report",
          fieldType: "text",
        },
      ],
    };
    let rep = {
      opt1: [
        {
          id: "fixDescribe",
          fieldName: "Comments for FRA Report",
          fieldType: "text",
        },
      ],
    };
    let trackOOS = {
      opt1: [
        {
          id: "describe",
          fieldName: "Comments for FRA Report",
          fieldType: "text",
        },
      ],
    };
    await updateRemedialAction("03 notrepaired", notRep);
    await updateRemedialAction("01 slowOrderApplied", slowOrder);
    await updateRemedialAction("00 repaired", rep);
    await updateRemedialAction("02 trackOOS", trackOOS);
  },
  attributes: { applicationType: "TIMPS", customer: "TXNW" },
};

async function updateRemedialAction(code, opt1) {
  await ApplicationLookupsModel.updateOne(
    { listName: "remedialAction", code: code },
    {
      $set: opt1,
    },
  );
}
