export const etrLHSwitchForm = {
  tenantId: "ps19",
  listName: "appForms",
  code: "etrLHSwitchForm",
  description: "ETR Switch LH Form",
  opt2: { config: [], allowedInstruction: [], restrictAssetTypes: [], allowedAssetTypes: ["Customer Switch LH", "Switch LH"] },
  opt1: [
    {
      id: "inspected",
      fieldName: "Inspection Complete",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "gt1",
      fieldName: "1. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gs1",
      fieldName: "1. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt2",
      fieldName: "2. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gs2",
      fieldName: "2. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt3",
      fieldName: "3. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gs3",
      fieldName: "3. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt4",
      fieldName: "4. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gs4",
      fieldName: "4. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt5",
      fieldName: "5. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gs5",
      fieldName: "5. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt6",
      fieldName: "6. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gs6",
      fieldName: "6. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt7",
      fieldName: "7. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gs7",
      fieldName: "7. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt8",
      fieldName: "8. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gin",
      fieldName: "GAUGE IN 10 FEET INTERVALS BEHIND THE FROG ROUTE",
      fieldType: "label",
    },
    {
      id: "g1",
      fieldName: "10FT Turnout",
      fieldType: "text",
    },
    {
      id: "g11",
      fieldName: "10FT Straight",
      fieldType: "text",
    },
    {
      id: "g2",
      fieldName: "20FT Turnout",
      fieldType: "text",
    },
    {
      id: "g22",
      fieldName: "20FT Straight",
      fieldType: "text",
    },
    {
      id: "g3",
      fieldName: "30FT Turnout",
      fieldType: "text",
    },
    {
      id: "g33",
      fieldName: "30FT Straight",
      fieldType: "text",
    },
    {
      id: "g4",
      fieldName: "40FT Turnout",
      fieldType: "text",
    },
    {
      id: "g44",
      fieldName: "40FT Straight",
      fieldType: "text",
    },
    {
      id: "div",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "info",
      fieldName: "1. TURNOUT INFORMATION",
      fieldType: "label",
    },
    {
      id: "rail",
      fieldName: "Rail Weight and Section (Lbs):",
      fieldType: "text",
    },
    {
      id: "s_lgt",
      fieldName: "Switch Pt. Length:",
      fieldType: "label",
    },
    {
      id: "feet",
      fieldName: "Feet",
      fieldType: "text",
    },
    {
      id: "inch",
      fieldName: "Inches",
      fieldType: "text",
    },
    {
      id: "frog8",
      fieldName: "Frog #8:",
      fieldType: "text",
    },
    {
      id: "stand",
      fieldName: "Switch Stand:",
      fieldType: "text",
    },
    {
      id: "div1",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "cond",
      fieldName: "2. GENERAL CONDITION",
      fieldType: "label",
    },
    {
      id: "ballast",
      fieldName: "Ballast Section Standard",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "ties",
      fieldName: "Switch Ties in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "correct",
      fieldName: "Line Correct Throughout Turnout",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "satisfy",
      fieldName: "Rail Conditions Satisfactory",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "div2",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "s_stand",
      fieldName: "3. SWITCH STAND",
      fieldType: "label",
    },
    {
      id: "fast",
      fieldName: "Stand Securely Fastened to Ties",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "latch",
      fieldName: "Latches in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "lock",
      fieldName: "Lock in Good Condition and Fastened",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "lever",
      fieldName: "Lever in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "motion",
      fieldName: "Proper Motion in Stand",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "div3",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "switch1",
      fieldName: "4. SWITCH",
      fieldType: "label",
    },
    {
      id: "points",
      fieldName: "Points in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "p_tight",
      fieldName: "Points Tight",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "heel",
      fieldName: "Heel Blocks in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "stock",
      fieldName: "Stock Rail in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "braces",
      fieldName: "Braces in Place and Tight",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "bolts",
      fieldName: "Bolts in Place and Tight",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "cotter",
      fieldName: "Cotter Keys in Place and Tight",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "div4",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "frog",
      fieldName: "5. FROG",
      fieldType: "label",
    },
    {
      id: "wing",
      fieldName: "Point and Wing in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "place",
      fieldName: "Bolts in Place and Tight",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "ends",
      fieldName: "Joints at Ends in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
  ],
};

export const etrRHSwitchForm = {
  tenantId: "ps19",
  listName: "appForms",
  code: "etrRHSwitchForm",
  description: "ETR Switch RH Form",
  opt2: { config: [], allowedInstruction: [], restrictAssetTypes: [], allowedAssetTypes: ["Customer Switch RH", "Switch RH"] },
  opt1: [
    {
      id: "inspected",
      fieldName: "Inspection Complete",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "gs1",
      fieldName: "1. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt1",
      fieldName: "1. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gs2",
      fieldName: "2. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt2",
      fieldName: "2. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gs3",
      fieldName: "3. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt3",
      fieldName: "3. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gs4",
      fieldName: "4. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt4",
      fieldName: "4. Gauge Turnout",
      fieldType: "text",
    },

    {
      id: "gs5",
      fieldName: "5. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt5",
      fieldName: "5. Gauge Turnout",
      fieldType: "text",
    },

    {
      id: "gs6",
      fieldName: "6. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt6",
      fieldName: "6. Gauge Turnout",
      fieldType: "text",
    },

    {
      id: "gs7",
      fieldName: "7. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gt7",
      fieldName: "7. Gauge Turnout",
      fieldType: "text",
    },
    {
      id: "gs8",
      fieldName: "8. Gauge Straight",
      fieldType: "text",
    },
    {
      id: "gin",
      fieldName: "GAUGE IN 10 FEET INTERVALS BEHIND THE FROG ROUTE",
      fieldType: "label",
    },
    {
      id: "g1",
      fieldName: "10FT Turnout",
      fieldType: "text",
    },
    {
      id: "g11",
      fieldName: "10FT Straight",
      fieldType: "text",
    },
    {
      id: "g2",
      fieldName: "20FT Turnout",
      fieldType: "text",
    },
    {
      id: "g22",
      fieldName: "20FT Straight",
      fieldType: "text",
    },
    {
      id: "g3",
      fieldName: "30FT Turnout",
      fieldType: "text",
    },
    {
      id: "g33",
      fieldName: "30FT Straight",
      fieldType: "text",
    },
    {
      id: "g4",
      fieldName: "40FT Turnout",
      fieldType: "text",
    },
    {
      id: "g44",
      fieldName: "40FT Straight",
      fieldType: "text",
    },
    {
      id: "div",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "info",
      fieldName: "1. TURNOUT INFORMATION",
      fieldType: "label",
    },
    {
      id: "rail",
      fieldName: "Rail Weight and Section (Lbs):",
      fieldType: "text",
    },
    {
      id: "s_lgt",
      fieldName: "Switch Pt. Length:",
      fieldType: "label",
    },
    {
      id: "feet",
      fieldName: "Feet",
      fieldType: "text",
    },
    {
      id: "inch",
      fieldName: "Inches",
      fieldType: "text",
    },
    {
      id: "frog8",
      fieldName: "Frog #8:",
      fieldType: "text",
    },
    {
      id: "stand",
      fieldName: "Switch Stand:",
      fieldType: "text",
    },
    {
      id: "div1",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "cond",
      fieldName: "2. GENERAL CONDITION",
      fieldType: "label",
    },
    {
      id: "ballast",
      fieldName: "Ballast Section Standard",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "ties",
      fieldName: "Switch Ties in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "correct",
      fieldName: "Line Correct Throughout Turnout",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "satisfy",
      fieldName: "Rail Conditions Satisfactory",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "div2",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "s_stand",
      fieldName: "3. SWITCH STAND",
      fieldType: "label",
    },
    {
      id: "fast",
      fieldName: "Stand Securely Fastened to Ties",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "latch",
      fieldName: "Latches in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "lock",
      fieldName: "Lock in Good Condition and Fastened",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "lever",
      fieldName: "Lever in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "motion",
      fieldName: "Proper Motion in Stand",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "div3",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "switch1",
      fieldName: "4. SWITCH",
      fieldType: "label",
    },
    {
      id: "points",
      fieldName: "Points in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "p_tight",
      fieldName: "Points Tight",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "heel",
      fieldName: "Heel Blocks in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "stock",
      fieldName: "Stock Rail in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "braces",
      fieldName: "Braces in Place and Tight",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "bolts",
      fieldName: "Bolts in Place and Tight",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "cotter",
      fieldName: "Cotter Keys in Place and Tight",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "div4",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "frog",
      fieldName: "5. FROG",
      fieldType: "label",
    },
    {
      id: "wing",
      fieldName: "Point and Wing in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "place",
      fieldName: "Bolts in Place and Tight",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "ends",
      fieldName: "Joints at Ends in Good Condition",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
  ],
};