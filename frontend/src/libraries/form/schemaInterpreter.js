import {
  getValidation,
  getRequiredValidation,
  getMinLengthValidation,
  getMaxLengthValidation,
  getMinValueValidation,
  getMaxValueValidation,
} from "./validations";
import _ from "lodash";
import { supportedFields, getDefaultValue } from "./supportedFields";
import { fieldTemplate } from "./fieldTemplate";
import { getDate } from "./utilities/dateParser";
import { getTime } from "./utilities/timeParser";
import {convertToCreateableSelectOptions} from '../utils/select-options'
import { FormPossibleFieldPositions } from "./datatypes/FormPossibleFieldPositions";

const defaultSectionUiConfig = {
  class: "label-left",
};

var createCustomField = (fieldSchema) => {
  let success = false;
  let type = fieldSchema.type ? fieldSchema.type : "input";
  let field = _.cloneDeep(fieldTemplate);
  let implicitValidations = []; // Interpret the desired validations

  // check if the field type is supported right now
  if (fieldSchema && type && type in supportedFields) {
    success = true;
    // decode and validate schema
    field.id = fieldSchema.id;
    field.element.type = type;
    field.element.disabled = fieldSchema.disabled && fieldSchema.disabled === true ? true : false;
    field.element.hide = fieldSchema.hide && fieldSchema.hide === true ? true : false;
    field.element.value = getDefaultValue(type);
    switch (type) {
      case "input":
        {
          field.element.settings[type].subType = supportedFields[type].types.includes(fieldSchema.subType)
            ? fieldSchema.subType
            : supportedFields[type].defaultType;
          implicitValidations.push(
            getValidation({ type: field.element.settings[type].subType, disabled: fieldSchema.disabledPasswordValidation }),
          );
          break;
        }
      case "file":
        {
          if (fieldSchema.acceptedFormats && Array.isArray(fieldSchema.acceptedFormats) && fieldSchema.acceptedFormats.length) {
            field.element.settings[type].accept = fieldSchema.acceptedFormats.join(', ');
          }
          // todo: enable this later. it works
          // implicitValidations.push(
          //   getValidation({ type: 'url' }),
          // );
          break;
        }
      case "textarea": {
        break;
      }
      case "select": {
        field.element.settings.options =
          fieldSchema.selectOptions && Array.isArray(fieldSchema.selectOptions) ? fieldSchema.selectOptions : [];
        field.element.settings[type].showFieldsOnCertainValue =
          fieldSchema.showFieldsOnCertainValue && Array.isArray(fieldSchema.showFieldsOnCertainValue)
            ? fieldSchema.showFieldsOnCertainValue
            : [];
        field.element.settings[type].updatedSectionFieldsOnCertainValue =
          fieldSchema.updatedSectionFieldsOnCertainValue && Array.isArray(fieldSchema.updatedSectionFieldsOnCertainValue)
            ? fieldSchema.updatedSectionFieldsOnCertainValue
            : [];
  
        break;
      }
      case "multiSelect": {
        field.element.settings.options = [];

        if (fieldSchema.selectOptions && Array.isArray(fieldSchema.selectOptions)) {
          let options = fieldSchema.selectOptions.map((v) => ({ value: v.val, label: v.text }));
          let index = options.findIndex((item) => item.value === "");
          if (index !== -1) {
            options.splice(index, 1);
          }
          field.element.settings.options = options;
        }

        break;
      }
      case "createableSelect": {
        
        break;
      }
      case "radio": {
        field.element.settings.options =
          fieldSchema.radioOptions && Array.isArray(fieldSchema.radioOptions) ? fieldSchema.radioOptions : [];
        break;
      }
      case "checkbox": {
        break;
      }
      case "date":
      case "dateTime": {
        // todo: move this placeholder somewhere else
        field.element.settings[type].format = fieldSchema.format ? fieldSchema.format : field.element.settings[type].format;
        field.element.settings[type].showYearMonthControls = fieldSchema.showYearMonthControls
          ? true
          : field.element.settings[type].showYearMonthControls;
        field.element.settings[type].showTimeInput = fieldSchema.showTimeInput ? true : field.element.settings[type].showTimeInput;
        fieldSchema.placeholderValue = fieldSchema.placeholderValue ? fieldSchema.placeholderValue : field.element.settings[type].format;
        if (fieldSchema.futureOnly) {
          field.element.settings[type].minDate = new Date();
        } else if (fieldSchema.pastOnly) {
          field.element.settings[type].maxDate = new Date();
        } else {
          let minDate = getDate(fieldSchema.minDate);
          field.element.settings[type].minDate = minDate ? minDate : field.element.settings[type].minDate;
          let maxDate = getDate(fieldSchema.maxDate);
          field.element.settings[type].maxDate = maxDate ? maxDate : field.element.settings[type].maxDate;
        }
        break;
      }
      case "time": {
        field.element.settings[type].format = fieldSchema.format ? fieldSchema.format : field.element.settings[type].format;
        fieldSchema.placeholderValue = fieldSchema.placeholderValue ? fieldSchema.placeholderValue : field.element.settings[type].format;
        let minTime = getTime(fieldSchema.minTime);
        field.element.settings[type].minTime = minTime ? minTime : getTime(field.element.settings[type].minTime);
        let maxTime = getTime(fieldSchema.maxTime);
        field.element.settings[type].maxTime = maxTime ? maxTime : getTime(field.element.settings[type].maxTime);
        break;
      }
      case "button": {
        field.element.settings[type].action = supportedFields[type].actions.includes(fieldSchema.action)
          ? fieldSchema.action
          : supportedFields[type].defaultAction;
        field.element.settings[type].callback =
          fieldSchema.callback && typeof fieldSchema.callback === "function" ? fieldSchema.callback : null;
        field.element.settings[type].resetFieldIds = fieldSchema.resetFieldIds ? fieldSchema.resetFieldIds : null; // todo: should i add a function callback here
        field.element.settings[type].showFieldIds = fieldSchema.showFieldIds ? fieldSchema.showFieldIds : null;
        field.element.settings[type].hideFieldIds = fieldSchema.hideFieldIds ? fieldSchema.hideFieldIds : null;
        break;
      }
      default:
      {
        break;
      }
    }
    field.element.label.visible = fieldSchema.labelVisibility && fieldSchema.labelVisibility === false ? false : true;
    field.element.label.value = fieldSchema.labelValue ? fieldSchema.labelValue : fieldSchema.id;
    field.element.label.valueExtension = fieldSchema.labelValueExtension ? fieldSchema.labelValueExtension : "";
    field.element.placeholder.visible = fieldSchema.placeholderVisibility && fieldSchema.placeholderVisibility === false ? false : true;
    field.element.placeholder.value = fieldSchema.placeholderValue ? fieldSchema.placeholderValue : field.element.label.value;
    field.element.placeholder.valueExtension = fieldSchema.placeholderValueExtension ? fieldSchema.placeholderValueExtension : "";

    // required validation
    if (fieldSchema.required) {
      // add this validation at the start
      field.element.validations.unshift(getRequiredValidation(fieldSchema.requiredMessage));
    }

    // minLength Validation
    if (fieldSchema.minLength) {
      let val = getMinLengthValidation(fieldSchema.minLength, fieldSchema.minLengthMessage);
      if (!_.isEmpty(val)) {
        field.element.validations.push(val);
      }
    }

    // maxLength Validation
    if (fieldSchema.maxLength) {
      let val = getMaxLengthValidation(fieldSchema.maxLength, fieldSchema.maxLengthMessage);
      if (!_.isEmpty(val)) {
        field.element.validations.push(val);
      }
    }

    // minValue Validation
    if (fieldSchema.minValue) {
      let val = getMinValueValidation(fieldSchema.minValue, fieldSchema.minValueMessage);
      if (!_.isEmpty(val)) {
        field.element.validations.push(val);
      }
    }

    // maxValue Validation
    if (fieldSchema.maxValue) {
      let val = getMaxValueValidation(fieldSchema.maxValue, fieldSchema.maxValueMessage);
      if (!_.isEmpty(val)) {
        field.element.validations.push(val);
      }
    }

    // Add implicit validations
    implicitValidations.forEach((validation) => {
      if (!_.isEmpty(validation)) {
        // this validation is valid. add it in the desired validations
        field.element.validations.push(validation);
      }
    });

    // Add match field validation info. to be treated different than other validations
    if (fieldSchema.matchFieldId) {
      field.element.matchFieldId = fieldSchema.matchFieldId;
    }

    // Add explicit validations
    fieldSchema.validations &&
      fieldSchema.validations.forEach((val) => {
        if (val && val.type) {
          let validation = getValidation(val);
          if (!_.isEmpty(validation)) {
            // todo: check if this validation already exists in the schema.validations

            // this validation is valid. add it in the desired validations
            field.element.validations.push(validation); // other validations don't need any particular order for now
          }
        }
      });

    // keep default position if invalid position is provided
    if (fieldSchema.position && FormPossibleFieldPositions.includes(fieldSchema.position)) {
      field.element.uiConfig.position = fieldSchema.position;
    }
    if (fieldSchema.col && fieldSchema.col >= 1 && fieldSchema.col <= 12) {
      field.element.uiConfig.col = fieldSchema.col;
    }
  } else {
    // Invalid field type
    success = false;
    if (type) {
      console.log("Failed to create Field. Unsupported Type: " + type);
    } else {
      console.log("Failed to create Field. Missing Type!");
    }

    field = {};
  }

  return { success: success, field: field };
};

