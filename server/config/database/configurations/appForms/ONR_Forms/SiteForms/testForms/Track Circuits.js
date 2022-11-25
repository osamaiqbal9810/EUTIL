export const trackCircuits = [
  {
    id: "Inspected",
    fieldName: "Scheduled Inspection",
    fieldType: "checkbox",
    tag: "completionCheck",
  },
  {
    id: "desc",
    fieldName:
      "Test Track Circuit Isolation and Polarity following work that may cause polarity swap or track lead crossing (if applicable).  Perform Tests and record results",
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
];
