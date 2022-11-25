import ApplicationLookupsModel from "../../../api/ApplicationLookups/ApplicationLookups.model";

module.exports = {
  async up() {
    console.log("Add Not Repaired Remedial action repair by");
    let notRepaired = await ApplicationLookupsModel.findOne({ listName: "remedialAction", description: "Not Repaired" }).exec();
    if (notRepaired) {
      notRepaired.opt1 = actionItems;
      notRepaired.markModified("opt1");
      await notRepaired.save();
    } else {
      console.log("Failed : Not Repaired Remedial action is not found in database.");
    }
  },
};

const actionItems = [
  {
    id: "describe",
    fieldName: "Describe",
    fieldType: "text",
  },
  {
    id: "repairBy",
    fieldName: "Date Repair by",
    fieldType: "date",
  },
  // {
  //   id: "repDays",
  //   fieldName: "Days",
  //   fieldType: "list",
  //   required: false,
  //   options: numOptionMaker(31),
  // },
  // {
  //   id: "repWeek",
  //   fieldName: "Weeks",
  //   fieldType: "list",
  //   required: false,
  //   options: numOptionMaker(4),
  // },
  // {
  //   id: "repMnths",
  //   fieldName: "Months",
  //   fieldType: "list",
  //   required: false,
  //   options: numOptionMaker(12),
  // },
  // {
  //   id: "repYrs",
  //   fieldName: "Years",
  //   fieldType: "list",
  //   required: false,
  //   options: numOptionMaker(5),
  // },
];

function numOptionMaker(count) {
  let nums = [];
  for (let i = 0; i <= count; i++) {
    nums.push(i);
  }
  return nums;
}
