/* eslint eqeqeq: 0 */
import InputTextFieldNormal from "components/Common/InputTextFieldNormal";
import "components/Common/commonform.css";
import { Label } from "components/Common/Forms/formsMiscItems";
import SelectField from "components/Common/SelectOption";
import React, { Component } from "react";

class AssetTypeFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forms: {},
    };

    this.handleChangeFormValue = this.handleChangeFormValue.bind(this);
  }

  handleChangeFormValue(assetTypeFields) {
    let name = "assetTypeFields" + this.props.selectedAssetType;

    //     this.setState({
    //  assetTypeFields: assetTypeFields
    //     })
  }

  componentDidMount() {
    if (this.props.assetTypeAttributes && this.props.selectedAssetType) {
      this.setFormModel();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedAssetType !== prevProps.selectedAssetType && this.props.selectedAssetType) {
      this.setFormModel();
    } else {
      if (this.props.selectedTab !== prevProps.selectedTab && this.props.selectedTab) {
        this.setAssetTypes();
      }
    }
    if (
      this.state["assetTypeFields" + this.props.selectedAssetType] &&
      this.state["assetTypeFields" + this.props.selectedAssetType] !== prevState["assetTypeFields" + this.props.selectedAssetType]
    ) {
      this.setAssetTypes();
    }
  }
  setFormModel() {
    let name = "assetTypeFields" + this.props.selectedAssetType;
    this.setState({
      [name]: this.props.initialState,
    });
  }

  setForm(inputFields) {
    let form = null;
    let name = "assetTypeFields" + this.props.selectedAssetType + "form";
    // if (!this.state['assetTypeFields' + this.props.selectedAssetType + 'form']) {
    form = (
      // <LocalForm
      //   className={this.props.classNameCss}
      //   model={'assetTypeFields' + this.props.selectedAssetType}
      //   validators={this.props.validatorForm}
      //   onChange={values => {
      //     this.handleChangeFormValue(values)
      //   }}
      //   onSubmit={values => this.props.handleSubmitForm(values)}
      //   initialState={this.props.initialState}
      // >
      //   {inputFields}
      // </LocalForm>
      <div className="commonform"> {inputFields}</div>
    );
    this.setState({
      [name]: form,
    });
    // }
  }

  setAssetTypes() {
    let name = "assetTypeFields" + this.props.selectedAssetType;
    let assetTypeFieldsValues = this.props.initialState;
    let inputComps = this.props.assetTypeAttributes.map((fieldObj, index) => {
      if (fieldObj.category == this.props.selectedTab || (!fieldObj.category && this.props.selectedTab == "Other")) {
        if (fieldObj.type == "string") {
          //     console.log(assetTypeFieldsValues[fieldObj.name])
          return (
            <InputTextFieldNormal
              key={fieldObj.name}
              label={fieldObj.name}
              defaultValue={assetTypeFieldsValues[fieldObj.name]}
              // requiredField={fieldObj.required}
              //  fieldModel={this.props.formModel + this.props.selectedAssetType + '.' + fieldObj.name}
              // errorMessage={'Please Enter ' + fieldObj.name}
              onChange={this.props.handleInputChange}
              name={fieldObj.name}
            />
          );
        } else if (fieldObj.type == "array") {
          return (
            // <InputSelectOptionField
            //   key={fieldObj.name}
            //   textLabel={fieldObj.name}
            //   requiredField={fieldObj.required}
            //   fieldModel={this.props.formModel + this.props.selectedAssetType + '.' + fieldObj.name}
            //   optionFields={fieldObj.values}
            //   handleInputChange={this.props.handleInputChange}
            //   name={fieldObj.name}
            // />
            <div key={fieldObj.name}>
              <Label> {fieldObj.name} </Label>
              <SelectField
                name={fieldObj.name}
                options={fieldObj.values}
                selected={this.props.initialState[fieldObj.name]}
                onChange={this.props.handleInputSelectChange}
              />
            </div>
          );
        }
      } else {
        return null;
      }
    });
    this.setForm(inputComps);
  }

  render() {
    let form = null;
    let formModel = this.state["assetTypeFields" + this.props.selectedAssetType + "form"];
    if (formModel) {
      form = formModel;
    }
    return form;
  }
}

export default AssetTypeFields;