function getFieldStatus(state, disabledStates) {
  let status = false;
  if (state && disabledStates && Array.isArray(disabledStates) && disabledStates.includes(state)) {
    status = true;
  }
  return status;
}

export function getFormSchema(origSchema, ref, currState, fieldsData) {
  // create a copy
  let shortSchema = _.cloneDeep(origSchema);

  // assign state based title
  if (
    shortSchema &&
    shortSchema.stateTitle &&
    typeof shortSchema.stateTitle === "object" &&
    shortSchema.stateTitle.hasOwnProperty(currState)
  ) {
    shortSchema.title = shortSchema.stateTitle[currState];
  }

  if (shortSchema && shortSchema.sections && Array.isArray(shortSchema.sections)) {
    for (let j = 0; j < shortSchema.sections.length; j++) {
      let sectionSchema = shortSchema.sections[j];
      sectionSchema.accessor = sectionSchema.accessor && typeof sectionSchema.accessor === 'string' ? sectionSchema.accessor : "";
      sectionSchema.returnLabelAsKey = sectionSchema.returnLabelAsKey ? true : false;
      // interate over all fields
      if (sectionSchema.fields && Array.isArray(sectionSchema.fields)) {
        let disabledSection = getFieldStatus(currState, sectionSchema.disabledStates);
        let hiddenSection = getFieldStatus(currState, sectionSchema.hiddenStates);
    
        // extract fields
        for (let i = 0; i < sectionSchema.fields.length; i++) {
          let field = sectionSchema.fields[i];
          sectionSchema.accessor.length && (field.id = `${sectionSchema.accessor}.${field.id}`)
          let disabledField = getFieldStatus(currState, field.disabledStates);
          let hiddenField = getFieldStatus(currState, field.hiddenStates);
    
          if (field.type === "button") {
            // found buttonId
            if (field.callback && typeof field.callback === "string") {
              // callback function name is available as string
              // extract function from class reference (ref)
              let callbackFunc = null;
              if (typeof ref === "object") {
                callbackFunc = ref[field.callback];
                if (!callbackFunc || typeof callbackFunc !== "function") {
                  callbackFunc = null;
                }
              }
              field.callback = callbackFunc;
            }
          }
          else if (field.type === "select") {
            let {updatedSectionFieldsOnCertainValue} = field;
            if (updatedSectionFieldsOnCertainValue && Array.isArray(updatedSectionFieldsOnCertainValue)) {
              updatedSectionFieldsOnCertainValue = updatedSectionFieldsOnCertainValue.map(it => {
                // callback function name is available as string
                // extract function from class reference (ref)
                if (it.targetSecId && it.getSectionFieldsCallback && typeof it.targetSecId === 'string' && typeof it.getSectionFieldsCallback === 'string') {
                  let callbackFunc = null;
                  if (typeof ref === "object") {
                    callbackFunc = ref[it.getSectionFieldsCallback];
                    if (!callbackFunc || typeof callbackFunc !== "function") {
                      callbackFunc = null;
                    } else {
                      let secIndex = shortSchema.sections.findIndex(section => section.id === it.targetSecId)
                      if (secIndex !== -1) {
                        shortSchema.sections[secIndex].fields = callbackFunc(fieldsData && fieldsData[field.id] ? fieldsData[field.id] : "" );
                      }
                    }
                  }
                  
                  it.getSectionFieldsCallback = callbackFunc;
                }
                return it;
              })
              
              field.updatedSectionFieldsOnCertainValue = [...updatedSectionFieldsOnCertainValue];
            }
          }
    
          if (disabledField || disabledSection) {
            field.disabled = true;
          }
          if (hiddenField || hiddenSection) {
            field.hide = true;
          }
        }
      }
    }
  }

  // return updated schema
  return shortSchema;
}

