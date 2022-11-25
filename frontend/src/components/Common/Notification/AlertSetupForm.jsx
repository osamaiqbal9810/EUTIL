import React, { Component } from "react";
import { ModalStyles } from "components/Common/styles.js";
import "components/Common/commonform.css";
import { ButtonStyle, CommonModalStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { languageService } from "../../../Language/language.service";
import _ from "lodash";
import { Col, Row } from "reactstrap";
import EditableTable from "components/Common/EditableTable";
import { guid } from "../../../utils/UUID";
import { userStyles } from "../../SetupPage/User/style/userStyles";
import { ButtonMain } from "../Buttons";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { info } from "react-icons-kit/icomoon/info";
import { ALERT_FIELDS, processAlertFieldMapping } from "./mapingFieldNames";
import moment from "moment";
import { calculateAlertTime } from "../../../utils/helpers";
import SvgIcon from "react-icons-kit";
import TooltipWrapper from "../TooltipWrapper";

class AlertSetupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alerts: null,
      alertRules: [],
      pageSize: 30,
      page: 0,
      error: { status: false, message: "" },
      alertRulesCols: [
        {
          id: "field",
          header: `${languageService("Alert")} ${languageService("Field")}`,
          type: "text",
          field: "field",
          editable: true,
          minWidth: 30,
          possibleValues: [],
        },
        {
          id: "type",
          header: `${languageService("Alert")} ${languageService("Type")}`,
          type: "text",
          field: "type",
          editable: true,
          minWidth: 15,
          possibleValues: ["web", "email"],
        },
        {
          id: "event",
          header: `${languageService("Alert")} ${languageService("Event")}`,
          type: "text",
          field: "event",
          editable: true,
          minWidth: 15,
          possibleValues: ["before", "after"],
        },
        {
          id: "time",
          header: languageService("Time"),
          type: "text",
          field: "time",
          editable: true,
          minWidth: 20,
        },
        {
          id: "unitOfTime",
          header: languageService("Unit of time"),
          type: "text",
          field: "unitOfTime",
          editable: true,
          minWidth: 15,
          possibleValues: ["minutes", "hours", "days", "months"],
        },
        {
          id: "destinations",
          header: languageService("Recipient"),
          type: "multiple",
          field: "destinations",
          editable: true,
          minWidth: 60,
          possibleValues: [],
          formatter: (val) => {
            // let size = val.length > 3 ? 3 : val.length;
            // return val.slice(0, size).toString().split(",").join(", ");

            return val.toString().split(",").join(", ");
          },
        },
        {
          id: "expectedTime",
          header: languageService("Expected Alert Time"),
          type: "text",
          field: "alertTimeLocal",
          editable: true,
          minWidth: 35,
          func: (obj) => {
            let result = "N/A";
            let date = moment(obj.alertTimeLocal);

            if (obj.alertTimeLocal && date.isValid()) {
              let calculatedDate = calculateAlertTime(date, obj.time, obj.unitOfTime, obj.event);

              if (obj.status === "generated" && !obj.editMode) {
                result = (
                  <TooltipWrapper placement="right" target={`alertInfo_${obj._id}`} infoText={"Alert sent."}>
                    <div id={`alertInfo_${obj._id}`} style={{ color: "darkblue" }}>
                      <SvgIcon icon={info} size={15} />
                      <span style={{ marginLeft: "5px" }}>{calculatedDate.format("LLLL")}</span>
                    </div>
                  </TooltipWrapper>
                );

                return result;
              }

              if (calculatedDate.isBefore() && !obj.editMode) {
                // let fieldMapObject = ALERT_FIELDS.find(al => al.text === obj.field);
                //
                // if (fieldMapObject && fieldMapObject.exact && obj.event === 'before') {
                //
                // }

                result = (
                  <TooltipWrapper
                    placement="right"
                    target={`alertInfo_${obj._id}`}
                    infoText={
                      "Expected alert time is in back date, therefore notification will not be generated. For correction, please modify alert settings for this event."
                    }
                  >
                    <div id={`alertInfo_${obj._id}`} style={{ color: "red" }}>
                      <SvgIcon icon={info} size={15} />
                      <span style={{ marginLeft: "5px" }}>{calculatedDate.format("LLLL")}</span>
                    </div>
                  </TooltipWrapper>
                );
              } else result = calculatedDate.format("LLLL");
            }

            return result;
          },
        },
        {
          id: "actions",
          header: languageService("Actions"),
          type: "action",
          immediate: ["Edit", "Delete"],
          editMode: ["Save", "Cancel"],
          editable: true,
          minWidth: 20,
        },
      ],
    };

    this.backup = new Map();

    this.submitAlertForm = this.submitAlertForm.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
    this.handleAlertRuleChange = this.handleAlertRuleChange.bind(this);
    this.handlePageSave = this.handlePageSave.bind(this);
    this.setFieldsInColumns = this.setFieldsInColumns.bind(this);
    this.setDestinationInColumns = this.setDestinationInColumns.bind(this);
    this.setAlertRulesValuesToForm = this.setAlertRulesValuesToForm.bind(this);
  }
  async componentDidMount() {
    await this.setFieldsInColumns(this.props.fields);
    this.setDestinationInColumns(this.props.users);

    if (this.props.alertRules && this.props.alertRules.length) {
      this.setAlertRulesValuesToForm(_.cloneDeep(this.props.alertRules));
    }

    if (this.props.formType === "alertSetupFormViewOnlyMode") {
      let { alertRulesCols } = this.state;
      alertRulesCols = alertRulesCols.filter((arc) => arc.id !== "actions");
      this.setState({ alertRulesCols });
    }
  }
  setAlertRulesValuesToForm(alertRules) {
    let data = [];

    if (alertRules) {
      data = alertRules.map((al) => {
        al.destinations = this.processDestinationFromIdToName(al.destinations, this.props.users);
        al.type = Array.isArray(al.type) && al.type.length ? al.type[0] : al.type;
        if (al.event === "exact") al.event = "after";

        if (!("_id" in al)) {
          al._id = guid();
          al.newItem = true;
        }

        al.field = processAlertFieldMapping(al.field, "text");

        return al;
      });
    }

    this.setState({ alertRules: data });
  }
  setFieldsInColumns(fields) {
    let alertRulesCols = _.cloneDeep(this.state.alertRulesCols);
    let disableRule = this.props.configApplicationLookup && this.props.configApplicationLookup.find((c) => c.code === "disableRule213");

    let fieldsArray = [];
    for (let f of fields) {
      if (disableRule && disableRule.opt2 && f === "Rule 213.9(b) Issue 30day Expiry") {
      } else {
        let field = processAlertFieldMapping(f, "text");
        fieldsArray.push(field);
      }
    }

    let colIndex = alertRulesCols.findIndex((c) => {
      return c.id === "field";
    });

    alertRulesCols[colIndex].possibleValues = ["Select Field", ...fieldsArray];

    return this.setState({ alertRulesCols });
  }
  setDestinationInColumns(users) {
    // users = users.filter(u=>u.group_id!=='inspector');
    let alertRulesCols = _.cloneDeep(this.state.alertRulesCols);

    let colIndex = alertRulesCols.findIndex((c) => {
      return c.id === "destinations";
    });

    alertRulesCols[colIndex].possibleValues = users.map((u) => u.name);
    alertRulesCols[colIndex].possibleValuesWithTitle = users.map((u) => ({ value: u.name, text: `${u.name} (${u.genericEmail})` }));

    this.setState({ alertRulesCols });
  }
  handleActionClick(action, obj) {
    let alertRules = _.cloneDeep(this.state.alertRules);
    let deleteIndex = null,
      index = 0,
      dirty = false;
    let error = { status: false, message: "" };
    //console.log(action, ' pressed on grid', obj);
    for (let item of alertRules) {
      if (item._id === obj._id) {
        if (action === "Edit") {
          // make backup for cancel
          let itm = _.cloneDeep(item);
          this.backup.set(item._id, itm); // backup data for cancel edit
          item.editMode = true;
        } else if (action === "Save") {
          let valid = true;
          if (item.field.trim() === "" || item.field.trim() === "Select Field") {
            valid = false;
            error.status = true;
            error.message = `${languageService("Alert")} ${languageService("Field")} ${languageService("is")} ${languageService(
              "required",
            )}`;
          }
          if (valid && item.time.trim() === "") {
            valid = false;
            error.status = true;
            error.message = `${languageService("Time")} ${languageService("is")} ${languageService("required")}`;
          }
          if (valid && item.time <= 0) {
            valid = false;
            error.status = true;
            error.message = `${languageService("Please provide time value greater than")} 0`;
          }
          if (valid && (!item.destinations || !item.destinations.length)) {
            valid = false;
            error.status = true;
            error.message = languageService("Select atleast one recipient");
          }
          let findDuplicate = alertRules.find((al) => {
            let find = false;

            if (
              al._id !== item._id &&
              al.field === item.field &&
              al.type === item.type &&
              al.event === item.event &&
              al.time === item.time &&
              al.unitOfTime === item.unitOfTime
            )
              find = true;

            return find;
          });
          if (findDuplicate) {
            valid = false;
            error.status = true;
            error.message = languageService("Duplicate alert");
          }
          let fieldMapObject = ALERT_FIELDS.find((al) => al.text === item.field);
          if (fieldMapObject && fieldMapObject.exact && item.event === "before") {
            valid = false;
            error.status = true;
            error.message = `${languageService("Alert event")} "${languageService("before")}" ${languageService(
              "cannot be selected",
            )} ${languageService("for")} "${languageService("Inspection Date")}".`;
          }
          if (valid) {
            item.editMode = false;
            dirty = true;
          }
        } else if (action === "Cancel") {
          if (this.backup.has(item._id)) {
            let itembk = this.backup.get(item._id);

            item.editMode = itembk.editMode;
            item.field = itembk.field;
            item.type = itembk.type;
            item.event = itembk.event;
            item.time = itembk.time;
            item.unitOfTime = itembk.unitOfTime;
            item.destinations = itembk.destinations;
          } //delete this row because it's a new one
          else {
            deleteIndex = index;
          }
        } else if (action === "Delete") {
          deleteIndex = index;
        }

        if (deleteIndex != null) {
          // this.props.deleteApplicationlookups(item);
          alertRules.splice(deleteIndex, 1);
        } else if (dirty) {
          item.dirty = true;
        }

        this.setState({ alertRules: alertRules, error });
        // if (dirty) {
        //   for (let d1 of m1.estimate) delete d1.editMode;
        //   this.props.updateMaintenance(m1);
        // }

        break;
      }

      index++;
    }
  }
  handleAlertRuleChange(name, value, obj) {
    let alertRules = _.cloneDeep(this.state.alertRules);
    for (let item of alertRules) {
      if (item._id === obj._id) {
        item[name] = value;
        this.setState({ alertRules: alertRules });
        break;
      }
    }
  }
  handlePageSave(page, pageSize) {
    this.setState({
      page: page,
      pageSize: pageSize,
    });
  }
  addEntry() {
    let alertRules = _.cloneDeep(this.state.alertRules);
    let error = { status: false, message: "" };
    let findEditMode = alertRules.find((al) => al.editMode);
    if (findEditMode) {
      error.status = true;
      error.message = languageService("Please first save/cancel unsaved rules");
      this.setState({ error });
    } else {
      alertRules.push({
        _id: guid(),
        field: "",
        type: "web",
        event: "before",
        unitOfTime: "minutes",
        destinations: [],
        time: "",
        editMode: true,
        newItem: true,
      });
      this.setState({ alertRules });
    }

    // let lastPage = Math.ceil(alertRules.length / this.state.pageSize);

    // lastPage = lastPage <= 0 ? 0 : lastPage - 1;
  }
  processDestinationFields = (fields, users) => {
    return fields.reduce((arr, f) => {
      let findUser = users.find((u) => u.name === f);

      if (findUser) arr.push(findUser._id);

      return arr;
    }, []);
  };
  processDestinationFromIdToName = (fields, users) => {
    return fields.reduce((arr, f) => {
      let findUser = users.find((u) => u._id === f || u.name === f);
      if (findUser) arr.push(findUser.name);

      return arr;
    }, []);
  };
  submitAlertForm() {
    let type = "cancel";
    let data = [];
    let alertRules = _.cloneDeep(this.state.alertRules);
    let error = { status: false, message: "" };

    let findEditMode = alertRules.find((al) => al.editMode);
    if (findEditMode) {
      error.status = true;
      error.message = languageService("Please first save/cancel unsaved rules");
      this.setState({ error });
    } else {
      type = "add";
      data = alertRules.reduce((arr, al) => {
        if (al) {
          if (al.dirty) {
            delete al.dirty; // delete before it goes to server
          }

          if (al.newItem) {
            delete al.newItem; // delete before it goes to server
            delete al._id;
          }

          let fieldMapObject = ALERT_FIELDS.find((alert) => alert.text === al.field);

          if (fieldMapObject.isTemplate) {
            al.isTemplate = !!fieldMapObject.isTemplate;
            al.disableRecalculate = !!fieldMapObject.disableRecalculate;
            al.title = fieldMapObject.title;
            al.message = fieldMapObject.message;
          }

          al.destinations = this.processDestinationFields(al.destinations, this.props.users);

          al.reference = {
            fieldDisplayText: al.field,
            field: processAlertFieldMapping(al.field),
          };

          if (al.reference.field === "lastInspection") al.event = "exact";

          arr.push(al);
        }
        return arr;
      }, []);

      this.props.handleAction({ type, data });
    }
  }
  render() {
    const { alertRules } = this.state;

    return (
      <React.Fragment>
        <Row>
          {this.props.formType === "alertSetupForm" && (
            <Col md={12}>
              <div style={{ float: "right", marginRight: "21px", textAlign: "center" }}>
                <div>{`${languageService("Add")} ${languageService("Alert")}`}</div>
                <ButtonMain
                  handleClick={this.addEntry}
                  icon={withPlus}
                  width="40px"
                  iconSize={18}
                  backgroundColor={themeService(userStyles.addButtonIconStyle.backgroundColor)}
                  hoverBackgroundColor={themeService(userStyles.addButtonIconStyle.hoverBackground)}
                  hoverBorder={themeService(userStyles.addButtonIconStyle.hoverBorder)}
                />
              </div>
            </Col>
          )}

          <Col md="12">
            <EditableTable
              columns={this.state.alertRulesCols}
              data={alertRules}
              handleActionClick={this.handleActionClick}
              onChange={this.handleAlertRuleChange}
              pageSize={this.state.pageSize}
              pagination={true}
              handlePageSave={this.handlePageSave}
              page={this.state.page}
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            {this.state.error.status && (
              <div
                style={{
                  marginLeft: "16px",
                  color: "red",
                }}
                className={"error-info"}
              >
                {this.state.error.message}
              </div>
            )}

            {this.props.formType === "alertSetupFormViewOnlyMode" ? (
              <div style={{ float: "right", marginRight: "21px" }}>
                <button
                  className="setPasswordButton"
                  onClick={this.props.handleClose}
                  type="button"
                  style={themeService(ButtonStyle.commonButton)}
                >
                  {languageService("Close")}
                </button>
              </div>
            ) : (
              <div style={{ float: "right", marginRight: "21px" }}>
                <button
                  className="setPasswordButton"
                  onClick={this.submitAlertForm}
                  type="button"
                  style={themeService(ButtonStyle.commonButton)}
                >
                  {`${languageService("Save")} ${languageService("Alert")}`}
                </button>
                <button
                  className="setPasswordButton"
                  onClick={() => this.props.handleAction({ type: "cancel" })}
                  type="button"
                  style={themeService(ButtonStyle.commonButton)}
                >
                  {languageService("Cancel")}
                </button>
              </div>
            )}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

AlertSetupForm.defaultProps = {
  fields: [],
};

export default AlertSetupForm;
