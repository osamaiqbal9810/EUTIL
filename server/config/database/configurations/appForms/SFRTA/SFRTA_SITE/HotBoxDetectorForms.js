export const sfrtaHotBox30Days = {
  code: "sfrtaHotBox30Days",
  tenantId: "ps19",
  description: "Hot Box Detector 30 Days",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: [],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },

    {
      id: "bloc",
      fieldName: "Hot Box Detector",
      fieldType: "table",
      options: [
        {
          id: "desc",
          fieldName: "Track",
          fieldType: "text",
        },
        {
          id: "date",
          fieldName: "Date Tested",
          fieldType: "date",
          default: "#VAR_NOW#",
          enabled: false,
        },
        {
          id: "scan",
          fieldName: "Scanners",
          fieldType: "text",
        },
        {
          id: "ipad",
          fieldName: "IP Address",
          fieldType: "text",
        },
        {
          id: "mode",
          fieldName: "Modem Number",
          fieldType: "text",
        },
        {
          id: "syst",
          fieldName: "System",
          fieldType: "text",
        },
        {
          id: "clm1",
          fieldName: "Clean lens & mirror",
          fieldType: "text",
        },
        {
          id: "it1",
          fieldName: "Inspect transducers",
          fieldType: "text",
        },
        {
          id: "is1",
          fieldName: "Inspect scanners",
          fieldType: "text",
        },
        {
          id: "ctc1",
          fieldName: "Check track conditions",
          fieldType: "text",
        },
        {
          id: "vtds1",
          fieldName: "Verify time, date, & setup",
          fieldType: "text",
        },
        {
          id: "c12a1",
          fieldName: "Compare R1 & R2 Ave.",
          fieldType: "text",
        },
        {
          id: "va1",
          fieldName: "Verify alarms",
          fieldType: "text",
        },
        {
          id: "cr1",
          fieldName: "Check recall",
          fieldType: "text",
        },
        {
          id: "cbv1",
          fieldName: "Check battery voltage",
          fieldType: "text",
        },
        {
          id: "vtd1",
          fieldName: "Verify Train Direction",
          fieldType: "text",
        },
      ],
    },
  ],
};
export const sfrtaHotBox90Days = {
  code: "sfrtaHotBox90Days",
  tenantId: "ps19",
  description: "Hot Box Detector 90 Days",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: [],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "bloc",
      fieldName: "Hot Box Detector",
      fieldType: "table",
      options: [
        {
          id: "desc",
          fieldName: "Track",
          fieldType: "text",
        },
        {
          id: "date",
          fieldName: "Date Tested",
          fieldType: "date",
          default: "#VAR_NOW#",
          enabled: false,
        },
        {
          id: "tm1",
          fieldName: "Test modem",
          fieldType: "text",
        },
        {
          id: "tobc1",
          fieldName: "Turn off battery charger",
          fieldType: "text",
        },
        {
          id: "ca1",
          fieldName: "Check alignment",
          fieldType: "text",
        },
        {
          id: "ctl1",
          fieldName: "Check transducer loading",
          fieldType: "text",
        },
        {
          id: "ctp1",
          fieldName: "Check transducer polarity",
          fieldType: "text",
        },
        {
          id: "vatr1",
          fieldName: "Verify ambient temperature reading",
          fieldType: "text",
        },
        {
          id: "csca1",
          fieldName: "Calibrate scanners",
          fieldType: "text",
        },
        {
          id: "cih1",
          fieldName: "Check integrity heat",
          fieldType: "text",
        },
        {
          id: "cch1",
          fieldName: "Check case heaters",
          fieldType: "text",
        },
        {
          id: "var1",
          fieldName: "Verify alarm readout",
          fieldType: "text",
        },
        {
          id: "vas1",
          fieldName: "Verify alarm settings",
          fieldType: "text",
        },
        {
          id: "vvos1",
          fieldName: "Verify version of software",
          fieldType: "text",
        },
        {
          id: "tobac1",
          fieldName: "Turn on battery charger",
          fieldType: "text",
        },
      ],
    },
  ],
};
export const sfrtaDraggingEquip30Days = {
  code: "sfrtaDraggingEquip30Days",
  tenantId: "ps19",
  description: "Dragging Equipment 30 Days",
  listName: "appForms",
  opt2: {
    config: [],
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: [],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Scheduled Inspection",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
    {
      id: "bloc",
      fieldName: "Dragging Equipment",
      fieldType: "table",
      options: [
        {
          id: "desc",
          fieldName: "Track",
          fieldType: "text",
        },
        {
          id: "date",
          fieldName: "Date Tested",
          fieldType: "date",
          default: "#VAR_NOW#",
          enabled: false,
        },
        {
          id: "desc",
          fieldName: "Inspect dragging equipment",
          fieldType: "text",
        },
        {
          id: "desc",
          fieldName: "Test operation of dragging equipment",
          fieldType: "text",
        },
      ],
    },
  ],
};
