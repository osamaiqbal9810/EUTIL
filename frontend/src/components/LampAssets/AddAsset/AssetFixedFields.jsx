/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import InputTextField from "components/Common/Forms/InputTextField";
import InputSelectOptionField from "components/Common/Forms/InputSelectOptionField";
import { Row, Col } from "reactstrap";
import "components/Common/commonform.css";
import { LocalForm } from "react-redux-form";
import { Label } from "components/Common/Forms/formsMiscItems";
import { languageService } from "Language/language.service";

class AssetFixedFields extends Component {
  render() {
    return (
      <LocalForm
        className={this.props.classNameCss}
        model={this.props.formModel}
        validators={this.props.validatorForm}
        onChange={values => this.props.handleChangeFormValue(values)}
        onSubmit={values => this.props.handleSubmitForm(values)}
        initialState={this.props.initialState}
      >
        {/*<InputSelectOptionField*/}
          {/*textLabel={languageService("Subdivision")}*/}
          {/*requiredField*/}
          {/*fieldModel={this.props.formModel + "." + "subdivision"}*/}
          {/*optionFields={this.props.subdivisionList}*/}
        {/*/>*/}
        {this.props.modalState !== "Edit" && (
          <InputSelectOptionField
            textLabel={languageService("Asset Type")}
            requiredField
            fieldModel={this.props.formModel + "." + "assetType"}
            optionFields={this.props.assetTypeList}
          />
        )}
        {this.props.modalState == "Edit" && (
          <InputTextField
            textLabel={languageService("Asset Type")}
            requiredField
            fieldModel={this.props.formModel + "." + "assetType"}
            disabled={this.props.modalState == "Edit" ? true : false}
            fieldPlaceHolder={languageService("Asset Type")}
            errorMessage="No Asset Type"
          />
        )}
        <InputTextField
          textLabel={languageService("Asset Id")}
          requiredField
          fieldModel={this.props.formModel + "." + "unitId"}
          disabled={this.props.modalState == "Edit" ? true : false}
          fieldPlaceHolder={languageService("Asset Id")}
          errorMessage="Please Enter Asset Id"
        />
        <InputTextField
          textLabel={languageService("Description")}
          fieldModel={this.props.formModel + "." + "description"}
          fieldPlaceHolder="Description"
        />
        <Row style={{ margin: "0px" }}>
          <Label>{languageService("Location Latitude")} :</Label>
        </Row>
        <Row>
          <Col md="6">
            <InputTextField fieldModel={this.props.formModel + "." + "latStart"} fieldPlaceHolder="Start" />
          </Col>
          <Col md="6">
            <InputTextField fieldModel={this.props.formModel + "." + "latEnd"} fieldPlaceHolder="End" />
          </Col>
        </Row>
        <Row style={{ margin: "0px" }}>
          <Label>{languageService("Location Longitude")} :</Label>
        </Row>
        <Row>
          <Col md="6">
            <InputTextField
              fieldModel={this.props.formModel + "." + "lonStart"}
              fieldPlaceHolder="Start"
              errorMessage="Please Enter Milepost Start"
            />
          </Col>
          <Col md="6">
            <InputTextField
              fieldModel={this.props.formModel + "." + "lonEnd"}
              fieldPlaceHolder="End"
              errorMessage="Please Enter Milepost End"
            />
          </Col>
        </Row>
        <Row style={{ margin: "0px" }}>
          <Label>Milepost:</Label>
        </Row>
        <Row>
          <Col md="6">
            <InputTextField fieldModel={this.props.formModel + "." + "start"} fieldPlaceHolder="Start" />
          </Col>
          <Col md="6">
            <InputTextField fieldModel={this.props.formModel + "." + "end"} fieldPlaceHolder="End" />
          </Col>
        </Row>
      </LocalForm>
    );
  }
}

export default AssetFixedFields;
