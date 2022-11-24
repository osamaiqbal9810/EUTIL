import React, { Component } from "react";
import { CRUDFunction } from "../../reduxCURD/container";
import { Col, Row } from "reactstrap";
import { themeService } from "../../theme/service/activeTheme.service";
import { languageService } from "../../Language/language.service";
import { MainPageHeading } from "components/Settings/common";
import { basicColors, retroColors } from "style/basic/basicColors";
import { basic_webpage_img_txt } from "react-icons-kit/linea/basic_webpage_img_txt";
import { basic_mail } from "react-icons-kit/linea/basic_mail";
import { Icon } from "react-icons-kit";
import { curdActions } from "reduxCURD/actions";
import { dateSortArrayByField } from "../../utils/sortingMethods";
import moment from "moment";
import { calculateAlertTime } from "../../utils/helpers";
import _ from "lodash";
import { ButtonStyle } from "../../style/basic/commonControls";
import { ic_launch } from "react-icons-kit/md/ic_launch";
import { Link, NavLink } from "react-router-dom";
import {versionInfo} from "../MainPage/VersionInfo";


const SIGNAL_APP_CONFIGS = [{ key: "rule2139bAlertTemplate", text: "Apply 213.9b Alert to inspection Template" }];

class Alerts extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      companyInfoContainer: themeService({
        default: {
          boxShadow: "3px 3px 5px #cfcfcf",
          fontFamily: "Arial",
          fontSize: 12,
          width: "100%",
          background: "#fff",
          margin: "15px",
          padding: "10px 30px ",
        },
        retro: {
          boxShadow: "0",
          fontFamily: "Arial",
          fontSize: 12,
          width: "100%",
          background: retroColors.nine,
          margin: "15px",
          padding: "10px 30px ",
        },
      }),
    };
    this.state = {
      userConfig: null,
      isDirty: false,
    };

    this.loadConfigurations = this.loadConfigurations.bind(this);
    this.renderUserConfigs = this.renderUserConfigs.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  componentDidMount() {
    this.props.getAlerts();
    this.props.getApplicationlookupss(["userConfig"]);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType === "APPLICATIONLOOKUPSS_READ_SUCCESS"
    ) {
      let applicationlookupss = _.cloneDeep(this.props.applicationlookupss);

      this.loadConfigurations(applicationlookupss);
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      ["APPLICATIONLOOKUPS_UPDATE_SUCCESS", "APPLICATIONLOOKUPS_CREATE_SUCCESS"].includes(this.props.applicationlookupsActionType)
    ) {
      this.props.getApplicationlookupss(["userConfig"]);
    }
  }

  handleCancel() {
    let applicationlookupss = _.cloneDeep(this.props.applicationlookupss);

    this.loadConfigurations(applicationlookupss);
  }

  loadConfigurations(configurations) {
    let userConfig = this.findUserConfig(configurations);

    this.setState({ userConfig });
  }

  findUserConfig(configurations) {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    return configurations.find((c) => c.code === loggedInUser._id);
  }

  updateConfig = (key, value) => {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let { userConfig } = this.state;

    if (userConfig) {
      userConfig.opt1[key] = value;
    } else {
      userConfig = {
        tenantId: "ps19",
        listName: "userConfig",
        code: loggedInUser._id,
        description: "Milepost Start Limit",
        opt1: { [key]: value },
        opt2: "",
      };
    }

    this.setState({ userConfig, isDirty: true });
  };

  saveChanges() {
    let applicationlookupss = _.cloneDeep(this.props.applicationlookupss);
    let userConfig = this.findUserConfig(applicationlookupss);

    if (userConfig) {
      this.props.updateApplicationlookups(this.state.userConfig);
    } else {
      this.props.createApplicationlookups(this.state.userConfig);
    }

    this.setState({ isDirty: false });
  }

  checkIfConfigSelected = (config) => {
    let results = false;
    if (this.state.userConfig) {
      Object.keys(this.state.userConfig.opt1).forEach((key) => {
        if (key === config) results = this.state.userConfig.opt1[key];
      });
    }

    return results;
  };

  renderUserConfigs() {
  let timpsSignalApp = versionInfo.isSITE();
  
  let USER_ALERT_CONFIGS = [];
      USER_ALERT_CONFIGS = timpsSignalApp ? USER_ALERT_CONFIGS : [...USER_ALERT_CONFIGS, ...SIGNAL_APP_CONFIGS];


    return USER_ALERT_CONFIGS.map((uac) => {
      return (
        <fieldset>
          <legend> {languageService("Settings ")}</legend>

          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                onChange={() => this.updateConfig(uac.key, !this.checkIfConfigSelected(uac.key))}
                checked={this.checkIfConfigSelected(uac.key)}
              />{" "}
              {languageService(uac.text)}
            </label>
          </div>
        </fieldset>
      );
    });
  }

  render() {
    let alerts = [];

    if (this.props.alerts && this.props.alerts.length) {
      alerts = dateSortArrayByField(this.props.alerts, "alertTime", true);
      // alerts = alerts.filter(al => {
      //     let date = moment(al.alertTimeLocal);
      //
      //     if (al.alertTimeLocal && date.isValid() && date.isAfter()) {
      //         al.calculatedDate = calculateAlertTime(date, al.time, al.unitOfTime, al.event);
      //         return true;
      //     }
      //
      //     return false;
      // });
    }

    return (
      <div style={{ background: "#fff", margin: "15px", padding: "10px 30px " }}>
        <Row>
          <Col md="12">
            <MainPageHeading heading="b">{languageService("Alerts")}</MainPageHeading>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <div className={"commonform alerts"} style={this.styles.companyInfoContainer}>
              {this.renderUserConfigs()}

              {this.state.isDirty && (
                <React.Fragment>
                  <button
                    onClick={this.saveChanges}
                    className="setPasswordButton"
                    type="button"
                    style={themeService(ButtonStyle.commonButton)}
                  >
                    {languageService("Save")}
                  </button>
                  <button
                    onClick={this.handleCancel}
                    className="setPasswordButton"
                    type="button"
                    style={themeService(ButtonStyle.commonButton)}
                  >
                    {languageService("Cancel")}
                  </button>
                </React.Fragment>
              )}
            </div>
          </Col>
          <Col md={8}>
            <div className={"commonform alerts"} style={this.styles.companyInfoContainer}>
              {alerts.reduce((arr, al) => {
                let date = moment(al.alertTimeLocal);
                let calculatedDate = null;

                if (al.alertTimeLocal && date.isValid()) {
                  calculatedDate = calculateAlertTime(date, al.time, al.unitOfTime, al.event);
                }

                if (!(!al.isClone && al.isTemplate) && calculatedDate && calculatedDate.isAfter()) {
                  arr.push(
                    <div className="alert-box">
                      <div className="alert-media" style={{ color: al.status === "pending" ? retroColors.fourth : retroColors.first }}>
                        {/* <Icon size={24} icon={basic_mail} /> */}
                        {al.type.map((alertType) => {
                          if (alertType === "web") return <Icon size={24} icon={basic_webpage_img_txt} />;
                          else return <Icon size={24} icon={basic_mail} />;
                        })}
                      </div>
                      <div className="alert-msg">
                        <h4>{al.title}</h4>
                        <p>{al.message}</p>
                        <div>
                          <span className="badge">
                            {languageService("Alert time")}: {moment(calculatedDate).format("LLLL")}
                          </span>
                          {al.reference.issueObj && (
                            <NavLink
                              to={{
                                pathname: "/issuereports/" + al.reference.issueId,
                                state: {
                                  issue: al.reference.issueObj,
                                },
                              }}
                              style={{ float: "right", cursor: "pointer" }}
                            >
                              <Icon size={24} icon={ic_launch} />
                            </NavLink>
                          )}
                        </div>
                      </div>
                    </div>,
                  );
                }

                return arr;
              }, [])}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const getApplicationlookupss = curdActions.getApplicationlookupss;
const updateApplicationlookups = curdActions.updateApplicationlookups;
const deleteApplicationlookups = curdActions.deleteApplicationlookups;
const createApplicationlookups = curdActions.createApplicationlookups;

let variables = {
  applicationlookupsReducer: {
    applicationlookupss: [],
  },
};

let actionOptions = {
  create: false,
  update: false,
  read: true,
  delete: false,
  others: {
    getApplicationlookupss: getApplicationlookupss,
    updateApplicationlookups: updateApplicationlookups,
    deleteApplicationlookups: deleteApplicationlookups,
    createApplicationlookups: createApplicationlookups,
  },
};
let reducers = ["applicationlookupsReducer"];
let AlertsContainer = CRUDFunction(Alerts, "alert", actionOptions, variables, reducers);
export default AlertsContainer;
