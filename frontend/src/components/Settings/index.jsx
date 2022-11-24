import React, { Component } from "react";
import GlobalUserLogging from "./GlobalUserLogging";
import { MainPageHeading } from "./common";
import { Col, Row } from "reactstrap";
import { getAppMockupsTypes, setGeoLocationAppMockupsType } from "reduxRelated/actions/diagnosticsActions";
import { CRUDFunction } from "reduxCURD/container";
import { languageService } from "../../Language/language.service";
import { curdActions } from "reduxCURD/actions";
import { checkFormIsValid, processFromFields } from "../../utils/helpers";
import FormFields from "../../wigets/forms/formFields";
import { ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { basicColors, retroColors } from "style/basic/basicColors";
import _ from "lodash";
import permissionCheck from "../../utils/permissionCheck";

const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class Settings extends Component {
  constructor(props) {
    super(props);
    //this.handlesaveGeoLocationLogging = this.handlesaveGeoLocationLogging.bind(this);
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
      configurations: null,
    };
    this.fieldTitle = "configFields";
    this.lookupCopy = null;
    this.dirtyList = [];

    this.updateConfig = this.updateConfig.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.revertChanges = this.revertChanges.bind(this);
    this.onWeekDaysChange = this.onWeekDaysChange.bind(this);
  }
  componentDidMount() {
    //this.props.getAppMockupsTypes("GlobalUserLocLogging");
    let allowed = permissionCheck("APPLICATIONLOOKUP", "view");
    if (allowed) {
      this.props.getApplicationlookupss(["config"]);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType == "APPLICATIONLOOKUPSS_READ_SUCCESS"
    ) {
      this.lookupCopy = _.cloneDeep(this.props.applicationlookupss);

      this.loadConfigurations(this.lookupCopy);
      this.dirtyList = [];
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType == "APPLICATIONLOOKUPS_UPDATE_SUCCESS"
    ) {
      this.props.getApplicationlookupss(["config"]);
    }
  }

  makeConfigurationFields(configurations) {
    // todo: validate and categorize the configuration to display in difference categories
    let configs = {};
    for (let c of configurations) {
      if (c.opt1) {
        let field = {
          element: "",
          label: true,
          labelText: c.description,
          config: { name: c.code, type: "" },
          containerConfig: { col: c.opt1.cols ? c.opt1.cols : 12 },
          validation: { required: false },
          hide: c.opt1.hide === true ? true : false,
        };
        if (c.opt1.type === "number" || c.opt1.type === "text") {
          field.element = "input";
          field.config.type = c.opt1.type;
        } else if (c.opt1.type === "select") {
          field.element = "select";
          field.config.type = "text";
          field.config.options = c.opt1.options.map((op) => {
            return { val: op, text: op };
          });
        } else if (c.opt1.type === "bool") {
          field.element = "checkbox";
          field.config.type = "checkbox";
          field.containerConfig.className = "custom-checkbox";
        } else if (c.opt1.type === "date") {
          field.element = "date";
          field.config.type = "text";
        } else if (c.opt1.type === "radio") {
          field.element = "radio";
          field.config.options = c.opt1.options.map((op) => {
            return { val: op, text: op };
          });
        } else if (c.opt1.type == "AssetSelection") {
          field.element = "AssetSelection";
          field.config.type = "text";

          field.config.showHeadersLabels = c.opt1.showHeadersLabels;
          field.config.availableHeader = c.opt1.opt1headerTitle;
          if (c.code == "weekdays") field.config.onAssetChange = this.onWeekDaysChange;
          field.config.selectedHeader = c.opt1.opt2headerTitle;
          //!c.opt1.options && (c.opt1.options = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
          field.config.options = [
            {
              label: "",
              options: c.opt1.options
                ? c.opt1.options.map((op) => {
                    return { label: op, value: op };
                  })
                : null,
            },
          ];
        }

        field.value = c.opt2;
        configs[field.config.name] = field;
      }
    }

    return configs;
  }
  makeConfigurationGroups(configurations) {
    let configGroups = _.groupBy(configurations, "opt1.group");
    let displayConfigGroups = [];
    for (let k of Object.keys(configGroups)) {
      let cgroup = configGroups[k];
      cgroup = _.sortBy(cgroup, "opt1.sortid");

      let dconfig = this.makeConfigurationFields(cgroup);
      displayConfigGroups[k] = dconfig;
    }

    return displayConfigGroups;
  }

  loadConfigurations(configurations) {
    let displayConfigGroups = this.makeConfigurationGroups(configurations);
    //let configs = this.makeConfigurationFields(configurations);

    this.setState({ configGroups: displayConfigGroups });
  }
  // handlesaveGeoLocationLogging(checkValue) {
  //   let obj = {
  //     id: this.props.userLogging ? this.props.userLogging._id : null,
  //     listName: "GlobalUserLocLogging",
  //     opt1: { GlobalGeoLogging: checkValue },
  //   };

  //   this.props.setGeoLocationAppMockupsType(obj);
  // }
  updateConfig = (newState) => {
    if (newState) {
      let configs = this.lookupCopy; //this.props.applicationlookupss;///this.makeConfigurationFields(this.props.applicationlookupss);

      let keys = Object.keys(newState[this.fieldTitle]);
      for (let key of keys) {
        let field = newState[this.fieldTitle][key];
        let config = configs.find((cfg) => {
          return cfg.code === key;
        });

        if (config.opt2 !== field.value) {
          config.opt2 = field.value;
          if (!this.dirtyList.includes(key)) this.dirtyList.push(key);
        }
      }

      let displayConfigGroups = this.makeConfigurationGroups(configs);
      this.setState({ configGroups: displayConfigGroups });

      //  this.setState({ configurations: configs });
    }
  };
  saveChanges() {
    let alus = this.lookupCopy; //this.props.applicationlookupss;
    for (let field of this.dirtyList) {
      let reqlu = alus.find((alu) => {
        return alu.code === field;
      });
      //reqlu.opt2 = this.state.configurations[field].value;

      this.props.updateApplicationlookups(reqlu);
    }
  }
  revertChanges() {}
  onWeekDaysChange(selected) {
    //console.log(selected);
    if (selected.length < 7) {
      //let configs = this.makeConfigurationFields(this.props.applicationlookupss);
      //configs["weekdays"].value = selected;
      let configs = this.lookupCopy; //this.props.applicationlookupss;
      let config = configs.find((cfg) => {
        return cfg.code === "weekdays";
      });
      config.opt2 = selected;

      if (!this.dirtyList.includes("weekdays")) this.dirtyList.push("weekdays");
      //this.setState({ configurations: configs });

      let displayConfigGroups = this.makeConfigurationGroups(configs);
      this.setState({ configGroups: displayConfigGroups });
    }
  }
  render() {
    let configGroupsDisplay = [];
    if (this.state.configGroups) {
      //console.log('groups', this.state.configGroups);
      let keys = Object.keys(this.state.configGroups);
      // console.log('keys',keys);
      for (let k of keys) {
        let hideCat = checkHideCat(this.state.configGroups[k]);

        if (!hideCat) {
          configGroupsDisplay.push(
            <div className={"commonform"} key={k} style={this.styles.companyInfoContainer}>
              <fieldset>
                <legend> {k === languageService("undefined") ? languageService("Un-Categorized") : languageService(k)} </legend>
                <FormFields configFields={this.state.configGroups[k]} fieldTitle={this.fieldTitle} change={this.updateConfig} />
              </fieldset>
            </div>,
          );
        }
      }
      //console.log('display groups', configGroupsDisplay);
    }

    return (
      <div style={{ background: "#fff", margin: "15px", padding: "10px 30px " }}>
        <Row>
          <Col md={12}>
            <MainPageHeading heading="b">{languageService("Settings")}</MainPageHeading>
          </Col>
        </Row>
        {/* <Row>
          <Col md={12}>
            {this.state.configurations && (
              <div className={"commonform"}>
                <FormFields configFields={this.state.configurations} fieldTitle={this.fieldTitle} change={this.updateConfig} />
              </div>
            )}
          </Col>
        </Row> */}
        <Row>
          <Col md={12}>{configGroupsDisplay}</Col>
        </Row>
        <Row>
          <MyButton
            style={themeService(ButtonStyle.commonButton)}
            type="submit"
            onClick={this.saveChanges}
            disabled={this.dirtyList.length === 0}
          >
            {languageService("Save")}
          </MyButton>

          {/* <MyButton style={themeService(ButtonStyle.commonButton)} type="submit" onClick={this.revertChanges} disabled={this.dirtyList.length===0} >
          {languageService("Revert")}
          </MyButton> */}
        </Row>
      </div>
    );
  }
}

let variables = {
  diagnosticsReducer: { userLogging: null },
  applicationlookupsReducer: {
    applicationlookupss: [],
  },
};

const getApplicationlookupss = curdActions.getApplicationlookupss;
const updateApplicationlookups = curdActions.updateApplicationlookups;
const deleteApplicationlookups = curdActions.deleteApplicationlookups;
const createApplicationlookups = curdActions.createApplicationlookups;

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    getAppMockupsTypes,
    setGeoLocationAppMockupsType,
    getApplicationlookupss: getApplicationlookupss,
    updateApplicationlookups: updateApplicationlookups,
    deleteApplicationlookups: deleteApplicationlookups,
    createApplicationlookups: createApplicationlookups,
  },
};
let reducers = ["diagnosticsReducer", "applicationlookupsReducer"];
let SettingsContainer = CRUDFunction(Settings, "Settings", actionOptions, variables, reducers);
export default SettingsContainer;

function checkHideCat(configs) {
  let hideCat = true;
  let stateKeys = Object.keys(configs);
  stateKeys.forEach((stateObj) => {
    let toNotHide = !configs[stateObj].hide || configs[stateObj].hide === false;
    toNotHide && (hideCat = false);
  });
  return hideCat;
}
