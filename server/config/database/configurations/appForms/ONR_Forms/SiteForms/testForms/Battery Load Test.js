export const batteryLoad = [
  {
    id: "Inspected",
    fieldName: "Scheduled Inspection",
    fieldType: "checkbox",
    tag: "completionCheck",
  },
  {
    id: "desc",
    fieldName:
      "Perform battery load tests and generate a battery record card.  Perform test and generate a battery record card for each bank.  Record Test Results",
    fieldType: "label",
  },
  {
    id: "test",
    fieldName: "Results of Test",
    fieldType: "radioList",
    options: ["OK", "A/C", "R/C", "N/A"],
  },
  {
    id: "com",
    fieldName: "Comments",
    fieldType: "text",
  },
  {
    id: "resultsoftests",
    fieldName: "Results of tests:",
    fieldType: "label",
  },

  {
    id: "ok",
    fieldName: "OK-- Test complete equipment in satisfactory condition.",
    fieldType: "label",
  },

  {
    id: "ac",
    fieldName: "A/C-- Adjustments made/test complete-equipment in satisfactory condition.",
    fieldType: "label",
  },

  {
    id: "rc",
    fieldName: "R/C-- Repair or replacement/test complete-equipment in satisfactory condition.",
    fieldType: "label",
  },
  {
    id: "lastresult",
    fieldName: "If results are 'A/C' or 'R/C' explain the procedure in the comments column.",
    fieldType: "label",
  },
  {
    id: "na",
    fieldName: "N/A--Test Not Applicable.",
    fieldType: "label",
  },
  {
    id: "tblBatt",
    fieldName: "Battery Card",
    fieldType: "table",
    options: [
      {
        id: "circ",
        fieldName: "Circuit",
        fieldType: "text",
        required: true,
      },
      {
        id: "mode",
        fieldName: "Model",
        fieldType: "text",
      },
      {
        id: "d_inst",
        fieldName: "Date installed",
        fieldType: "date",
        enabled: true,
      },
      {
        id: "ni",
        fieldName: "Battery Type",
        fieldType: "radioList",
        options: ["Ni-Cd ", "VRLA"],
      },
      {
        id: "div",
        fieldName: "",
        fieldType: "divider",
      },
      {
        id: "date",
        fieldName: "Date",
        fieldType: "text",
        default: "#VAR_NOW#",
        enabled: false,
      },
      {
        id: "test-by",
        fieldName: "Tested By",
        fieldType: "text",
        default: "#VAR_UNAME#",
        enabled: false,
      },
      {
        id: "type",
        fieldName: "Test Type",
        fieldType: "radioList",
        options: ["M", "Q", "A"],
      },
      {
        id: "charg",
        fieldName: "Charger AC voltage",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "c_curr",
        fieldName: "Battery Charge Current",
        fieldType: "text",
      },
      {
        id: "stdby",
        fieldName: "Equip. Load Current (Stdby)",
        fieldType: "text",
      },
      {
        id: "div1",
        fieldName: "",
        fieldType: "divider",
      },
      {
        id: "b_volt",
        fieldName: "Overall battery voltage",
        fieldType: "label",
      },
      {
        id: "c_on",
        fieldName: "Charger On",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "c_off",
        fieldName: "Charger Off",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "div2",
        fieldName: "",
        fieldType: "divider",
      },
      {
        id: "c_volt",
        fieldName: "Cell Discharge Voltage (End of test with charger off)",
        fieldType: "label",
      },
      {
        id: "row1",
        fieldName: "1",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "row2",
        fieldName: "2",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "row3",
        fieldName: "3",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "row4",
        fieldName: "4",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "row5",
        fieldName: "5",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "row6",
        fieldName: "6",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "row7",
        fieldName: "7",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "row8",
        fieldName: "8",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "row9",
        fieldName: "9",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "row10",
        fieldName: "10",
        fieldType: "number",
        numberDecimal: true,
      },
      {
        id: "div3",
        fieldName: "",
        fieldType: "divider",
      },
      {
        id: "g_volt",
        fieldName: "Battery Grounds Voltage",
        fieldType: "text",
      },
      {
        id: "adjust",
        fieldName: "Charger Adjusted?",
        fieldType: "radioList",
        options: ["Yes", "No"],
      },
      {
        id: "water",
        fieldName: "Water Added (inches)",
        fieldType: "text",
      },
      {
        id: "e_app",
        fieldName: "Equalizing Charges Applied (Reason, duration, results)",
        fieldType: "text",
      },
      {
        id: "rep",
        fieldName: "Repairs, Replacement, etc. (Provide details)",
        fieldType: "text",
      },
      {
        id: "sp5",
        fieldName: "",
        fieldType: "label",
      },
    ],
  },
];
