export const trackAndTimeForm = {
  tenantId: "ps19",
  listName: "appForms",
  code: "trackandtime",
  description: "Track and Time",

  opt2: {
    target: "jobBriefing",
    viewGroup: "2",
  },
  opt1: [
    {
      id: "name",
      fieldName: "Name",
      fieldType: "text",
      default: "#VAR_UNAME#",
      enabled: false,
    },
    {
      id: "equipno",
      fieldName: "EQUIPMENT NO.",
      fieldType: "text",
    },
    {
      id: "tbltes",
      fieldName: "Track and Time Form",
      fieldType: "table",
      options: [
        {
          id: "date",
          fieldName: "Date",
          fieldType: "date",
          default: "#VAR_NOW#",
          enabled: false,
        },
        {
          id: "authno",
          fieldName: "AUTH. NO.",
          fieldType: "text",
        },
        {
          id: "train",
          fieldName: "TRAIN AHEAD (ENG. NO. & DIR.)",
          fieldType: "text",
        },
        {
          id: "div",
          fieldName: "",
          fieldType: "divider",
        },
        {
          id: "limit",
          fieldName: "LIMITS",
          fieldType: "label",
        },
        {
          id: "track",
          fieldName: "TRACK",
          fieldType: "list",
          options: ["-", "MT1", "MT2", "MT3", "Amtrak Lead", "Freight Lead"],
        },
        {
          id: "lbet1",
          fieldName: "BETWEEN",
          fieldType: "text",
        },
        {
          id: "lsw1",
          fieldName: "SW (Y/N)",
          fieldType: "radioList",
          options: ["Yes", "No"],
        },
        {
          id: "lbet2",
          fieldName: "BETWEEN",
          fieldType: "text",
        },
        {
          id: "lsw2",
          fieldName: "SW (Y/N)",
          fieldType: "radioList",
          options: ["Yes", "No"],
        },
        {
          id: "div1",
          fieldName: "",
          fieldType: "divider",
        },
        {
          id: "joint",
          fieldName: "JOINT WITH",
          fieldType: "text",
        },
        {
          id: "tuntil",
          fieldName: "TIME UNTIL",
          fieldType: "time",
          enabled: true,
        },
        {
          id: "oktime",
          fieldName: "OK TIME",
          fieldType: "time",
          enabled: true,
        },
        {
          id: "dispinit",
          fieldName: "DISP. INITIALS",
          fieldType: "text",
        },
        {
          id: "div2",
          fieldName: "",
          fieldType: "divider",
        },
        {
          id: "rollup",
          fieldName: "TRACK ROLL UP",
          fieldType: "label",
        },
        {
          id: "locatime",
          fieldName: "LOCATIONS & TIMES",
          fieldType: "text",
        },
        {
          id: "div3",
          fieldName: "",
          fieldType: "divider",
        },
        {
          id: "exttime",
          fieldName: "EXTENDED TIME",
          fieldType: "time",
          enabled: true,
        },
        {
          id: "timerel",
          fieldName: "TIME RELEASED",
          fieldType: "time",
          enabled: true,
        },
        {
          id: "daterel",
          fieldName: "DATE RELEASED",
          fieldType: "date",
          enabled: true,
        },
        {
          id: "dispinit2",
          fieldName: "DISP. INITIALS",
          fieldType: "text",
        },
        {
          id: "sp",
          fieldName: "",
          fieldType: "label",
        },
      ],
    },
    {
      id: "div4",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "notes",
      fieldName: "NOTES",
      fieldType: "text",
    },
  ],
};
