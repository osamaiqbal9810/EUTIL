import React from "react";
import AddNewInputField from "../../LocationSetup/AddNewInputField";
import { AddNewField } from "../../LocationSetup/LocationList";
import { cross } from "react-icons-kit/icomoon/cross";
import Icon from "react-icons-kit";
export const AppFormProperties = (props) => {
  return (
    <React.Fragment>
      <div className="app-form-properties-header">
        <h5>Form Field Properties</h5>
      </div>
      <div className="app-form-props">
        <div>
          <AppFormFieldPropertiesList selectedField={props.selectedField} inputProps={{ onChange: props.onFieldPropertyChange }} />
        </div>
      </div>
      <div className="app-form-props">
        <div className="app-form-properties-header">
          <h5>App Form Properties</h5>
        </div>
        <div>
          <AppFormPropertiesList selectedAppForm={props.selectedAppForm} inputProps={{ onChange: props.onAppFormPropertyChange }} />
        </div>
      </div>
    </React.Fragment>
  );
};

const AppFormPropertiesList = (props) => {
  let fieldPropKeys = props.selectedAppForm ? Object.keys(props.selectedAppForm) : [];
  let fieldsProps = fieldPropKeys.map((propFieldKey) => {
    return RenderFieldTypeProps(propFieldKey, props.selectedAppForm[propFieldKey], props.inputProps);
  });
  return <div className="app-form-field-group">{fieldsProps}</div>;
};
const AppFormFieldPropertiesList = (props) => {
  let fieldPropKeys = props.selectedField ? Object.keys(props.selectedField) : [];
  let fieldsProps = fieldPropKeys.map((propFieldKey) => {
    return RenderFieldTypeProps(propFieldKey, props.selectedField[propFieldKey], props.inputProps);
  });
  return <div>{fieldsProps}</div>;
};

const RenderFieldTypeProps = (propName, propValue, inputProps) => {
  let fields = {
    id: <RenderInputField key={propName} propName={propName} propValue={propValue} inputProps={inputProps} />,
    fieldName: <RenderInputField key={propName} propName={propName} propValue={propValue} inputProps={inputProps} />,
    enabled: <RenderInputField key={propName} type={"checkbox"} propName={propName} propValue={propValue} inputProps={inputProps} />,
    options: <RenderOptionsInputField key={propName} propName={propName} propValue={propValue} inputProps={inputProps} />,
    tag: <RenderInputField key={propName} propName={propName} propValue={propValue} inputProps={inputProps} />,
    code: <RenderInputField key={propName} propName={propName} propValue={propValue} inputProps={inputProps} />,
    description: <RenderInputField key={propName} propName={propName} propValue={propValue} inputProps={inputProps} />,
    opt2: <HandleAppFormOpt2 key={propName} propName={propName} propValue={propValue} inputProps={inputProps} />,
    classify: <RenderInputField key={propName} propName={propName} propValue={propValue} inputProps={inputProps} />,
    allowedInstruction: <RenderOptionsInputField key={propName} propName={propName} propValue={propValue} inputProps={inputProps} />,
    restrictAssetTypes: <RenderOptionsInputField key={propName} propName={propName} propValue={propValue} inputProps={inputProps} />,
    allowedAssetTypes: <RenderOptionsInputField key={propName} propName={propName} propValue={propValue} inputProps={inputProps} />,
  };
  let fieldToRet = fields[propName] ? fields[propName] : null;
  return fieldToRet;
};

export const RenderInputField = (props) => {
  return (
    <div className="field">
      <div className={props.mainClass ? props.mainClass : "field-style"}>
        {!props.labelBottom && (
          <Label labelProps={props.labelProps} labelClassName={props.labelClassName} propName={props.propName} label={props.label} />
        )}
        <input
          type={props.type ? props.type : "text"}
          name={props.propName}
          value={props.propValue}
          onChange={props.onInputChange}
          disabled={props.disabled}
          className="input-style"
          id={props.propName}
          {...props.inputProps}
        />
        {props.labelBottom && (
          <Label labelProps={props.labelProps} labelClassName={props.labelClassName} propName={props.propName} label={props.label} />
        )}
      </div>
    </div>
  );
};

class RenderOptionsInputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newInputField: false,
    };
    this.handleAddNewLocation = this.handleAddNewLocation.bind(this);
    this.handleSaveField = this.handleSaveField.bind(this);
  }
  handleAddNewLocation(input) {
    this.setState({ newInputField: input });
  }
  handleSaveField(val) {
    if (val) {
      let propValue = [...this.props.propValue];
      propValue.push(val);
      this.props.inputProps.onChange({ target: { value: propValue, name: this.props.propName } });
      this.handleAddNewLocation("");
    }
  }
  render() {
    return (
      <div>
        {!this.props.labelBottom && (
          <Label
            labelProps={this.props.labelProps}
            labelClassName={this.props.labelClassName}
            propName={this.props.propName}
            label={this.props.label}
          />
        )}
        {!this.state.newInputField && (
          <span className="add-new-field">
            <AddNewField locationType={{ _id: this.props.propName }} handleAddNewLocation={this.handleAddNewLocation} />
          </span>
        )}
        <ListItems
          list={this.props.propValue}
          removeAction={(value) => {
            let vals = this.props.propValue && this.props.propValue.filter((arrVal) => arrVal !== value);
            this.props.inputProps.onChange({
              target: { value: vals, name: this.props.propName },
            });
          }}
        />
        {this.state.newInputField && (
          <AddNewInputField handleAddNewLocation={this.handleAddNewLocation} handleSaveField={this.handleSaveField} />
        )}

        {this.props.labelBottom && (
          <Label
            labelProps={this.props.labelProps}
            labelClassName={this.props.labelClassName}
            propName={this.props.propName}
            label={this.props.label}
          />
        )}
      </div>
    );
  }
}
const Label = (props) => {
  return (
    <label className={props.labelClassName ? props.labelClassName : "lbl-style"} {...props.labelProps}>
      {props.label ? props.label : props.propName}
    </label>
  );
};

const ListItems = (props) => {
  let lItems =
    props.list &&
    props.list.map((value, index) => {
      return (
        <li key={value + index}>
          {value}
          <span
            className="customerAction"
            style={{ color: "#840f0f" }}
            onClick={(e) => {
              props.removeAction(value);
            }}
          >
            <Icon style={{ verticalAlign: "middle" }} icon={cross} size="15" />
          </span>
        </li>
      );
    });
  return <ul className="list-of-options">{lItems}</ul>;
};
class HandleAppFormOpt2 extends React.Component {
  constructor(props) {
    super(props);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onOptionsFieldsChange = this.onOptionsFieldsChange.bind(this);
  }
  onFieldChange(e, fName) {
    let opt2 = { ...this.props.propValue };
    opt2[fName] = e.target.value;
    this.props.inputProps.onChange({ target: { name: "opt2", value: opt2 } });
  }
  onOptionsFieldsChange(e) {
    let opt2 = { ...this.props.propValue };
    opt2[e.target.name] = e.target.value;
    this.props.inputProps.onChange({ target: { name: "opt2", value: opt2 } });
  }
  render() {
    return (
      <div className="render-field-type-props">
        {RenderFieldTypeProps("classify", this.props.propValue.classify, {
          onChange: (e) => this.onFieldChange(e),
        })}
        {RenderFieldTypeProps("allowedInstruction", this.props.propValue.allowedInstruction, {
          onChange: (e) => this.onOptionsFieldsChange(e),
        })}
        {RenderFieldTypeProps("restrictAssetTypes", this.props.propValue.restrictAssetTypes, {
          onChange: (e) => this.onOptionsFieldsChange(e),
        })}
        {RenderFieldTypeProps("allowedAssetTypes", this.props.propValue.allowedAssetTypes, {
          onChange: (e) => this.onOptionsFieldsChange(e),
        })}
      </div>
    );
  }
}