export function getFullFormSectionSchema(sec) {
  let section = {
    returnLabelAsKey: sec.returnLabelAsKey,
    accessor: sec.accessor,
    id: sec.id ? sec.id : "unknownSectionId",
    uiConfig: sec.uiConfig ? sec.uiConfig : defaultSectionUiConfig,
  };

  let fields = [];
  
  // extract fields
  sec.fields &&
    Array.isArray(sec.fields) &&
    sec.fields.forEach((fieldSchema) => {
      let { success, field } = createCustomField(fieldSchema);
      if (success) {
        fields.push(field);
      }
    });

  section.fields = fields;

  return section;
}

export function getFullFormSchema(shortSchema) {
  let fullSchema = {
    title: "Unknown Form Title",
    id: "unknownFormId",
    uiConfig: {},
    sections: [],
    returnOnlyEnabledFields: false,
  };
  if (shortSchema) {
    fullSchema.title = shortSchema.title && shortSchema.title;
    fullSchema.id = shortSchema.id && shortSchema.id;
    fullSchema.uiConfig = shortSchema.uiConfig;
    fullSchema.returnOnlyEnabledFields = shortSchema.returnOnlyEnabledFields ? true : false;

    shortSchema.sections &&
      Array.isArray(shortSchema.sections) &&
      shortSchema.sections.forEach((sec) => {
        let section = getFullFormSectionSchema(sec);
        fullSchema.sections.push(section);
      });
  }

  // console.log(fullSchema)
  return fullSchema;
}

