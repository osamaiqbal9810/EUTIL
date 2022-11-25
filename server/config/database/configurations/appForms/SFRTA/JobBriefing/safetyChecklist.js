export const safetyChecklistForm = {
  tenantId: "ps19",
  listName: "appForms",
  code: "briefingChecklist",
  description: "Safety Reminders Checklist",

  opt2: {
    target: "jobBriefing",
    viewGroup: "1",
  },
  opt1: [
    {
      id: "wneat",
      fieldName: "Working near OTE",
      fieldType: "radioList",
      options: ["Y", "N"],
    },
    {
      id: "atp",
      fieldName: "Adjacent Track Protection",
      fieldType: "radioList",
      options: ["Y", "N"],
    },
    {
      id: "appe",
      fieldName: "Additional PPE",
      fieldType: "radioList",
      options: ["Y", "N"],
    },
    {
      id: "tequip",
      fieldName: "Tools & Equipment Inspected",
      fieldType: "radioList",
      options: ["Y", "N"],
    },
    {
      id: "overcab",
      fieldName: "Overhead Electrical Cables",
      fieldType: "radioList",
      options: ["Y", "N"],
    },
    {
      id: "locutil",
      fieldName: "Locates for Underground Utilities",
      fieldType: "radioList",
      options: ["Y", "N"],
    },
    {
      id: "aid",
      fieldName: "First Aid Kit",
      fieldType: "radioList",
      options: ["Y", "N"],
    },
    {
      id: "loc1",
      fieldName: "Location",
      fieldType: "text",
    },
    {
      id: "eplan",
      fieldName: "Emergency Action Plan",
      fieldType: "radioList",
      options: ["Y", "N"],
    },
    {
      id: "loc2",
      fieldName: "Location",
      fieldType: "text",
    },
    {
      id: "hazard",
      fieldName: "Hazards",
      fieldType: "text",
    },
    {
      id: "div7",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "fprot",
      fieldName: "Fall Protection",
      fieldType: "label",
    },
    {
      id: "arr",
      fieldName: "Fall Arrest",
      fieldType: "checkbox",
    },
    {
      id: "rest",
      fieldName: "Fall Restraint",
      fieldType: "checkbox",
    },
    {
      id: "rplan",
      fieldName: "Rescue Plan",
      fieldType: "checkbox",
    },
    {
      id: "loct",
      fieldName: "Location",
      fieldType: "checkbox",
    },
    {
      id: "div8",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "note1",
      fieldName: "Notes",
      fieldType: "text",
    },
    {
      id: "labe",
      fieldName: "",
      fieldType: "label",
    },
  ],
};
