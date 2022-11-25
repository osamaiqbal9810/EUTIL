import React from "react";
import _ from "lodash";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { switchReportStyle } from "./style/index";
import { formFeildStyle } from "../../../wigets/forms/style/formFields";
import { iconToShow, iconTwoShow } from "../variables";
import { languageService } from "Language/language.service";
import { ButtonActionsTable } from "components/Common/Buttons";
const InputObj = {
  testType: "All",
  asset: "All",
  unitId: "All",
};
class AssetTypesSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetTypes: [],
      appForms: [],
      assets: [],
      InputObj: { ...InputObj },
    };
    this.changeHandler = this.changeHandler.bind(this);
  }
  componentDidMount() {
    this.props.reportId && this.props.getJourneyPlan(this.props.reportId);
    this.props.getAssetTypes();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      !this.state.staticMode &&
      this.props.journeyPlan &&
      prevProps.journeyPlanActionType !== this.props.journeyPlanActionType &&
      this.props.journeyPlanActionType == "JOURNEYPLAN_READ_SUCCESS"
    ) {
      this.calculateAssetData(this.props.journeyPlan, this.state.assetTypes);
    }
    if (this.props.reportId !== prevProps.reportId) {
      this.props.getJourneyPlan(this.props.reportId);
    }
    if (this.props.assetTypeActionType == "ASSETTYPES_READ_SUCCESS" && this.props.assetTypeActionType !== prevProps.assetTypeActionType) {
      let aTypes = _.filter(this.props.assetTypes, { inspectable: true, assetTypeClassify: "point" });
      this.setState({
        assetTypes: aTypes,
      });
      this.calculateAssetData(this.props.journeyPlan, aTypes);
    }
  }
  changeHandler(e, blur) {
    // let InputObj = { ...this.state.InputObj };
    // InputObj[e.target.name] = e.target.value;
    // let inspections = [...this.state.reports];
    // if (e.target.name == "user") {
    //   inspections = this.filterByVals(e.target.value, this.state.InputObj.location);
    // }
    // if (e.target.name == "location") {
    //   inspections = this.filterByVals(this.state.InputObj.user, e.target.value);
    // }
    // this.setState({
    //   InputObj: InputObj,
    //   reports: inspections,
    // });
  }
  calculateAssetData(jPlan, assetTypes) {
    if (jPlan && assetTypes) {
      let appForms = [...this.state.appForms];
      let units = _.filter(jPlan.tasks[0].units, (asset) => {
        let allowedAType = _.find(assetTypes, { assetType: asset.assetType });
        let toAdd = allowedAType && asset.appForms && asset.appForms.length > 0;
        if (toAdd) {
          asset.appForms.forEach((appform) => {
            let doesExist = _.find(appForms, { id: appform.id });
            if (!doesExist) {
              appForms.push(appform);
            }
          });
        }
        return toAdd;
      });
      this.setState({
        assets: units,
        appForms: appForms,
      });
    }
  }
  render() {
    console.log(this.state.appForms, this.state.assets);
    let rows =
      this.state.assets &&
      this.state.assets.length > 0 &&
      this.state.assets.map((asset) => {
        return (
          <tr key={asset._id}>
            <td>{asset.assetType}</td>
            <td>{asset.unitId}</td>
            {/* <td>{asset.status}</td>
          <td>{moment(asset.date).format("MM/DD/YYYY")}</td>
          <td>{asset.user.name}</td> */}

            <td>
              <ButtonActionsTable
                // handleClick={(e) => {
                //   this.props.handleClick(asset);
                // }}
                margin="0px 10px 0px 0px"
                buttonText={languageService("View")}
              />
            </td>
          </tr>
        );
      });
    return (
      <React.Fragment>
        <div id="mainContent" className="table-report" style={{ ...themeService(switchReportStyle.mainStyle), minHeight: "800px" }}>
          <Row>
            <Col md={2}></Col>
            <Col md={10}>
              <h2 style={themeService(switchReportStyle.headingStyle)}>{languageService("Asset Types Selection")}</h2>
            </Col>
          </Row>

          <Col md={1}></Col>
          <Row>
            <Col md={3}></Col>
            <Col md={8}>
              {this.state.appForms && this.state.appForms.length > 0 && (
                <SelectField
                  inputFieldProps={{ name: "testType", label: "Test Type" }}
                  options={this.state.appForms}
                  changeHandler={this.changeHandler}
                  value={this.state.InputObj.location}
                />
              )}
              {this.state.assets && this.state.assets.length > 0 && (
                <SelectField
                  inputFieldProps={{ name: "asset", label: "Asset" }}
                  options={this.state.assets}
                  changeHandler={this.changeHandler}
                  value={this.state.InputObj.location}
                />
              )}
              {this.state.assets && this.state.assets.length > 0 && (
                <SelectField
                  inputFieldProps={{ name: "unitID", label: "Asset Types" }}
                  options={this.state.assets}
                  changeHandler={this.changeHandler}
                  value={this.state.InputObj.location}
                />
              )}
            </Col>
            <span className="spacer"></span>
          </Row>
          <Row>
            <Col md={10}>
              <table className="table-selection">
                <thead>
                  <tr>
                    <th data-field="title" style={{ width: "20px" }}>
                      {languageService("Asset Types")}
                    </th>
                    <th data-field="location" style={{ width: "20px" }}>
                      {languageService("Location")}
                    </th>
                    {/* <th data-field="action" style={{ width: "10px" }}>
                      {languageService("Status")}
                    </th>
                    <th data-field="date" style={{ width: "20px" }}>
                      {languageService("Date")}
                    </th>
                    <th data-field="user" style={{ width: "10px" }}>
                      {languageService("User")}
                    </th>*/}
                    <th data-field="action" style={{ width: "10px" }}>
                      {languageService("Action")}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ background: "var(--fifth)", fontSize: "12px", minHeight: "500px" }}>{/*rows*/}</tbody>
              </table>
            </Col>
            <Col md={1}></Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
const getAssetTypes = curdActions.getAssetTypes;
const getJourneyPlan = curdActions.getJourneyPlan;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    getJourneyPlan,
    getAssetTypes,
  },
};

let variableList = {
  assetTypeReducer: {
    assetTypes: [],
  },
  journeyPlanReducer: { journeyPlan: "" },
};

const AssetTypesContainer = CRUDFunction(AssetTypesSelection, "AssetTypesInspection", actionOptions, variableList, [
  "journeyPlanReducer",
  "assetTypeReducer",
]);
export default AssetTypesContainer;

const SelectField = (props) => {
  return (
    <div style={{ ...themeService(formFeildStyle.feildStyle), display: "inline-block", margin: "0" }}>
      {props.inputFieldProps.label && (
        <label style={{ ...themeService(formFeildStyle.lblStyle), width: "inherit", margin: "5px 5px 5px" }}>
          {languageService(props.inputFieldProps.label) + ":"}
        </label>
      )}
      <select
        style={{ ...themeService(formFeildStyle.inputStyle), width: "inherit" }}
        onChange={(e) => props.changeHandler(e, false, "select")}
        onBlur={(e) => props.changeHandler(e, true, "select")}
        {...props.inputFieldProps}
        value={props.value}
      >
        {props.options &&
          props.options.map((item, index) => (
            <option key={index} value={item.id}>
              {props.inputFieldProps.name == "asset" ? languageService(item.assetType) : ""}
              {props.inputFieldProps.name == "testType" ? languageService(item.name) : ""}
              {props.inputFieldProps.name == "unitID" ? languageService(item.unitId) : ""}
            </option>
          ))}
      </select>
    </div>
  );
};
