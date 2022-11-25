import React, { Component } from "react";
import { Row, Col, Label } from "reactstrap";
import { CRUDFunction } from "../../../reduxCURD/container";
import { curdActions } from "../../../reduxCURD/actions";
import _ from "lodash";
import "./style.css";
import { cross } from "react-icons-kit/icomoon/cross";
import { loop } from "react-icons-kit/icomoon/loop";
import SvgIcon from "react-icons-kit";
import AddNewInputField from "../../LocationSetup/AddNewInputField";
import { AddNewField } from "../../LocationSetup/LocationList";
class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: null,
      newInputField: false,
    };
    this.handleAddNewLocation = this.handleAddNewLocation.bind(this);
    this.handleSaveField = this.handleSaveField.bind(this);
    this.removeCustomerReport = this.removeCustomerReport.bind(this);
    this.handleVersionChangeSave = this.handleVersionChangeSave.bind(this);
    this.handleReloadVersionInfo = this.handleReloadVersionInfo.bind(this);
  }
  handleAddNewLocation(input) {
    this.setState({ newInputField: input });
  }
  componentDidMount() {
    this.props.getApplicationlookupss(["Customer"]);
  }
  handleSaveField(value) {
    this.adjustField(value);
  }
  removeCustomerReport(rName) {
    this.adjustField(rName, true);
  }
  handleVersionChangeSave(key, value) {
    let customer = this.state.customer && { ...this.state.customer };
    customer.opt1[key] = value;
    this.props.updateApplicationlookups(customer);
  }
  adjustField(val, remove) {
    let customer = this.state.customer && { ...this.state.customer };
    let opt2 = customer && customer.opt2 && customer.opt2;
    let subsetIndex = _.findIndex(opt2, (item) => {
      return item.id === "timpsReports";
    });
    if (subsetIndex > -1) {
      _.remove(customer.opt2[subsetIndex].subset, (item) => item === val);
      if (remove) {
      } else {
        customer.opt2[subsetIndex].subset.push(val);
      }
      this.props.updateApplicationlookups(customer);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType == "APPLICATIONLOOKUPSS_READ_SUCCESS"
    ) {
      console.log(this.props.applicationlookupss);
      if (this.props.applicationlookupss.length > 0) {
        this.setState({
          customer: this.props.applicationlookupss[0],
        });
      }
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType == "APPLICATIONLOOKUPS_UPDATE_SUCCESS"
    ) {
      this.props.getApplicationlookupss(["Customer"]);
    }
  }
  handleReloadVersionInfo() {
    this.props.getVersion(1);
  }
  render() {
    return (
      <div>
        <Row>
          <Col md={6}>
            <CustomerReports
              opt2={this.state.customer && this.state.customer.opt2 && this.state.customer.opt2}
              removeAction={this.removeCustomerReport}
              handleAddNewLocation={this.handleAddNewLocation}
              handleSaveField={this.handleSaveField}
              newInputField={this.state.newInputField}
            />
          </Col>
          <Col md={6}>
            <CustomerMobileVersion
              compatibleMobileApps={this.state.customer && this.state.customer.opt1 && this.state.customer.opt1.compatibleMobileApps}
              handleSaveField={this.handleVersionChangeSave}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
          <span
          className="customerAction"
          style={{ color: "#840f0f" }}
          onClick={(e) => {
            this.handleReloadVersionInfo();
          }}
      >
        <SvgIcon style={{ verticalAlign: "middle" }} icon={loop} size="15" />
        </span>
          </Col>
        </Row>
      </div>
    );
  }
}
const getApplicationlookupss = curdActions.getApplicationlookupss;
const updateApplicationlookups = curdActions.updateApplicationlookups;
const getVersion = curdActions.getVersions;

let actionOptions = {
  create: false,
  update: false,
  read: true,
  delete: false,
  others: { getApplicationlookupss, updateApplicationlookups, getVersion },
};
let variableList = {
  applicationlookupsReducer: { applicationlookupss: [] },
};
let reducers = ["applicationlookupsReducer"];
const CustomerContainer = CRUDFunction(Customer, "Customer", actionOptions, variableList, reducers);
export default CustomerContainer;

const CustomerReports = (props) => {
  let cReports = _.find(props.opt2, (item) => {
    return item.id === "timpsReports";
  });
  let reportList =
    cReports &&
    cReports.subset &&
    cReports.subset.length > 0 &&
    cReports.subset.map((report) => {
      return <CustomerRow report={report} removeAction={props.removeAction} />;
    });
  return (
    <div className="customerContainer">
      <div className="customerReportHeading">Customer Reports</div>
      {reportList}
      <div className="customerReportAddNew">
        {props.newInputField && (
          <AddNewInputField
            handleAddNewLocation={props.handleAddNewLocation}
            handleSaveField={(val) => {
              if (val) {
                props.handleSaveField(val, props.locationType);
                props.handleAddNewLocation("");
              }
            }}
          />
        )}
        {!props.newInputField && <AddNewField locationType={"customerReport"} handleAddNewLocation={props.handleAddNewLocation} />}
      </div>
    </div>
  );
};

const CustomerRow = (props) => {
  return (
    <div key={props.report} className="customerRow">
      {props.report}
      <span
        className="customerAction"
        style={{ color: "#840f0f" }}
        onClick={(e) => {
          props.removeAction(props.report);
        }}
      >
        <SvgIcon style={{ verticalAlign: "middle" }} icon={cross} size="15" />
      </span>
    </div>
  );
};

const CustomerMobileVersion = (props) => {
  return (
    <div className="customerContainer">
      <div className="customerReportHeading">Compatible App Version</div>
      <AddNewInputField
        value={props.compatibleMobileApps}
        noDelete
        handleSaveField={(val) => {
          if (val) {
            props.handleSaveField("compatibleMobileApps", val);
          }
        }}
        handleAddNewLocation={() => {}}
      />
    </div>
  );
};
