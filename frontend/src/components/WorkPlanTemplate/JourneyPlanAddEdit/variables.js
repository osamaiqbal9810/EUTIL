/* eslint eqeqeq: 0 */
import { languageService } from "../../../Language/language.service";
import _ from "lodash";
import { inspectionSettings } from "./setting";

export const keyValueProperties = [
  "title",
  // "startDate",
  "inspectionType",
  "inspectionFrequency",
  "minDays",
  "maxAllowable",
  "timeFrame",
  "perTime",
];
export const otherKeyValueProperties = ["workZone", "foulTime"];

export const INSPECTION_TYPES = {
  FIXED: "fixed",
  CUSTOM: "custom",
};

const defaultFieldSchema = {
  element: "input",
  value: "",
  label: true,
  labelText: "sameAsConfigName",
  containerConfig: { col: 12 },
  config: {
    name: "defaultFieldSchema",
    type: "text",
    placeholder: "",
  },
  validation: {
    required: true,
  },
  valid: false,
  touched: false,
  validationMessage: "",
};

export const inspectionFields = {
  title: {
    ..._.cloneDeep(defaultFieldSchema),
    labelText: "Name",
    config: { name: "title", type: "text", placeholder: "Inspection Run Name" },
  },
  user: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "select",
    labelText: "Assign To",
    config: { name: "user", type: "text", options: [], disabled: false },
    hide: false
  },
  
  // startDate: {
  //   ..._.cloneDeep(defaultFieldSchema),
  //   element: "date",
  //   labelText: "Start Date",
  //   config: { name: "startDate", type: "text", placeholder: "Select Date" },
  // },
  inspectionType: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "radio",
    value: inspectionSettings.logic == "perTime" ? INSPECTION_TYPES.CUSTOM : INSPECTION_TYPES.FIXED,
    labelText: "Select one",
    containerConfig: { col: 8, className: "custom-checkbox" },
    config: {
      name: "inspectionType",
      type: "number",
      placeholder: "Frequency",
      options: [
        {
          val: INSPECTION_TYPES.FIXED,
          text: `${languageService("Inspection recurs at day")} 0`,
        },
        {
          val: INSPECTION_TYPES.CUSTOM,
          text: `${languageService("Inspection due at day")} 0`,
        },
      ],
    },
    valid: true,
    hide: inspectionSettings.logic == "perTime" ? true : false,
  },
  FRAOption: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "select",
    value: "",
    label: true,
    labelText: languageService("Options Preset"),
    config: { name: "FRAOption", type: "text", options: [], col: 8 },
    containerConfig: { col: 12 },
    validation: { required: false },
    valid: true,
    customFieldComp: null,
    hide: true,
  },
  inspectionFrequency: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "input",
    value: 0,
    label: true,
    labelText: languageService("Repeat after days"),
    containerConfig: { col: 12 },
    config: { name: "inspectionFrequency", type: "number", placeholder: "Frequency" },
    validation: { required: inspectionSettings.logic == "perTime" ? false : true, min: 0, max: 500 },
    valid: true,
    hide: inspectionSettings.logic == "perTime" ? true : false,
  },
  perTime: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "input",
    value: 0,
    label: true,
    labelText: languageService("Frequency"),
    containerConfig: { col: 6 },
    config: { name: "perTime", type: "number", placeholder: "" },
    // validation: { required: inspectionSettings.logic == "perTime" ? true : false, min: 0 },
    validation: { required: false },
    valid: true,
    hide: /* inspectionSettings.logic == "perTime" ? false :*/ true,
  },
  timeFrame: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "select",
    value: 0,
    label: true,
    labelText: "per",
    containerConfig: { col: 6 },
    config: {
      name: "timeFrame",
      type: "text",
      options: [{}, { val: "Week", text: "Week" }, { val: "Month", text: "Month" }, { val: "Year", text: "Year" }],
    },
    validation: { required: false },
    valid: true,
    hide: /* inspectionSettings.logic == "perTime" ? false :*/ true,
  },

  maxAllowable: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "input",
    value: 0,
    labelText: `${languageService("Must be performed once within")} 0 ${languageService("days")}`,
    config: { name: "maxAllowable", type: "number", placeholder: languageService("Must be performed once in days") },
    validation: { required: inspectionSettings.logic == "perTime" ? false : true, min: 0, max: 500 },
    hide: inspectionSettings.logic == "perTime" ? true : false,
  },
  minDays: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "input",
    labelText: languageService("Days between Inspections"),
    value: 0,
    config: { name: "minDays", type: "number", placeholder: languageService("Days before next inspection") },
    validation: { required: false },
    valid: true,
    hide: true,
  },
};
export const otherInspectionFields = {
  watchmen: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "select",
    labelText: languageService("Watchmen"),
    config: { name: "watchmen", type: "text", options: [] },
    validation: { required: false },
  },
  workZone: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "checkbox",
    value: false,
    labelText: languageService("Work Zone"),
    containerConfig: { col: 4, className: "custom-checkbox" },
    config: { name: "workZone", type: "checkbox", options: [] },
    valid: true,
    validation: { required: false },
  },
  foulTime: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "checkbox",
    value: false,
    labelText: languageService("Foul Time"),
    containerConfig: { col: 4, className: "custom-checkbox" },
    config: { name: "foulTime", type: "checkbox", options: [] },
    valid: true,
    validation: { required: false },
  },
};
export const inspectionRunRelatedFields = {
  lineId: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "select",
    labelText: "Location",
    config: { name: "lineId", type: "text", options: [] },
  },
  // inspectionRun: {
  //   ..._.cloneDeep(defaultFieldSchema),
  //   element: "inputSelect",
  //   labelText: "Run/Range",
  //   config: {
  //     name: "inspectionRun",
  //     type: "text",
  //     options: [],
  //   },
  //   customFieldComp: null,
  // },
  // runStart: {
  //   ..._.cloneDeep(defaultFieldSchema),
  //   element: "input",
  //   value: "",
  //   labelText: "Start",

  //   config: { name: "runStart", type: "number", placeholder: "Run Start" },
  // },
  // runEnd: {
  //   ..._.cloneDeep(defaultFieldSchema),
  //   element: "input",
  //   value: "",
  //   labelText: "End",

  //   config: { name: "runEnd", type: "number", placeholder: "Run End" },
  // },
  inspectionAssets: {
    ..._.cloneDeep(defaultFieldSchema),
    element: "AssetSelection",
    value: [],
    labelText: "Assets",
    config: { name: "inspectionAssets", type: "text", options: [] },
    hide:false
  },
};
