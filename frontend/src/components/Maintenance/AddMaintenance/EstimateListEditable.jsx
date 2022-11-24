import React, { Component } from "react";
import EditableTable from "../../Common/EditableTable";
import { languageService } from "../../../Language/language.service";
import _ from "lodash";
import permissionCheck from "utils/permissionCheck.js";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import { substractObjects } from "utils/utils";
import { Col } from "reactstrap";
import { commonPageStyle } from "../../Common/Summary/styles/CommonPageStyle";
import { themeService } from "../../../theme/service/activeTheme.service";
import SvgIcon from "react-icons-kit";
import { ic_keyboard_arrow_down } from "react-icons-kit/md/ic_keyboard_arrow_down";
import { ic_keyboard_arrow_right } from "react-icons-kit/md/ic_keyboard_arrow_right";

class EstimateListEditable extends Component {
  constructor(props) {
    super(props);

    const permissionColActions = { immediate: [], editMode: [] };
    const customColumns = props.customColumns || [];
    permissionCheck("MAINTENANCE ESTIMATE", "update") && !props.disableEdit && permissionColActions.immediate.push(languageService("Edit"));
    permissionCheck("MAINTENANCE ESTIMATE", "delete") &&
      !props.disableEdit &&
      permissionColActions.immediate.push(languageService("Delete"));
    !props.disableEdit && permissionColActions.editMode.push(languageService("Save"));
    !props.disableEdit && permissionColActions.editMode.push(languageService("Close"));

    let estimateColumns = [
      {
        id: "resource",
        header: languageService("Resource"),
        type: "text",
        field: "resource",
        editable: true,
        accessor: props.workOrder
          ? d => {
              let expand = null;

              if (!d.expanded && d.mergedEstimate) {
                expand = (
                  <div
                    style={{
                      height: "100%",
                      display: "inline-block",
                      verticalAlign: "top",
                    }}
                    onClick={e => {
                      this.setState({ updateColumnToggle: !this.state.updateColumnToggle });
                      this.props.handleExpandClick(d);
                    }}
                  >
                    <SvgIcon size={20} icon={ic_keyboard_arrow_right} style={{ verticalAlign: "middle", height: "100%" }} />
                  </div>
                );
              } else {
                expand = (
                  <div
                    style={{
                      width: "2px",
                      height: "100%",
                    }}
                  />
                );
              }
              if (d.expanded) {
                expand = (
                  <div
                    style={{
                      height: "100%",
                      display: "inline-block",
                      verticalAlign: "top",
                    }}
                    onClick={e => {
                      this.setState({ updateColumnToggle: !this.state.updateColumnToggle });
                      this.props.handleContractClick(d);
                    }}
                  >
                    <SvgIcon size={20} icon={ic_keyboard_arrow_down} style={{ verticalAlign: "middle", height: "100%" }} />
                  </div>
                );
              }

              return (
                <div style={{ height: "100%" }}>
                  <div style={{ display: "inline-block", paddingRight: "5px", height: "100%", verticalAlign: "middle" }}>{expand}</div>
                  <div style={{ display: "inline-block", height: "100%", verticalAlign: "middle", lineHeight: "36px" }}>{d.resource} </div>
                </div>
              );
            }
          : undefined,
        possibleValues: [], // "---Heading---", "Laborer", "Welder", "Journey Man", "Flaggers", "Watchmen/Lookouts"],
      },
      {
        id: "count",
        header: languageService("How Many"),
        type: "text",
        field: "count",
        minWidth: 80,
        editable: true,
        possibleValues: ["1", "2", "3", "4", "5", "6", "7", "8"],
      },
      {
        id: "Date",
        header: languageService("Start Day"),
        type: "text",
        field: "day",
        minWidth: 80,
        editable: true,
        possibleValues: ["Day-1", "Day-2", "Day-3", "Day-4", "Day-5"],
      },
      {
        id: "Time",
        header: languageService("Start Time"),
        type: "text",
        field: "time",
        minWidth: 80,
        editable: true,
        possibleValues: ["7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"],
      },
      {
        id: "Loc",
        header: languageService("Start Location"),
        type: "text",
        field: "location",
        editable: true,
        possibleValues: ["", "Job-site A", "Job-Site B"],
      },
      {
        id: "eDate",
        header: languageService("End Day"),
        type: "text",
        field: "endDay",
        minWidth: 80,
        editable: true,
        possibleValues: ["Day-1", "Day-2", "Day-3", "Day-4", "Day-5"],
      },
      {
        id: "eTime",
        header: languageService("End Time"),
        type: "text",
        field: "endTime",
        minWidth: 80,
        editable: true,
        possibleValues: ["7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"],
      },
      {
        id: "eLoc",
        header: languageService("End Location"),
        type: "text",
        field: "endLocation",
        editable: true,
        possibleValues: ["", "Job-site A", "Job-Site B"],
      },
      { id: "Task", header: languageService("Task"), type: "text", field: "task", editable: true },
      { id: "assetId", header: languageService("Asset Id"), type: "text", field: "assetId", editable: true },
      ...customColumns,
      {
        id: "actions",
        header: languageService("Actions"),
        type: "action",
        ...permissionColActions,
      },
    ];

    if (props.disableActions) estimateColumns = estimateColumns.filter(estC => estC.id !== "actions");

    this.state = {
      maintenance: {},
      estimateColumns,
      estimateTableOptions: {},
      updateColumnToggle: false,
    };

    this.backup = new Map();
    this.savedMaintenanceForEstimate = null;

    this.addEstimateRowClick = this.addEstimateRowClick.bind(this);
    this.makeEstimateHistoryRecord = this.makeEstimateHistoryRecord.bind(this);
    this.handleEstimateActionClick = this.handleEstimateActionClick.bind(this);
    this.handleEstimateChangeClick = this.handleEstimateChangeClick.bind(this);
  }

