export const formOForm = {
  tenantId: "ps19",
  listName: "appForms",
  code: "formo",
  description: "Form O",

  opt2: {
    target: "jobBriefing",
    viewGroup: "3",
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
      id: "tbltest",
      fieldName: "Tracks removed from service - Form O",
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
          fieldName: "AUTHORITY NO.",
          fieldType: "text",
        },
        {
          id: "track",
          fieldName: "TRACK(S)",
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
          id: "lbet1",
          fieldName: "BETWEEN",
          fieldType: "text",
        },
        {
          id: "lbet2",
          fieldName: "BETWEEN",
          fieldType: "text",
        },
        {
          id: "div1",
          fieldName: "",
          fieldType: "divider",
        },
        {
          id: "exp",
          fieldName: "EXPIRES",
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
          id: "no1",
          fieldName: "MP RED FLAG",
          fieldType: "number",
          numberDecimal: true,
        },
        {
          id: "no2",
          fieldName: "MP RED FLAG",
          fieldType: "number",
          numberDecimal: true,
        },
        {
          id: "div2",
          fieldName: "",
          fieldType: "divider",
        },
        {
          id: "equipt",
          fieldName: "EQUIPMENT / TRAIN IN LIMITS",
          fieldType: "label",
        },
        {
          id: "train",
          fieldName: "TRAIN",
          fieldType: "text",
        },
        {
          id: "name1",
          fieldName: "NAME",
          fieldType: "text",
        },
        {
          id: "timein",
          fieldName: "TIME IN",
          fieldType: "time",
          enabled: true,
        },
        {
          id: "tclr",
          fieldName: "TIME CLR",
          fieldType: "time",
          enabled: true,
        },
        {
          id: "sp",
          fieldName: "",
          fieldType: "label",
        },
      ],
    },
    {
      id: "div3",
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
