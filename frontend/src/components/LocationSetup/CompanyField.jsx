import React, { Component } from "react";
import { Col, Row, Tooltip } from "reactstrap";
import FormFields from "../../wigets/forms/formFields";
import _ from "lodash";
import SvgIcon from "react-icons-kit";
import { floppyDisk } from "react-icons-kit/icomoon/floppyDisk";
import { themeService } from "../../theme/service/activeTheme.service";
import { locationListStyle } from "./LocationListStyle";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import { languageService } from "../../Language/language.service";
export default class CompanyField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: "",
      showSaveButton: false,
      tooltip: false,
    };
    this.companyField = _.cloneDeep(companyField);
    this.updateFields = this.updateFields.bind(this);
  }

  updateFields(newForm) {
    this.companyField = newForm.companyField;
    this.setState({
      company: newForm.companyField.company.value,
      showSaveButton: newForm.companyField.company.value !== this.props.companyAsset.unitId,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.companyAsset !== prevProps.companyAsset) {
      this.setState({
        company: this.props.companyAsset.unitId,
      });
      this.companyField.company.value = this.props.companyAsset.unitId;
      //    this.companyField.company.labelText = this.props.companyAsset.assetType;
    }
  }

  render() {
    return (
      <Row>
        <Col md={6}>
          <FormFields companyField={this.companyField} fieldTitle={"companyField"} change={this.updateFields} />
        </Col>
        <Col md={1}>
          {
            //this.state.showSaveButton && (
            <React.Fragment>
              <span
                id={"save-company"}
                style={{
                  ...themeService(locationListStyle.saveInputIcon),
                  color: retroColors.second,
                  padding: "0px",
                  display: !this.state.showSaveButton ? "none" : "inline-block",
                }}
                onClick={(e) => {
                  this.setState({ showSaveButton: false });
                  this.props.handleSaveField(this.state.company);
                }}
              >
                <SvgIcon icon={floppyDisk} size="30" style={{ verticalAlign: "middle" }} />
              </span>
              <Tooltip isOpen={this.state.tooltip} target={"save-company"} toggle={() => this.setState({ tooltip: !this.state.tooltip })}>
                {languageService("Save")}
              </Tooltip>
            </React.Fragment>
            //)
          }
        </Col>
      </Row>
    );
  }
}

const companyField = {
  company: {
    element: "input",
    value: "",
    label: true,
    labelText: languageService("Company"),
    containerConfig: {},
    config: {
      name: "company",
      type: "text",
      placeholder: "",
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    validationMessage: "",
  },
};