  componentDidMount() {
    this.setState({ maintenance: this.props.ml });
    this.props.getApplicationlookupss(["crewSkills", "equipmentTypes", "materialTypes", "maintenanceTypes"]);
    this.setApplicationLists(this.props.applicationlookupss);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.maintenanceActionType == "MAINTENANCE_READ_SUCCESS" &&
      prevProps.maintenanceActionType != this.props.maintenanceActionType
    ) {
      // console.log(this.props.maintenance);
      // console.log(this.props);
      let m = _.cloneDeep(this.props.maintenance);
      if (!m.estimate) {
        m.estimate = [];
      }
      if (
        this.savedMaintenanceForEstimate &&
        this.savedMaintenanceForEstimate.mrNumber === m.mrNumber &&
        this.savedMaintenanceForEstimate.estimate.length !== m.estimate.length
      ) {
        m.estimate = this.savedMaintenanceForEstimate.estimate;
        this.savedMaintenanceForEstimate = null;
      }
      //console.log('maint1',m);
      this.setState({ maintenance: m });
    }

    if (
      this.props.maintenanceActionType == "MAINTENANCE_UPDATE_SUCCESS" &&
      prevProps.maintenanceActionType != this.props.maintenanceActionType
    ) {
      this.props.getMaintenance(this.state.maintenance._id);
    }

    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType === "APPLICATIONLOOKUPSS_READ_SUCCESS"
    ) {
      this.setApplicationLists(this.props.applicationlookupss);
    }
  }

  makeEstimateHistoryRecord(
    action,
    changedData,
    previousData, // log following:  timestamp, user, action, currentChange, previousData
  ) {
    // if (this.props.maintenance) {
    let changeLog = [],
      loggedInUser = localStorage.getItem("loggedInUser");

    let oldData = substractObjects(previousData, changedData);
    let newData = substractObjects(changedData, previousData);
    delete oldData.editMode;
    delete newData.editMode;
    let itemId =
      changedData && changedData.resource ? changedData.resource : previousData && previousData.resource ? previousData.resource : "";
    let esId = changedData && changedData.id ? changedData.id : previousData && previousData.id ? previousData.id : "";
    let useremail = "unknown";
    let userName = "";
    if (loggedInUser) {
      try {
        let userObj = JSON.parse(loggedInUser);
        if (userObj && userObj.email) {
          userName = userObj.name;
          useremail = userObj.email;
        }
      } catch (e) {
        console.log("user parse error", e.toString());
      }
    }

    return {
      timestamp: new Date(),
      user: useremail,
      userName: userName,
      action: action,
      item: itemId,
      newData: newData,
      oldData: oldData,
      rowId: esId,
    };
    // }
    // return null;
  }

  handleEstimateActionClick(action, obj) {
    let estimateData = _.cloneDeep(this.props.estimate); //this.state.estimateData);
    let deleteIndex = null,
      index = 0,
      dirty = false,
      estimateHistoryRecord = null;
    let cancelled = false;
    for (let ed of estimateData) {
      if (ed.id == obj.id) {
        if (action === languageService("Edit")) {
          let edc = _.cloneDeep(ed);
          this.backup.set(ed.id, edc); // backup data for cancel edit

          ed.editMode = true;
        } else if (action === languageService("Save")) {
          //if (!(ed.task.trim() === "" && ed.assetId.trim() === "")) { // JD wants to end this restriction
          ed.editMode = false;
          dirty = true;

          estimateHistoryRecord = this.makeEstimateHistoryRecord(
            this.backup.has(ed.id) ? "Changed" : "Added",
            ed,
            this.backup.has(ed.id) ? this.backup.get(ed.id) : {},
          );
          //}
        } else if (action === languageService("Close")) {
          cancelled = true;
          if (this.backup.has(ed.id)) {
            let edc = this.backup.get(ed.id);

            ed.editMode = edc.editMode;
            ed.count = edc.count;
            ed.resource = edc.resource;
            ed.day = edc.day;
            ed.time = edc.time;
            ed.location = edc.location;

            ed.endDay = edc.endDay;
            ed.endTime = edc.endTime;
            ed.endLocation = edc.endLocation;

            ed.task = edc.task;
            ed.assetId = edc.assetId;

            // ed.crew = edc.crew;
            // ed.rwp = edc.rwp;
            // ed.equipment = edc.equipment;
          } //delete this row because it's a new one
          else {
            deleteIndex = index;
          }
        } else if (action === languageService("Delete")) {
          deleteIndex = index;
          estimateHistoryRecord = this.makeEstimateHistoryRecord("Deleted", {}, ed);
        }

        if (deleteIndex != null) {
          estimateData.splice(deleteIndex, 1);
          dirty = true;
        }

        // let es1 = _.cloneDeep(this.props.estimate);
        // m1.estimate = estimateData;
        // this.setState({ maintenance: m1 }); //estimateData: estimateData });
        this.props.updateEstimate({ estimate: estimateData });
        if (dirty) {
          let es2 = _.cloneDeep(estimateData);
          let estimateHistoryRecord2 = _.cloneDeep(this.props.estimateHistoryRecord);
          es2 = es2.filter(e => {
            return !e.editMode;
          });

          for (let d1 of es2) delete d1.editMode;

          // if (es2.length !== estimateData.length) this.savedMaintenanceForEstimate = m1;

          if (estimateHistoryRecord) {
            let newHistoryRecord = [];
            if (estimateHistoryRecord2) newHistoryRecord = _.cloneDeep(estimateHistoryRecord2);

            newHistoryRecord.push(estimateHistoryRecord);
            estimateHistoryRecord2 = newHistoryRecord;
          }
          // this.setState({ maintenance: m2 });
          !cancelled && this.props.updateEstimate({ estimate: es2, estimateHistoryRecord: estimateHistoryRecord2 });
        }
        break;
      }
      index++;
    }
  }
  handleEstimateChangeClick(name, value, obj) {
    //console.log("estimate change", name, "=", value, "in", obj);
    let estimateData = _.cloneDeep(this.props.estimate); //this.state.estimateData);

    for (let ed of estimateData) {
      if (ed.id == obj.id) {
        ed[name] = value;
        // let m1 = _.cloneDeep(this.state.maintenance);
        // m1.estimate = estimateData;

        this.props.updateEstimate({ estimate: estimateData }); //estimateData: estimateData });
        break;
      }
    }
  }
  addEstimateRowClick(e) {
    let estimateData = _.cloneDeep(this.props.estimate); //estimateData);
    let maxId = 0;
    for (let ed of estimateData) {
      let id = +ed.id;
      if (id > maxId) maxId = id;
    }
    estimateData.push({
      editMode: true,
      id: maxId + 1 + "",
      count: this.getFirstValue("count"),
      resource: this.getFirstValue("resource"),
      day: this.getFirstValue("Date"),
      time: this.getFirstValue("Time"),
      location: this.getFirstValue("Loc"),

      endDay: this.getFirstValue("eDate"),
      endTime: this.getFirstValue("eTime"),
      endLocation: this.getFirstValue("eLoc"),

      task: this.getFirstValue("Task"),
      assetId: this.getFirstValue("assetId"),
      //crew: this.getFirstValue("Crew"),
      //rwp: this.getFirstValue("RWP"),
      //equipment: this.getFirstValue("Equi"),
    });
    // let m1 = _.cloneDeep(this.state.maintenance);
    // m1.estimate = estimateData;
    // this.setState({ maintenance: m1 });

    this.props.updateEstimate({ estimate: estimateData });
  }
  getFirstValue(id) {
    let cols = this.state.estimateColumns;
    for (let col of cols) {
      if (col.id === id && col.possibleValues && col.possibleValues.length > 1) {
        if (col.possibleValues[0].startsWith("---") && col.possibleValues[1]) return col.possibleValues[1];

        return col.possibleValues[0];
      }
    }
    return "";
  }

  getListType(listName, lists) {
    let list = lists.filter(v => {
      return v.listName === listName;
    });
    list = list.map(v => {
      return v.description;
    });

    return list;
  }

  makeAddable(header, list) {
    let retList = ["---" + header + "---", ...list];

    return retList;
  }

  setApplicationLists(lists) {
    if (lists && lists.length) {
      let estimateColumns = _.cloneDeep(this.state.estimateColumns);

      let crewSkills = this.getListType("crewSkills", lists);
      let equipmentTypes = this.getListType("equipmentTypes", lists);
      let materialTypes = this.getListType("materialTypes", lists);

      // fill the resource column

      let col = estimateColumns.find(c => {
        return c.id === "resource";
      });

      crewSkills = this.makeAddable("Crew Types:", crewSkills);
      equipmentTypes = this.makeAddable("Equipment Types:", equipmentTypes);
      materialTypes = this.makeAddable("Material Types:", materialTypes);

      col.possibleValues = [...crewSkills, ...equipmentTypes, ...materialTypes];

      this.setState({ estimateColumns: estimateColumns });
    }
  }

  renderEstimateButton(ml) {
    if (this.props.disableEdit) return null;

    if (!ml) {
      return (
        permissionCheck("MAINTENANCE ADD ESTIMATE", "create") && (
          <MyButton onClick={this.addEstimateRowClick}>{languageService("Add Estimate")}</MyButton>
        )
      );
    } else if (this.props.ml.status !== "Closed") {
      return (
        permissionCheck("MAINTENANCE ADD ESTIMATE", "create") && (
          <MyButton onClick={this.addEstimateRowClick}>{languageService("Add Estimate")}</MyButton>
        )
      );
    }

    return null;
  }

  render() {
    return (
      <React.Fragment>
        <Col md="12">
          <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
            <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>
              {languageService(this.props.title || "Work Order Estimate")}
            </h4>
          </div>
        </Col>
        <Col md={12}>
          <EditableTable
            columns={this.state.estimateColumns}
            data={this.props.estimate} //this.state.estimateData}
            handleActionClick={this.handleEstimateActionClick}
            onChange={this.handleEstimateChangeClick}
            options={this.state.estimateTableOptions}
            updateColumnToggle={this.state.updateColumnToggle}
          />
        </Col>
        <Col md="12" style={{ padding: "0px 30px" }}>
          {this.renderEstimateButton()}
        </Col>
      </React.Fragment>
    );
  }
}

export default EstimateListEditable;
