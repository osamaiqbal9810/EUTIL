import React, { Component } from "react";
import { Col } from "reactstrap";
import { ButtonActionsTable } from "components/Common/Buttons";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { trackReportStyle } from "../style/index";
import "../style/style.css";
import { languageService } from "Language/language.service";
import moment from "moment";
import SvgIcon from "react-icons-kit";
import { arrowLeft } from "react-icons-kit/icomoon/arrowLeft";
import _ from "lodash";
import { curdActions } from "../../../../reduxCURD/actions";
import { CRUDFunction } from "../../../../reduxCURD/container";
import MonthlySwitchReport from "./monthlySwitchInspection";
import { getAllowedSwitches } from "../../../../AssetTypeConfig/Reports/SwitchinspectionReport";
const excludedForms = ["frmSwitchInspection"];

class DetailedSwitchInspection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      inspectionData: {
        lineName: "",
        user: "",
        date: "",
        weather: "",
        showBack: false,
      },
      dataToShow: null,
      staticMode: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }
  componentDidMount() {
    let returnState = this.calculateData(this.props.inspec);
    if (this.props.isMulti) {
      this.setState({
        listData: returnState.data,
        inspectionData: returnState.inspectionData,
        staticMode: true,
        showReport: true,
        dataToShow: returnState.data,
      });
    } else {
      this.props.handleReportPrintOff();
      this.setState({
        listData: returnState.data,
        inspectionData: returnState.inspectionData,
        staticMode: true,
      });
    }
  }

  calculateData(jPlan) {
    let switchAssets = [];
    let jPlanFirstTask = jPlan && jPlan.tasks && jPlan.tasks.length > 0 && jPlan.tasks[0];
    if (jPlanFirstTask && jPlan.tasks[0].units.length > 0) {
      switchAssets = [];
      jPlanFirstTask.units.forEach((asset, index) => {
        if (getAllowedSwitches(asset.assetType)) {
          switchAssets.push(asset);
        }
      });
    }
    let inspectionData = {
      lineName: jPlanFirstTask.units && jPlanFirstTask.units.length > 0 && jPlanFirstTask.units[0].unitId,
      user: jPlan.user.name,
      date: jPlan.date,
      weather: "",
    };
    let data = [];

    switchAssets.forEach((sa) => {
      if (sa.appForms && sa.appForms.length > 0) {
        sa.appForms.forEach((form) => {
          if (form) {
            for (var i = 0; i < excludedForms.length; i++) {
              var match = excludedForms[i].match(form.id);
              if (!match) {
                data.push({ id: sa.id, assetName: sa.unitId, form: form, testName: form.name });
              }
            }

            // form.id !== "frmSwitchInspection" && data.push({ id: sa.id, assetName: sa.unitId, form: form, testName: form.name });
          }
        });
      }
    });
    let returnState = { data: data, inspectionData: inspectionData };
    return returnState;
  }
  handleClick(data) {
    this.props.handleReportPrint();
    this.setState({
      showReport: true,
      dataToShow: [data],
      showBack: true,
    });
  }
  handleBack() {
    this.props.handleReportPrintOff();
    this.setState({
      showReport: false,
      showBack: false,
    });
  }

  renderReports() {
    let rep = null;
    rep =
      this.state.dataToShow &&
      this.state.dataToShow.map((assetForm) => {
        return (
          <MonthlySwitchReport
            key={assetForm.id}
            reportData={assetForm}
            inspectionData={this.state.inspectionData}
            handleClick={this.props.handleClick}
            signatureImage={this.props.signatureImage}
          />
        );
      });
    return rep;
  }

  render() {
    let listData = [];
    let rows =
      this.state.listData &&
      this.state.listData.length > 0 &&
      ((listData = _.cloneDeep(this.state.listData)),
      listData.reverse(),
      listData.map((dat) => {
        return (
          <tr key={Math.random() + " " + dat.assetName}>
            <td>{dat.assetName}</td>
            <td>{languageService(dat.testName)}</td>

            <td>
              <ButtonActionsTable
                handleClick={(e) => {
                  this.handleClick(dat);
                }}
                margin="0px 10px 0px 0px"
                buttonText={languageService("View")}
              />
            </td>
          </tr>
        );
      }));
    return (
      <React.Fragment>
        {this.state.showBack && (
          <div
            className="report-arrow"
            style={{
              margin: "15px 15px 10px 0",
              cursor: "pointer",
              float: "left",
              position: "absolute",
              top: "15px",
              left: "130px",
              textAlign: "center",
            }}
            onClick={(e) => {
              this.handleBack();
            }}
          >
            <span style={{ verticalAlign: "super", marginLeft: "5px", fontSize: "12px", display: "block" }}>
              {languageService("Switch Reports Menu")}
            </span>
            <SvgIcon icon={arrowLeft} size={24} />
          </div>
        )}
        {!this.state.showReport && (
          <div
            id="mainContent"
            className="table-report switch-side-track report-selection"
            style={{ ...themeService(trackReportStyle.mainStyle), background: "transparent" }}
          >
            <div style={{ textAlign: "center", fontWeight: "600", marginBottom: "30px" }}>
              {this.state.inspectionData.date ? (
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "var(--fifth)",
                    position: "relative",
                    padding: "5px 15px",
                    borderRadius: "5px",
                  }}
                >
                  {languageService("Date") + ": " + moment(this.state.inspectionData.date).format("MM/DD/YYYY")}{" "}
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="row">
              <Col md={1}></Col>
              <Col md={10}>
                <table className="table-selection">
                  <thead>
                    <tr>
                      <th data-field="title" style={{ width: "20px" }}>
                        {languageService("Asset Name")}
                      </th>
                      <th data-field="location" style={{ width: "20px" }}>
                        {languageService("Report Name")}
                      </th>
                      <th data-field="action" style={{ width: "10px" }}>
                        {languageService("Action")}
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ background: "var(--fifth)", fontSize: "12px" }}>{rows}</tbody>
                </table>
              </Col>
              <Col md={1}></Col>
            </div>
          </div>
        )}
        {this.state.showReport && this.renderReports()}
      </React.Fragment>
    );
  }
}

const getJourneyPlan = curdActions.getJourneyPlan;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    getJourneyPlan,
  },
};

let variableList = {
  journeyPlanReducer: { journeyPlan: "" },
};

const DetailedSwitchInspectionContainer = CRUDFunction(
  DetailedSwitchInspection,
  "DetailedSwitchInspectionReportFilter",
  actionOptions,
  variableList,
  ["journeyPlanReducer"],
);
export default DetailedSwitchInspectionContainer;
