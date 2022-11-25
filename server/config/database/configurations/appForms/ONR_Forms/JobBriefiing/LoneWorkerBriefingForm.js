export const ONR_LoneWorkerBriefing = {
  tenantId: "ps19",
  listName: "appForms",
  code: "onrloneWorkerBriefing",
  description: "Lone Worker Briefing Log",
  opt2: {
    target: "jobBriefing",
    viewGroup: "2",
  },
  opt1: [
    {
      id: "top",
      fieldName: "To be completed when applicable",
      fieldType: "text",
      enabled: false,
    },
    {
      id: "name",
      fieldName: "Name",
      fieldType: "text",
      default: "#VAR_UNAME#",
      enabled: false,
    },
    {
      id: "date",
      fieldName: "Date",
      fieldType: "date",
      default: "#VAR_NOW#",
      enabled: false,
    },
    {
      id: "sub",
      fieldName: "Subdivision",
      fieldType: "text",
    },
    {
      id: "work",
      fieldName: "Working Limits",
      fieldType: "text",
    },
    {
      id: "time",
      fieldName: "Time Limits",
      fieldType: "text",
    },
    {
      id: "rfsrt",
      fieldName: "RTC / Foreman / Supervisor Reviewed and Time",
      fieldType: "text",
    },
    {
      id: "sp",
      fieldName: "",
      fieldType: "label",
    },
  ],
};
