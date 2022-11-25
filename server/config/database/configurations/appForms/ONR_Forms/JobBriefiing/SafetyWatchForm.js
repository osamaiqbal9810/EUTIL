export const ONR_SafetyWatchBriefing = {
  tenantId: "ps19",
  listName: "appForms",
  code: "onrsafetyWatchBriefing",
  description: "Safety Watch Job Briefing",
  opt2: {
    target: "jobBriefing",
    viewGroup: "1",
  },
  opt1: [
    {
      id: "top",
      fieldName: "To be completed when applicable",
      fieldType: "text",
      enabled: false,
    },
    {
      id: "dw",
      fieldName: "The date of the work",
      fieldType: "label",
    },
    {
      id: "date",
      fieldName: "Date and Time",
      fieldType: "date",
      default: "#VAR_NOW#",
      enabled: false,
    },
    {
      id: "div",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "loc",
      fieldName: "Location",
      fieldType: "label",
    },
    {
      id: "betat",
      fieldName: "Track(s) Between / At",
      fieldType: "text",
    },
    {
      id: "and",
      fieldName: "And",
      fieldType: "text",
    },
    {
      id: "div1",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "dsw",
      fieldName: "Who is the designated Safety Watch?",
      fieldType: "text",
    },
    {
      id: "wwswp",
      fieldName: "Where will the Safety Watch will be positioned?",
      fieldType: "text",
    },
    {
      id: "wwbp",
      fieldName: "What work is being performed?",
      fieldType: "text",
    },
    {
      id: "actors",
      fieldName: "If additional clearing time is required – how many seconds?",
      fieldType: "text",
    },
    {
      id: "div2",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "mtst",
      fieldName: "The maximum train speed on that track?",
      fieldType: "label",
    },
    {
      id: "speed",
      fieldName: "Speed",
      fieldType: "text",
    },
    {
      id: "sight",
      fieldName: "Sightline Required",
      fieldType: "text",
    },
    {
      id: "div3",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "wsight",
      fieldName: "The sightline distance at the worksite",
      fieldType: "text",
    },
    {
      id: "div4",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "determ",
      fieldName: "How was the sightline determined?",
      fieldType: "label",
    },
    {
      id: "pline",
      fieldName: "Pole Line",
      fieldType: "checkbox",
    },
    {
      id: "sigma",
      fieldName: "Signals",
      fieldType: "checkbox",
    },
    {
      id: "mboard",
      fieldName: "Mile Boards",
      fieldType: "checkbox",
    },
    {
      id: "measu",
      fieldName: "Measured",
      fieldType: "checkbox",
    },
    {
      id: "range",
      fieldName: "Range Finder",
      fieldType: "checkbox",
    },
    {
      id: "div5",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "wwcart",
      fieldName: "Where the workers will clear on the approach of rail traffic",
      fieldType: "text",
    },
    {
      id: "hwag",
      fieldName: "How the warning will be given",
      fieldType: "text",
    },
    {
      id: "wtpwc",
      fieldName: "Where tools are to be placed when clearing",
      fieldType: "text",
    },
    {
      id: "wwct",
      fieldName: "Who will clear the tools",
      fieldType: "text",
    },
    {
      id: "oraj",
      fieldName: "Other risks at the jobsite",
      fieldType: "text",
    },

    {
      id: "sp",
      fieldName: "",
      fieldType: "label",
    },
  ],
};
