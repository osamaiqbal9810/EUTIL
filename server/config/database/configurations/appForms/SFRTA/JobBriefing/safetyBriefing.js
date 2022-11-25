export const safetyBriefingForm = {
  tenantId: "ps19",
  listName: "appForms",
  code: "safetyBriefing",
  description: "Job Briefing Log",
  opt2: {
    target: "jobBriefing",
    viewGroup: "0",
  },
  opt1: [
    {
      id: "date",
      fieldName: "Date",
      fieldType: "date",
      default: "#VAR_NOW#",
      enabled: false,
    },
    {
      id: "loc",
      fieldName: "Work Location",
      fieldType: "text",
    },
    {
      id: "rwic",
      fieldName: "RWIC/EIC",
      fieldType: "text",
      default: "#VAR_UNAME#",
      enabled: false,
    },
    {
      id: "p-rwic",
      fieldName: "RWIC/EIC Phone No.",
      fieldType: "text",
    },
    {
      id: "tot",
      fieldName: "Type of Track",
      fieldType: "radioList",
      options: ["Controlled", "Non-Controlled"],
    },
    {
      id: "tr_speed",
      fieldName: "Track Speed",
      fieldType: "text",
    },

    {
      id: "tp-pro",
      fieldName: "Type of Protection",
      fieldType: "text",
    },

    {
      id: "div",
      fieldName: "",
      fieldType: "divider",
    },

    {
      id: "w-lim",
      fieldName: "Working Limits",
      fieldType: "label",
    },
    {
      id: "div9",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "inacc_tr",
      fieldName: "Inaccessible Track",
      fieldType: "text",
    },

    {
      id: "to",
      fieldName: "to",
      fieldType: "text",
    },

    {
      id: "au_no",
      fieldName: "Authority Number",
      fieldType: "text",
    },
    {
      id: "tr_no",
      fieldName: "Track Number(s)",
      fieldType: "text",
    },
    {
      id: "tr_limit",
      fieldName: "Track Limits",
      fieldType: "text",
    },
    {
      id: "to1",
      fieldName: "to",
      fieldType: "text",
    },
    {
      id: "time_limit",
      fieldName: "Time Limits",
      fieldType: "time",
    },
    {
      id: "to2",
      fieldName: "to",
      fieldType: "time",
    },
    {
      id: "adj-prot",
      fieldName: "Adjacent Track Protection",
      fieldType: "radioList",
      options: ["Y", "N"],
      binding: {
        property: "value",
        target: "tr_limit1",
        targetGroup: "lookupGroup",
        targetProperty: "visible",
        mapping: [
          {
            options: ["Y"],
            mapTo: "true",
            targetGroup: "lookupGroup",
          },
          {
            options: ["N"],
            mapTo: "false",
            targetGroup: "lookupGroup",
          },
        ],
      },
    },
    {
      id: "tr_limit1",
      fieldName: "Track Limits",
      fieldType: "text",
      groupId: "lookupGroup",
      groupVisibility: "false",
    },
    {
      id: "to3",
      fieldName: "to",
      fieldType: "text",
      groupId: "lookupGroup",
      groupVisibility: "false",
    },
    {
      id: "time_limit1",
      fieldName: "Time Limits",
      fieldType: "time",
      groupId: "lookupGroup",
      groupVisibility: "false",
    },
    {
      id: "to4",
      fieldName: "to",
      fieldType: "time",
      groupId: "lookupGroup",
      groupVisibility: "false",
    },
    {
      id: "div1",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "t-warn",
      fieldName: "Train Approach Warning",
      fieldType: "label",
    },
    {
      id: "div10",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "t-time",
      fieldName: "Clearing Time",
      fieldType: "text",
    },
    {
      id: "t-dist",
      fieldName: "Sight Distance",
      fieldType: "text",
    },
    {
      id: "div2",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "i-det",
      fieldName: "Individual Train Detection",
      fieldType: "label",
    },
    {
      id: "div11",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "i-time",
      fieldName: "Clearing Time",
      fieldType: "time",
    },
    {
      id: "i-dist",
      fieldName: "Sight Distance",
      fieldType: "text",
    },
    {
      id: "div3",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "other",
      fieldName: "Job/Task",
      fieldType: "label",
    },
    {
      id: "div12",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "explain",
      fieldName: "Explain",
      fieldType: "text",
    },
    {
      id: "div4",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "note",
      fieldName: "Notes",
      fieldType: "text",
    },
    {
      id: "rotd",
      fieldName: "Rule of the Day",
      fieldType: "text",
    },
    {
      id: "zsaki",
      fieldName: "",
      fieldType: "label",
    },
  ],
};