function evaluateShowFieldsOnCertainValue(fullSchema) {
  if (fullSchema && fullSchema.sections && Array.isArray(fullSchema.sections)) {
    for (let i = 0; i < fullSchema.sections.length; i++) {
      let fields = fullSchema.sections[i].fields;
      if (fields && Array.isArray(fields)) {
        for (let k = 0; k < fields.length; k++) {
          let { element } = fields[k];
          let { value } = element;
          let { showFieldsOnCertainValue } = element.settings.select;
          if (showFieldsOnCertainValue && showFieldsOnCertainValue.length > 0) {
            showFieldsOnCertainValue.forEach((condition) => {
              for (let z = 0; z < condition.targetIds.length; z++) {
                for (let j = 0; j < fullSchema.sections.length; j++) {
                  let index = fullSchema.sections[j].fields.findIndex((field) => field.id === condition.targetIds[z]);
                  if (index !== -1) {
                    // value exists => change "hide" to false if value matches
                    fullSchema.sections[j].fields[index].element.hide = !condition.values.includes(value);
                    fullSchema.sections[j].fields[index].element.touched = false;
                  }
                }
              }
            });
          }
        }
      }
    }
  }
  return fullSchema;
}

export function loadForm(formSchema, currState, fieldsData, mode, parentRef) {
  let formShortSchema = getFormSchema(formSchema, parentRef, currState, fieldsData);
  let formFullSchema = getFullFormSchema(formShortSchema);
  if (fieldsData && fieldsData.constructor === Object) {
    for (let j = 0; j < formFullSchema.sections.length; j++) {
      let {returnLabelAsKey, accessor} = formFullSchema.sections[j];

      for (let i = 0; i < formFullSchema.sections[j].fields.length; i++) {
        const field = formFullSchema.sections[j].fields[i];
        let label = field.element.label.value;
        let key = returnLabelAsKey ? (accessor.length ? `${accessor}.${label}` : label) : field.id;
        if (key in fieldsData) {
          if (field.element.type === "date" || field.element.type === "dateTime") {
            formFullSchema.sections[j].fields[i].element.value = new Date(fieldsData[key]);
          } else if (field.element.type === "multiSelect") {
            let values = fieldsData[key];
            let selectedValues = [];
            if (values && Array.isArray(values)) {
              field.element.settings.options.forEach((option) => {
                if (values.includes(option.value)) {
                  selectedValues.push(option);
                }
              });
            }
            formFullSchema.sections[j].fields[i].element.value = selectedValues;
          }
          else if (field.element.type === "createableSelect") {
            let values = fieldsData[field.id];
            let selectedValues = [];
            if (values && Array.isArray(values)) {
              selectedValues = convertToCreateableSelectOptions(values);
            }
            formFullSchema.sections[j].fields[i].element.value = selectedValues;
          } 
          else {
            formFullSchema.sections[j].fields[i].element.value = fieldsData[key];
          }
        }
      }
    }
  }
  return evaluateShowFieldsOnCertainValue(formFullSchema);
}

export function updateShortSchema(schema, changeData) {
  let shortSchema = _.cloneDeep(schema);
  if (changeData && shortSchema && shortSchema.sections && Array.isArray(shortSchema.sections)) {
    for (let i = 0; i < shortSchema.sections.length; i++) {
      if (shortSchema.sections[i].fields && Array.isArray(shortSchema.sections[i].fields)) {
        for (let j = 0; j < shortSchema.sections[i].fields.length; j++) {
          let id = shortSchema.sections[i].fields[j].id && shortSchema.sections[i].fields[j].id;
          if (id && changeData.hasOwnProperty(id)) {
            _.merge(shortSchema.sections[i].fields[j], changeData[id]);
          }
        }
      }
    }
  }
  return shortSchema;
}
