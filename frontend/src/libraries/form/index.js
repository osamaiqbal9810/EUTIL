import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ToastService } from "../../utils/toastify";
import { loadForm } from "./schemaInterpreter";
import { getDefaultValue } from "./supportedFields";
import FormField from "./formField/index";
import "./formField/style.css";
import { checkAllValidations } from "./validations";
import _ from "lodash";
import { Row } from "reactstrap";

class CustomForm extends React.Component {
  constructor(props) {
    super(props);

    // add default values in the form
    this.touchRequiredFieldsAndValidateAllFields = this.touchRequiredFieldsAndValidateAllFields.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.prepareFormSummary = this.prepareFormSummary.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.showHideFields = this.showHideFields.bind(this);
    this.evaluateAndShowFieldsOnCertainValues = this.evaluateAndShowFieldsOnCertainValues.bind(this);
    this.onFormSubmission = this.onFormSubmission.bind();
    this.onEnterPressed = this.onEnterPressed.bind();
    this.renderSections = this.renderSections.bind(this);
    this.renderField = this.renderField.bind(this);
    this.toggle = this.toggle.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.printForm = this.printForm.bind(this);
    this.updateFormSchema = this.updateFormSchema.bind(this);

    this.state = {
      formFullSchema: null,
      formShortSchema: null,
      modal: false,
      parentRef: {},
      currState: null,
      fieldsData: null,
      mode: "inline",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    let schemaChanged = this.props.formSchema !== prevProps.formSchema;
    let stateChanged = this.props.currState !== prevProps.currState;
    let dataChanged = this.props.fieldsData !== prevProps.fieldsData;
    let modeChanged = this.props.mode !== prevProps.mode;
    let { formSchema, currState, fieldsData, mode, parentRef } = this.props;
    if (schemaChanged || stateChanged || modeChanged || dataChanged) {
      let formFullSchema = loadForm(formSchema, currState, fieldsData, mode, parentRef);
      this.setState({
        formShortSchema: { ...this.props.formSchema },
        formFullSchema: _.cloneDeep(formFullSchema),
        modal: this.props.formSchema && this.props.mode === "dialog",
        parentRef: this.props.parentRef ? this.props.parentRef : {},
        currState: currState,
        fieldsData: fieldsData,
        mode: mode,
      });
    }

    // todo: keep existing form
  }

  componentDidMount() {
    let { formSchema, currState, fieldsData, mode, parentRef } = this.props;
    let formFullSchema = loadForm(formSchema, currState, fieldsData, mode, parentRef);
    this.setState({
      formShortSchema: { ...this.props.formSchema },
      formFullSchema: formFullSchema,
      modal: this.props.formSchema && this.props.mode === "dialog",
      parentRef: this.props.parentRef ? this.props.parentRef : {},
      currState: currState,
      fieldsData: fieldsData,
      mode: mode,
    });
  }

  updateFormSchema(newShortSchema, prevFullSchema) {
    let tempSummary = this.prepareFormSummary(prevFullSchema);
    let { currState, mode, parentRef } = this.state;
    let formFullSchema = loadForm(newShortSchema, currState, tempSummary.fields, mode, parentRef);
    // todo: updated from prevFullSchema
    this.setState({
      formShortSchema: newShortSchema,
    });
    return formFullSchema;
  }

  // prepare for summary on submission
  // compile all fields
  prepareFormSummary = (formFullSchema) => {
    let summary = {};
    summary["id"] = formFullSchema.id;
    summary["fields"] = {};
    summary["files"] = [];
    let { sections, returnOnlyEnabledFields } = formFullSchema;
    sections.forEach((section_item) => {
      let { accessor } = section_item;
      section_item.fields.forEach((field_item) => {
        const { id, element } = field_item;
        let label = element.label.value;
        let key = section_item.returnLabelAsKey ? (accessor.length ? `${accessor}.${label}` : label) : id;
        if (element.type !== "button" && !element.hide) {
          if (!returnOnlyEnabledFields || (returnOnlyEnabledFields && !element.disabled)) {
            if (element.type === "multiSelect" || element.type === "createableSelect") {
              let values = [];
              element.value &&
                Array.isArray(element.value) &&
                element.value.forEach((value) => {
                  values.push(value.value);
                });
              summary["fields"][key] = values;
            } else if (element.type === "file") {
              if (element.value) {
                let name = element.value.name;
                if (element.value.url) {
                  // use url 
                  summary["fields"][key] = { name: name ? name : element.value.url, url: element.value.url };  
                }
                else if (element.value['url-rel']){
                  summary["fields"][key] = { name: name ? name : element.value["url-rel"], "url-rel": element.value["url-rel"] };
                  if (element.value.file) {
                    summary.files.push(element.value);
                  }
                }
              }
              else {
                summary["fields"][key] = '';  
              }
            } else {
              summary["fields"][key] = element.value;
            }
          }
        }
      });
    });
    return summary;
  };

  // returns
  // valid (boolean): whether all fields are valid or not
  // valid (boolean): whether all fields were already touched or not
  touchRequiredFieldsAndValidateAllFields = () => {
    let alreadyTouched = true; // by default, all fields in this foem are touched
    let valid = true; // by default, this form is valid
    let touchedSchema = _.cloneDeep(this.state.formFullSchema);
    let alertMessage = "Following fields are invalidated\n";
    let fieldMisMatchValFailed = false;
    for (let j = 0; j < this.state.formFullSchema.sections.length; j++) {
      for (let i = 0; i < this.state.formFullSchema.sections[j].fields.length; i++) {
        const { hide, type } = touchedSchema.sections[j].fields[i].element;
        if (hide) {
          continue; // skip this field's validation
        }

        const { touched, validations, value, matchFieldId } = touchedSchema.sections[j].fields[i].element;
        // is this field required?
        let required = validations.findIndex((val) => val.type === "required") !== -1;
        if (required) {
          // this field is required
          if (!touched) {
            // this field was never touched
            // do this only for fields which weren't touched
            // touch this required field
            // this will trigger the validation for this field in the form
            touchedSchema.sections[j].fields[i].element.touched = true;
            alreadyTouched = false;
          }

          // check all validations for this field
          let { fieldValid, validationMessage } = checkAllValidations(validations, value, type);

          if (fieldValid && matchFieldId) {
            // check match validation
            let targetFieldIndex = touchedSchema.sections[j].fields.findIndex((field) => field.id === matchFieldId);
            if (targetFieldIndex !== -1) {
              // found target field
              if (touchedSchema.sections[j].fields[targetFieldIndex].element.value !== value) {
                fieldMisMatchValFailed = true;
                // value mismatch
                fieldValid = false;
                validationMessage =
                  "This field must match with the " + touchedSchema.sections[j].fields[targetFieldIndex].element.label.value;
              }
            }
          }
          touchedSchema.sections[j].fields[i].element.valid = fieldValid;
          touchedSchema.sections[j].fields[i].element.validationMessage = validationMessage;
        } else {
          let { fieldValid, validationMessage } = checkAllValidations(validations, value, type);
          touchedSchema.sections[j].fields[i].element.valid = fieldValid;
          touchedSchema.sections[j].fields[i].element.validationMessage = validationMessage;
        }

        if (!touchedSchema.sections[j].fields[i].element.valid) {
          // this field is invalid, set this form to invalid
          valid = false;

          let { label, validationMessage } = touchedSchema.sections[j].fields[i].element;
          alertMessage += label.value + " " + label.valueExtension + ": " + validationMessage + "\n";
        }
      }
    }

    if (!alreadyTouched || fieldMisMatchValFailed) {
      // update schema
      this.setState({
        formFullSchema: touchedSchema,
      });
    }

    return { valid: valid, alertMessage: alertMessage };
  };

  resetFields = (resetAll, resetFieldIds) => {
    let updatedSchema = _.cloneDeep(this.state.formFullSchema);
    for (let j = 0; j < updatedSchema.sections.length; j++) {
      for (let i = 0; i < updatedSchema.sections[j].fields.length; i++) {
        if (updatedSchema.sections[j].fields[i].element.type !== "button") {
          if (resetAll || (Array.isArray(resetFieldIds) && resetFieldIds.includes(updatedSchema.sections[j].fields[i].id))) {
            // reset non-button fields
            // todo: do i need to add another settings parameter to use instead of checking for non-button field
            // untouch these fields
            // mark these fields as valid by default
            updatedSchema.sections[j].fields[i].element.value = getDefaultValue(updatedSchema.sections[j].fields[i].type);
            updatedSchema.sections[j].fields[i].element.valid = true;
            updatedSchema.sections[j].fields[i].element.touched = false;
          }
        }
      }
    }

    // update schema
    this.setState({
      formFullSchema: updatedSchema,
    });
  };

  showHideFields = (showFieldIds, hideFieldIds) => {
    let updatedSchema = _.cloneDeep(this.state.formFullSchema);
    for (let j = 0; j < updatedSchema.sections.length; j++) {
      for (let i = 0; i < updatedSchema.sections[j].fields.length; i++) {
        if (Array.isArray(showFieldIds) && showFieldIds.includes(updatedSchema.sections[j].fields[i].id)) {
          // hide/show non-button fields
          // untouch these fields
          // mark these fields as valid by default
          updatedSchema.sections[j].fields[i].element.value = getDefaultValue(updatedSchema.sections[j].fields[i].type);
          updatedSchema.sections[j].fields[i].element.valid = true;
          updatedSchema.sections[j].fields[i].element.touched = false;
          updatedSchema.sections[j].fields[i].element.hide = false;
        } else if (Array.isArray(hideFieldIds) && hideFieldIds.includes(updatedSchema.sections[j].fields[i].id)) {
          // hide/show non-button fields
          // untouch these fields
          // mark these fields as valid by default
          updatedSchema.sections[j].fields[i].element.value = getDefaultValue(updatedSchema.sections[j].fields[i].type);
          updatedSchema.sections[j].fields[i].element.valid = true;
          updatedSchema.sections[j].fields[i].element.touched = false;
          updatedSchema.sections[j].fields[i].element.hide = true;
        }
      }
    }

    // update schema
    this.setState({
      formFullSchema: updatedSchema,
    });
  };

  onFormSubmission = (callback) => {
    const { valid, alertMessage } = this.touchRequiredFieldsAndValidateAllFields();
    if (!valid) {
      // ToastService.Error("Retry", alertMessage);
    } else {
      // alert("Form is valid!")
      if (callback) {
        let summary = this.prepareFormSummary(this.state.formFullSchema);
        // console.log(summary);
        callback(summary);
      }
      // todo: do i need to close this dialog on submission?
      // this.closeDialog();
    }
    // todo: touch all fields
    // if all required fields are not touched yet, touch them and fail the validations
    // apply validation on value change
    // return validation status of each field in return on value change
    // callback if any registered
  };
  onClick = (buttonId) => {
    for (let j = 0; j < this.state.formFullSchema.sections.length; j++) {
      let index = this.state.formFullSchema.sections[j].fields.findIndex(
        (field) => field.id === buttonId && field.element.type === "button",
      );

      if (index !== -1) {
        // found a valid id (for this button click)
        let field = this.state.formFullSchema.sections[j].fields[index];
        const { type } = field.element;
        const { action, callback, resetFieldIds, showFieldIds, hideFieldIds } = field.element.settings[type];
        switch (action) {
          case "submit": // all fields need to be validated for before submitting the form
            this.onFormSubmission(callback);
            break;
          case "resetCustom":
            // reset custom defined fields
            this.resetFields(false, resetFieldIds);

            break;
          case "resetAll":
            // reset all fields in the form
            // todo: what to do when forms are rendered in heirarchy??
            this.resetFields(true, []);

            break;
          case "showHideFields":
            this.showHideFields(showFieldIds, hideFieldIds);
            break;
          case "simple":
            // callback if any registered
            if (callback) {
              callback();
            }
            break;
          case "cancel":
            this.closeDialog();
            break;
          case "print":
            this.printForm();
            break;

          default:
            break;
        }

        break; // break the loop
      }
    }
  };

  evaluateAndShowFieldsOnCertainValues = (value, conditions) => {};

  onEnterPressed = (e) => {
    let buttonFound = false;
    for (let j = 0; j < this.state.formFullSchema.sections.length; j++) {
      for (let i = 0; i < this.state.formFullSchema.sections[j].fields.length; i++) {
        const { type, disabled, hide, settings } = this.state.formFullSchema.sections[j].fields[i].element;
        if (!disabled && !hide && type === "button") {
          const { action, callback } = settings[type];
          if (action === "submit") {
            // call this funcion submit
            this.onFormSubmission(callback);
            break;
          }
        }
      }
      if (buttonFound) break;
    }
  };

  onValueChange = (id, value, blur, valid, validationMessage) => {
    let { parentRef, formShortSchema, formFullSchema } = this.state;
    let newShortSchema = { ...formShortSchema };
    for (let j = 0; j < formFullSchema.sections.length; j++) {
      let index = formFullSchema.sections[j].fields.findIndex((field) => field.id === id);

      if (index !== -1) {
        let updatedElement = formFullSchema.sections[j].fields[index].element;
        let { type } = updatedElement;
        updatedElement.value = value; // update the value
        updatedElement.valid = valid; // update the validity
        updatedElement.validationMessage = validationMessage; // update the validation message

        if (!updatedElement.touched && blur) {
          // touch this field if it was not touched before and its blurred now
          updatedElement.touched = true; // blur means its now touched
        }

        // todo; Resolve this
        let updatedSchema = _.cloneDeep(formFullSchema);
        updatedSchema.sections[j].fields[index].element = updatedElement;

        // following code is just for "select"
        let { showFieldsOnCertainValue, updatedSectionFieldsOnCertainValue } = updatedElement.settings.select;
        if (showFieldsOnCertainValue && showFieldsOnCertainValue.length > 0) {
          showFieldsOnCertainValue.forEach((condition) => {
            for (let z = 0; z < condition.targetIds.length; z++) {
              for (let j = 0; j < updatedSchema.sections.length; j++) {
                let index = updatedSchema.sections[j].fields.findIndex((field) => field.id === condition.targetIds[z]);
                if (index !== -1) {
                  // value exists => change "hide" to false if value matches
                  updatedSchema.sections[j].fields[index].element.hide = !condition.values.includes(value);
                  updatedSchema.sections[j].fields[index].element.touched = false;
                }
              }
            }
          });
        }
        if (updatedSectionFieldsOnCertainValue && updatedSectionFieldsOnCertainValue.length > 0) {
          let updateRequired = false;
          updatedSectionFieldsOnCertainValue.forEach((sec) => {
            if (sec.targetSecId && sec.getSectionFieldsCallback) {
              let secIndex = newShortSchema.sections.findIndex((section) => section.id === sec.targetSecId);
              if (secIndex !== -1) {
                newShortSchema.sections[secIndex].fields = sec.getSectionFieldsCallback(value);
                updateRequired = true;
              }
            }
          });
          if (updateRequired) {
            updatedSchema = this.updateFormSchema(newShortSchema, updatedSchema); //, prevFullSchema));
          }
        }

        this.setState((prevState) => ({
          formFullSchema: updatedSchema,
        }));

        break; // break the loop
      }
    }
  };

  renderField(item, section_id) {
    return (
      <FormField
        key={section_id + item.id}
        field={item}
        formId={this.state.formFullSchema.id}
        change={this.onValueChange}
        onClick={this.onClick}
        onEnterPressed={this.onEnterPressed}
      />
    );
  }

  renderSections(position) {
    return this.state.formFullSchema.sections.map((section, section_index) => {
      let renderReq = false;
      let renderedSection = (
        <Row className={`${section.uiConfig.class}`} key={section.id}>
          {section.fields.map((field, index) => {
            if (field.element.uiConfig.position === position) {
              renderReq = true;
              return this.renderField(field, section.id);
            }
          })}
        </Row>
      );
      if (renderReq) {
        return renderedSection;
      }
    });
  }

  closeDialog() {
    if (this.props.mode === "dialog") {
      this.props.closeDialog() && this.props.closeDialog();
    }
  }

  toggle = () => this.setState((prevState, props) => ({ modal: !prevState.modal }));

  printForm() {
    window.print();
  }
  render() {
    if (this.props.formSchema && this.state.formFullSchema) {
      if (this.props.mode === "dialog") {
        return (
          <div id={this.state.formFullSchema.id} className={"respondToAlertForm"}>
            <Modal
              className={`custom-form ${this.state.formFullSchema.id}`}
              isOpen={this.state.modal}
              toggle={this.closeDialog}
              centered={true}
              backdrop="static"
              keyboard={false}
            >
              <ModalHeader>{this.state.formFullSchema.title}</ModalHeader>
              <ModalBody>
                <div className={"common-form " + this.state.formFullSchema.id}>{this.renderSections("body")}</div>
              </ModalBody>
              <ModalFooter className="d-print-none">
                <React.Fragment>{this.renderSections("footer")}</React.Fragment>
              </ModalFooter>
            </Modal>
          </div>
        );
      } else if (this.props.mode === "inline") {
        return (
          <div className={"common-form " + this.state.formFullSchema.id}>
            <h4 className="form-title">{this.state.formFullSchema.title}</h4>
            {this.renderSections("body")}
            {this.renderSections("footer")}
          </div>
        );
      } else {
        return <div>Nothing to render here</div>;
      }
    } else {
      return null;
    }
  }
}

export default CustomForm;
