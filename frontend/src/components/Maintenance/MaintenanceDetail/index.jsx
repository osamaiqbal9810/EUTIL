import React, { Component } from "react";
import { Row, Col, Label, Button } from "reactstrap";
import Gravatar from "react-gravatar";
import DayPicker, { DateUtils } from "react-day-picker";
import moment from "moment";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "components/Common/Buttons";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
//import './calanderStyle.css'
import { guid } from "utils/UUID";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import { circle } from "react-icons-kit/fa/circle";
import { ic_arrow_back } from "react-icons-kit/md/ic_arrow_back";
import { ic_gps_fixed } from "react-icons-kit/md/ic_gps_fixed";
import { Link, Route } from "react-router-dom";
import { directions } from "react-icons-kit/typicons/directions";
import { uploadImgs } from "reduxRelated/actions/imgsUpload.js";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import { CRUDFunction } from "reduxCURD/container";
import { commonReducers } from "reduxCURD/reducer";
import { curdActions } from "reduxCURD/actions";
import { ButtonMain } from "components/Common/Buttons";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip } from "reactstrap";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
import SpinnerLoader from "components/Common/SpinnerLoader";
import MapBox from "components/GISMAP";
import GISDisplayModal from "components/GISMAP/GISDisplayModal";
import InputSelectOptionField from "components/Common/Forms/InputSelectOptionField";
import CommonModal from "components/Common/CommonModal";
//import PlanMaintenanceForm from "./../Plan";
import { userListByGroupRequest, userListRequest } from "../../../reduxRelated/actions/userActions";
//import MaintenanceCloseForm from "./../MaintenanceClose";
//import MaintenanceExecuteForm from "./../MaintenanceExecute";

import { substractObjects } from "utils/utils";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import ImageArea from "components/Common/ImageArea";
import EditableTable from "components/Common/EditableTable";
import { languageService } from "../../../Language/language.service";
import AudioArea from "./AudioComponent/AudioArea";
import Detail from "./MaintenanceDetail";
import DefectCodes from "components/IssuesReports/DefectCodes/DefectCodes";
import DocumentsArea from "../../Common/documentsArea";
import permissionCheck from "utils/permissionCheck.js";
import EstimateHistoryModal from "./EstimateHistoryModal";
import { themeService } from "../../../theme/service/activeTheme.service";
import { commonStyles } from "../../../theme/commonStyles";
import { maintenaceDetailstyle } from "../styles/maintenanceDetailstyle";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { getAssetLinesWithSelf } from "../../../reduxRelated/actions/assetHelperAction";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import ExecDetail from "./ExecutionDetail";
import { LocPrefixService } from "../../LocationPrefixEditor/LocationPrefixService";

class MaintenanceDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //   spinnerLoading: false
      maintenance: {},
      lineAsset: {},
      spinnerLoading: false,
      gisDisplay: true,
      estimateTableOptions: {},
      //estimateData: estimateData,
      // pmModal: false,
      // meModal: false,
      // mcModal: false,
      maintenanceDefectCodesObj: null,
      crewSkills: [],
      classToShow: "d-none",
      displayTitle: languageService("Show Inactive"),
      equipmentTypes: [],
      materialTypes: [],
      estimateHistoryModal: false,
      viewStatus: 1,
      mExecution: null,
    };

    this.backup = new Map();
    this.savedMaintenanceForEstimate = null;

    const permissionColActions = { immediate: [], editMode: [] };
    permissionCheck("MAINTENANCE ESTIMATE", "update") && permissionColActions.immediate.push(languageService("Edit"));
    permissionCheck("MAINTENANCE ESTIMATE", "delete") && permissionColActions.immediate.push(languageService("Delete"));
    permissionColActions.editMode.push(languageService("Save"));
    permissionColActions.editMode.push(languageService("Close"));
    //permissionColActions.editMode.push()
    this.state.estimateColumns = [
      {
        id: "resource",
        header: languageService("Resource"),
        type: "text",
        field: "resource",
        editable: true,
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
    ];

    this.handleMaintenanceLocationClick = this.handleMaintenanceLocationClick.bind(this);
    this.handleEstimateActionClick = this.handleEstimateActionClick.bind(this);
    this.handleEstimateChangeClick = this.handleEstimateChangeClick.bind(this);
    this.addEstimateRowClick = this.addEstimateRowClick.bind(this);
    this.viewEstimateChangeHistory = this.viewEstimateChangeHistory.bind(this);
    this.handleDefectCode = this.handleDefectCode.bind(this);
    this.isDefectCodeButtonToShow = this.isDefectCodeButtonToShow.bind(this);
    this.handleStatusClick = this.handleStatusClick.bind(this);
    this.getUserDisplay = this.getUserDisplay.bind(this);
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
      this.setState({ maintenance: m, maintenanceDefectCodesObj: { unit: m.asset, defectCodes: m.defectCodes } }, () => {
        let milePostAsset = m.location && m.location.length ? m.location.findIndex((l) => l.type === "Milepost") : null;

        this.handleMaintenanceLocationClick(milePostAsset);
      });

      if (m.status === "In Progress" || m.status === "Closed") {
        this.disableAddEstimate();
      }
      if (m.executions && m.executions.length > 0) {
        let execId = null;
        m.executions.forEach((exc) => {
          if (!execId && exc) {
            execId = exc;
          }
        });
        this.props.getJourneyPlan(execId);
      }
    }
    if (
      this.props.journeyPlanActionType == "JOURNEYPLAN_READ_SUCCESS" &&
      this.props.journeyPlanActionType !== prevProps.journeyPlanActionType
    ) {
      let mExecs = null;
      if (
        this.props.journeyPlan &&
        this.props.journeyPlan.tasks &&
        this.props.journeyPlan.tasks[0] &&
        this.props.journeyPlan.tasks[0].maintenance &&
        this.props.journeyPlan.tasks[0].maintenance.length > 0
      ) {
        mExecs = this.props.journeyPlan.tasks[0].maintenance;
      }
      if (mExecs) {
        let mExec = _.find(mExecs, (m) => {
          return this.state.maintenance._id == m._id;
        });
        if (mExec && mExec.startMp && mExec.endMp) {
          mExec.startMP = mExec.startMp;
          mExec.endMP = mExec.endMp;
          mExec.prefixStart = LocPrefixService.getPrefixMp(mExec.startMp, this.state.maintenance.lineId);
          mExec.prefixEnd = LocPrefixService.getPrefixMp(mExec.endMp, this.state.maintenance.lineId);
          this.setState({ mExecution: mExec });
        }
      }
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
  showToastInfo(message) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  showToastError(message, error) {
    let toastMessage = message + ": " + error;
    if (!error) {
      toastMessage = message;
    }

    toast.error(toastMessage, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  async componentDidMount() {
    await this.props.getAssetLinesWithSelf();
    this.props.getMaintenance(this.props.match.params.id);
    this.props.userListRequest();

    if (this.props.assetTypes.length == 0) {
      this.props.getAssetType();
    }

    this.props.getApplicationlookupss(["crewSkills", "equipmentTypes", "materialTypes"]);
  }
  getListType(listName, lists) {
    let list = lists.filter((v) => {
      return v.listName === listName;
    });
    list = list.map((v) => {
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

      let col = estimateColumns.find((c) => {
        return c.id === "resource";
      });

      crewSkills = this.makeAddable("Crew Types:", crewSkills);
      equipmentTypes = this.makeAddable("Equipment Types:", equipmentTypes);
      materialTypes = this.makeAddable("Material Types:", materialTypes);

      col.possibleValues = [...crewSkills, ...equipmentTypes, ...materialTypes];

      this.setState({ estimateColumns: estimateColumns });
    }
  }
  uploadImgs(img) {
    this.props.uploadImgs(img);
  }
  handleMaintenanceLocationClick(index) {
    let selectedAsset = { start: 5, end: 5, icon: "circle-stroked-15" };
    let location = this.state.maintenance.location ? this.state.maintenance.location[index] : null;

    if (!location) return false;

    let line = null,
      enableDisplay = true;

    // console.log('handleMaintenanceLocationClick', {index}, this.state.maintenance.location[index]);
    //console.log(obj.target, obj.prop, obj.value);
    if (location.type == "GPS") {
      selectedAsset = { type: "GPS", start: location.start, end: location.end };
    } else if (location.type == "Milepost") {
      selectedAsset.start = location.start;
      selectedAsset.end = location.end;
      selectedAsset.text = location.unitId;
      selectedAsset.visible = true;
      selectedAsset._id = location._id;
      selectedAsset.sPrefix = LocPrefixService.getPrefixMp(location.start, this.state.maintenance.lineId);
      selectedAsset.ePrefix = LocPrefixService.getPrefixMp(location.end, this.state.maintenance.lineId);
      // selectedAsset. = offset,
      if (this.props.lineAssets && this.state.maintenance && this.state.maintenance.lineId) {
        line = this.props.lineAssets.find((l) => {
          return l._id == this.state.maintenance.lineId;
        });
      } else enableDisplay = false;
    }
    // if(selectedAsset!={}) // todo enable this
    let m = { ...this.state.maintenance };
    m.location[index].sPrefix = LocPrefixService.getPrefixMp(m.location[index].start, this.state.maintenance.lineId);
    m.location[index].ePrefix = LocPrefixService.getPrefixMp(m.location[index].end, this.state.maintenance.lineId);
    this.setState({ maintenance: m, gisDisplay: enableDisplay, selectedAsset: selectedAsset, lineAsset: line });
  }
  makeEstimateHistoryRecord(
    action,
    changedData,
    previousData, // log following:  timestamp, user, action, currentChange, previousData
  ) {
    if (this.state.maintenance) {
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
    }
    return null;
  }
  handleEstimateActionClick(action, obj) {
    let estimateData = _.cloneDeep(this.state.maintenance.estimate); //this.state.estimateData);
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
        } else if (action === languageService("Cancel")) {
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

        let m1 = _.cloneDeep(this.state.maintenance);
        m1.estimate = estimateData;
        this.setState({ maintenance: m1 }); //estimateData: estimateData });

        if (dirty) {
          let m2 = _.cloneDeep(m1);
          let estimate = m2.estimate.filter((e) => {
            return !e.editMode;
          });
          m2.estimate = estimate;

          for (let d1 of m2.estimate) delete d1.editMode;

          if (m2.estimate.length !== m1.estimate.length) this.savedMaintenanceForEstimate = m1;

          if (estimateHistoryRecord) {
            let newHistoryRecord = [];

            if (m2.estimateHistoryRecord) newHistoryRecord = _.cloneDeep(m2.estimateHistoryRecord);

            newHistoryRecord.push(estimateHistoryRecord);
            m2.estimateHistoryRecord = newHistoryRecord;
          }

          !cancelled && this.props.updateMaintenance(m2);
        }
        break;
      }
      index++;
    }
  }
  handleEstimateChangeClick(name, value, obj) {
    //console.log("estimate change", name, "=", value, "in", obj);
    let estimateData = _.cloneDeep(this.state.maintenance.estimate); //this.state.estimateData);

    for (let ed of estimateData) {
      if (ed.id == obj.id) {
        ed[name] = value;
        let m1 = _.cloneDeep(this.state.maintenance);
        m1.estimate = estimateData;

        this.setState({ maintenance: m1 }); //estimateData: estimateData });
        break;
      }
    }
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
  viewEstimateChangeHistory() {
    this.setState({ estimateHistoryModal: true });
  }
  addEstimateRowClick(e) {
    let estimateData = _.cloneDeep(this.state.maintenance.estimate); //estimateData);
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
    let m1 = _.cloneDeep(this.state.maintenance);
    m1.estimate = estimateData;
    this.setState({ maintenance: m1 });
  }
  disableAddEstimate() {
    let estimateColumns = _.cloneDeep(this.state.estimateColumns);

    for (let i = 0; i < estimateColumns.length; i++) {
      let ec = estimateColumns[i];
      if (ec.id === "actions") {
        estimateColumns.splice(i, 1);
        break;
      }
    }

    this.setState({ estimateColumns: estimateColumns });
  }
  getUserDisplay(user, exec) {
    let userName = "";
    let userEmail = "";
    let mExecution = this.props.journeyPlan;
    if (exec) {
      userName = mExecution.user.name;
      userEmail = mExecution.user.email;
    } else {
      userName = user.name;
      userEmail = user.email;
    }
    return (
      <div style={themeService(maintenaceDetailstyle.fieldText)}>
        <Gravatar style={{ borderRadius: "30px", marginRight: "5px" }} email={userEmail} size={20} /> {userName}
      </div>
    );
  }
  format2Digit(num) {
    return num && !isNaN(parseFloat(num)) ? parseFloat(num).toFixed(2) : "0.00";
  }
  formatLocation(l1, index, len) {
    let result = null;
    if (l1.type == "Marker") {
      result = (
        <div style={{ ...themeService(maintenaceDetailstyle.gpsIconTextStyle), ...{ paddingLeft: "45px" } }} key={l1.type}>
          {languageService("Marker") + ": " + l1.start + " - " + l1.end}
        </div>
      );
    } else if (l1.type != "none") {
      let formatstr = languageService(l1.type) + ": ",
        diff = substractObjects(l1.start, l1.end);
      let lat = l1.start.lat ? l1.start.lat.toString() : "";
      let lon = l1.start.lon ? l1.start.lon.toString() : "";
      formatstr += l1.type === "GPS" ? lat + ", " + lon : (l1.sPrefix ? l1.sPrefix : "") + this.format2Digit(l1.start);

      if (
        (typeof l1.end == "object" && l1.end != {} && Object.keys(diff).length != 0) ||
        (typeof l1.end != "object" && l1.end != "" && l1.start != l1.end)
      ) {
        let endLat = l1.end.lat ? l1.end.lat.toString() : "";
        let endLon = l1.end.lon ? l1.end.lon.toString() : "";
        formatstr += " -> ";
        formatstr += l1.type === "GPS" ? endLat + ", " + endLon : (l1.ePrefix ? l1.ePrefix : "") + this.format2Digit(l1.end);
      }

      let style = { ...themeService(maintenaceDetailstyle.gpsIconTextStyle) };

      if (index != len - 1) {
        style.borderBottom = "0px";
      }

      let isValidLocation = true;
      if (formatstr.includes("GPS: , ")) {
        formatstr = formatstr.replace("GPS: , ", "GPS: Not Available");
        isValidLocation = false;
      }

      result = (
        <div style={style} key={l1.type}>
          <button
            style={themeService(maintenaceDetailstyle.gpsIconStyle)}
            onClick={() => {
              if (isValidLocation) this.handleMaintenanceLocationClick(index);
            }}
          >
            <SvgIcon icon={ic_gps_fixed} size={18} />
          </button>
          {formatstr}
        </div>
      );
    }

    return result;
  }
  handleDefectCode() {
    this.setState({
      classToShow: this.state.classToShow == "d-none" ? "show" : "d-none",
      displayTitle:
        this.state.displayTitle == languageService("Hide Inactive") ? languageService("Show Inactive") : languageService("Hide Inactive"),
    });
  }
  findAssetTypeDefectsByName = () => {
    let at = null;
    let dc = null;
    const { maintenance } = this.state;
    const { assetTypes } = this.props;

    if (maintenance && maintenance.asset && assetTypes) at = assetTypes.find((a) => a.assetType === maintenance.asset.assetType);

    if (at && at.defectCodes) {
      dc = at.defectCodes.details;
    }

    return dc;
  };
  isDefectCodeButtonToShow() {
    let toShow = false;

    if (
      this.state.maintenanceDefectCodesObj &&
      this.state.maintenanceDefectCodesObj.defectCodes &&
      this.state.maintenanceDefectCodesObj.defectCodes.length > 0
    ) {
      let isFound = this.state.maintenanceDefectCodesObj.defectCodes.find((dc) => dc !== "");

      if (isFound) toShow = true;
    }

    return toShow;
  }
  handleStatusClick(status) {
    if (status !== this.state.viewStatus) {
      this.setState({
        viewStatus: status,
      });
    }
  }

  render() {
    let mainTitle = languageService("Work Order");
    let userName = "";
    let m1 = this.state.maintenance;
    let displayGIS = true;
    let m0 = this.state.mExecution;
    if (this.state.selectedAsset && this.state.selectedAsset.type != "GPS") {
      // if lineAsset is not there, do not display linear maintenance
      displayGIS = this.state.lineAsset && this.state.lineAsset._id;
    }

    if (!m1.createdBy) {
      m1 = {
        mrNumber: "",
        createdAt: "",
        createdBy: { name: "", email: "" },
        timestamp: "",
        sourceType: "",
        lineName: "",
        location: [{ start: "", end: "", type: "none" }],
        coordinates: [],
        markedOnSite: "",
        priority: "",
        defectCode: "",
      };
    } else {
      if (!m1.location) {
        m1.location = [{ start: "", end: "", type: "none" }];
      }
    }

    let LocationsComp = [];
    let len = m1.location.length;
    m1.location.forEach((l1, index) => {
      let r = this.formatLocation(l1, index, len);
      if (r != null) LocationsComp.push(r);
    });

    //let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />
    //console.log('asset type:',this.state.lineAsset.assetType )

    return (
      <div id="mainContent">
        <CommonModal
          headerText={languageService("Defect Codes")}
          setModalOpener={(method) => {
            this.openModelMethod = method;
          }}
          footerCancelText={languageService("Close")}
        >
          <button
            className="setPasswordButton"
            onClick={this.handleDefectCode}
            style={{ position: "absolute", top: "-45px", right: "20px", ...themeService(ButtonStyle.commonButton) }}
          >
            {this.state.displayTitle}
          </button>
          <DefectCodes
            classToShow={this.state.classToShow}
            selectedIssue={this.state.maintenanceDefectCodesObj}
            assetTypes={this.props.assetTypes}
          />
        </CommonModal>
        <ConfirmationDialog
          modal={this.state.confirmationDialog}
          toggle={this.handleConfirmationToggle}
          handleResponse={this.handleConfirmation}
          confirmationMessage={`${languageService("Are you sure you want to delete")}?`}
          headerText={languageService("Confirm Deletion")}
        />
        {/*
        <SimpleModalDialog modal={this.state.addEstimateDisplay} onclickHandler={this.addEditEstimateClick}/>
         */}
        {/* <GISDisplayModal modal={this.state.gisDisplay} toggle={this.handleGIStoggle} lineAsset={this.state.lineAsset} selectedAsset={this.state.selectedAsset} modalGISState={this.state.modalGISState}/>  */}

        {/* <CommonModal     setModalOpener={method => {
            this.openModelMethod = method;
          }}> */}
        {/* <EstimateHistoryModal
          modal={this.state.estimateHistoryModal}
          estimateHistory={this.state.maintenance.estimateHistoryRecord}
          toggle={(ms, wo) => {
            this.setState({ estimateHistoryModal: !this.state.estimateHistoryModal });
          }}
        /> */}
        <CommonModal
          headerText={languageService("Estimate History")}
          setModalOpener={(method) => {
            this.openEstimateHistoryModal = method;
          }}
          footerCancelText={languageService("Close")}
          modalStyle={{ maxWidth: "98vw" }}
        >
          <EstimateHistoryModal
            modal={this.state.estimateHistoryModal}
            estimateHistory={this.state.maintenance.estimateHistoryRecord}
            toggle={(ms, wo) => {
              this.setState({ estimateHistoryModal: !this.state.estimateHistoryModal });
            }}
          />
        </CommonModal>
        {/* </CommonModal> */}

        <Row style={{ borderBottom: "2px solid #d1d1d1", margin: "0px 30px", padding: "10px 0px" }}>
          <Col md="6" style={{ paddingLeft: "0px" }}>
            <div style={themeService(commonStyles.pageTitleDetailStyle)}>
              <Link to="/maintenancebacklog" className="linkStyleTable">
                <SvgIcon
                  size={25}
                  icon={ic_arrow_back}
                  style={{ marginRight: "5px", marginLeft: "5px", verticalAlign: "middle", cursor: "pointer" }}
                />
              </Link>
              <SvgIcon size={12} icon={circle} style={{ marginRight: "10px", marginLeft: "5px" }} />
              {mainTitle}
            </div>
          </Col>
        </Row>
        <Row style={{ margin: "0px" }}>
          <Col md="12">
            <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Work Order Detail")}</h4>
            </div>
          </Col>
          <Col md={"3"} style={{ padding: "0px" }}>
            <div
              className="maintenance-detail-box scrollbar"
              style={{ ...themeService(maintenaceDetailstyle.MaintenanceDetailsContainer), margin: "0 0 0 30px" }}
            >
              {this.state.mExecution && (
                <div style={{ margin: "10px 0px" }}>
                  <ToggleButton viewStatus={this.state.viewStatus} handleStatusClick={this.handleStatusClick} />
                </div>
              )}
              {this.state.viewStatus == 1 && (
                <React.Fragment>
                  <Detail
                    MaintenanceDetailsContainer={themeService(maintenaceDetailstyle.MaintenanceDetailsContainer)}
                    fieldHeading={themeService(maintenaceDetailstyle.fieldHeading)}
                    fieldText={themeService(maintenaceDetailstyle.fieldText)}
                    getUserDisplay={this.getUserDisplay}
                    m1={m1}
                  />

                  <Row>
                    <Col md="12">
                      <div style={themeService(maintenaceDetailstyle.fieldHeading)}> {languageService("Description")}: </div>
                      <div style={themeService(maintenaceDetailstyle.MaintenanceDescriptionContainer)}>
                        <div style={themeService(maintenaceDetailstyle.fieldText)}>{m1.description}</div>
                        <Row>
                          {m1.images && m1.images.length > 0 && (
                            <Col md="12">
                              <ImageArea path="applicationresources" imagesList={m1.images} />
                            </Col>
                          )}
                        </Row>
                        <Row>
                          {m1.images && m1.images.length > 0 && (
                            <Col md="12">
                              <DocumentsArea path="assetDocuments" documentList={m1.documents} allowClickDownload />
                            </Col>
                          )}
                        </Row>
                        <Row>
                          {m1.voices && m1.voices.length > 0 && (
                            <Col md="12">
                              <AudioArea audio={m1.voices} />
                            </Col>
                          )}
                        </Row>
                        <Row>
                          {this.isDefectCodeButtonToShow() &&
                            this.findAssetTypeDefectsByName() &&
                            this.findAssetTypeDefectsByName().length > 0 && (
                              <Col md="12">
                                <MyButton onClick={this.openModelMethod}>{languageService("Defect Codes")} :</MyButton>
                              </Col>
                            )}
                        </Row>
                      </div>
                      <Col md="12">
                        <Row>
                          {m1.assignedTo && (
                            <div>
                              <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Assigned To")} :</div>
                              <div style={themeService(maintenaceDetailstyle.fieldText)}>
                                {m1.assignedTo ? this.getUserDisplay(m1.assignedTo) : "No user"}
                              </div>
                            </div>
                          )}

                          {/* {m1.status === "New" && <MyButton onClick={this.onPlanNowClick}>{languageService("Plan Now")}</MyButton>}
                      {m1.status === "Planned" && <MyButton onClick={this.onExecuteClick}>{languageService("Execute")}</MyButton>}
                      {m1.status === "In Progress" && <MyButton onClick={this.onCloseClick}>{languageService("Close")}</MyButton>} */}

                          {(m1.status === "Closed" ||
                            m1.status === "Completed" ||
                            m1.status === "In Progress" ||
                            m1.status === "Planned") &&
                            m1.dueDate && (
                              <div>
                                <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Plan Date")}: </div>
                                <div style={themeService(maintenaceDetailstyle.fieldText)}>{moment(m1.dueDate).format("Y-MMMM-DD")}</div>
                              </div>
                            )}

                          {m1.executionDate && (
                            <div>
                              <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Execution Date")}: </div>
                              <div style={themeService(maintenaceDetailstyle.fieldText)}>
                                {moment(m1.executionDate).format("ddd, MMM DD, YYYY")}
                              </div>
                            </div>
                          )}

                          {m1.closedDate && (
                            <div>
                              <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Closed date")}: </div>
                              <div style={themeService(maintenaceDetailstyle.fieldText)}>
                                {moment(m1.closedDate).format("ddd, MMM DD, YYYY")}
                              </div>
                            </div>
                          )}
                        </Row>
                      </Col>
                    </Col>
                  </Row>
                </React.Fragment>
              )}
              {this.state.viewStatus == 2 && (
                <React.Fragment>
                  <ExecDetail
                    MaintenanceDetailsContainer={themeService(maintenaceDetailstyle.MaintenanceDetailsContainer)}
                    fieldHeading={themeService(maintenaceDetailstyle.fieldHeading)}
                    fieldText={themeService(maintenaceDetailstyle.fieldText)}
                    m0={m0}
                    m1={m1}
                  />
                  <Row>
                    <Col md="12">
                      <div style={themeService(maintenaceDetailstyle.fieldHeading)}> {languageService("Description")}: </div>
                      <div style={themeService(maintenaceDetailstyle.MaintenanceDescriptionContainer)}>
                        <div style={themeService(maintenaceDetailstyle.fieldText)}>{m1.description}</div>
                        <Row>
                          {m0.imgList && m0.imgList.length > 0 && (
                            <Col md="12">
                              <ImageArea path="applicationresources" imagesList={m0.imgList} />
                            </Col>
                          )}
                        </Row>
                        <Row>
                          {m0.voiceList && m0.voiceList.length > 0 && (
                            <Col md="12">
                              <AudioArea audio={m0.voiceList} />
                            </Col>
                          )}
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </React.Fragment>
              )}
            </div>
          </Col>
          <Col md={"9"} style={{ padding: "0px" }}>
            <div
              className="maintenance-detail-box scrollbar"
              style={{ ...themeService(maintenaceDetailstyle.MaintenanceDetailsContainer), minHeight: "470px", margin: "0 30px 0 5px" }}
            >
              {" "}
              {/* <Row>
                <Col md="12">
                  <PlanMaintenanceForm
                    maintenance={m1}
                    modal={this.state.pmModal}
                    userList={this.props.userList}
                    handleSubmitPlan={this.handleSubmitPMModalClick}
                    toggle={() => this.setState(({ pmModal }) => ({ pmModal: !pmModal }))}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <MaintenanceExecuteForm
                    maintenance={m1}
                    modal={this.state.meModal}
                    handleSubmit={this.handleSubmitMEModalClick}
                    toggle={() => this.setState(({ meModal }) => ({ meModal: !meModal }))}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <MaintenanceCloseForm
                    maintenance={m1}
                    modal={this.state.mcModal}
                    handleSubmit={this.handleSubmitMCModalClick}
                    toggle={() => this.setState(({ mcModal }) => ({ mcModal: !mcModal }))}
                  />
                </Col>
              </Row> */}
              <Row>
                <Col md={"12"}>
                  <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Location")}: </div>
                  <div style={{ marginBottom: "15px" }}>{LocationsComp}</div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div
                    style={{
                      boxShadow: "rgb(207, 207, 207) 3px 3px 5px",
                      minHeight: "510px",
                      width: "100%",
                      border: "1px solid #ccc",
                      margin: "0 4px",
                      background: "#efefef",
                    }}
                  >
                    {this.state.gisDisplay && displayGIS && (
                      <MapBox assets={{}} lineAsset={this.state.lineAsset} selectedAsset={this.state.selectedAsset} />
                    )}
                  </div>{" "}
                </Col>
              </Row>
            </div>
          </Col>
          <Col md="12">
            <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Work Order Estimate")}</h4>
            </div>
          </Col>
          <Col md="12">
            <EditableTable
              columns={this.state.estimateColumns}
              data={m1.estimate} //this.state.estimateData}
              handleActionClick={this.handleEstimateActionClick}
              onChange={this.handleEstimateChangeClick}
              options={this.state.estimateTableOptions}
              //noActionColumn={!this.state.estimateActionColumn}
            />
          </Col>
          <Col md="12" style={{ padding: "0px 30px" }}>
            {/*{m1.status !== "In Progress" && m1.status !== "Closed" && permissionCheck("MAINTENANCE ADD ESTIMATE", "view") && (*/}
            {/*<MyButton onClick={this.addEstimateRowClick}>{languageService("Add Estimate")}</MyButton>*/}
            {/*)}*/}

            {m1 && m1.estimateHistoryRecord && m1.estimateHistoryRecord.length > 0 && permissionCheck("MAINTENANCE CHANGE LOG", "view") && (
              <MyButton
                onClick={(e) => {
                  this.openEstimateHistoryModal && this.openEstimateHistoryModal();
                }}
              >
                {languageService("View Change Log")}
              </MyButton>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const getJourneyPlan = curdActions.getJourneyPlan;
// const updateJourneyPlan = curdActions.updateJourneyPlan
// const getTrack = curdActions.getTrack
const getMaintenance = curdActions.getMaintenance;
const getAssets = curdActions.getAssets;
const updateMaintenance = curdActions.updateMaintenance;
const getAssetType = curdActions.getAssetType;
const getApplicationlookupss = curdActions.getApplicationlookupss;

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: {
    getAssetType,
    getMaintenance,
    getAssetLinesWithSelf,
    getAssets,
    userListRequest,
    userListByGroupRequest,
    updateMaintenance,
    getApplicationlookupss,
    getJourneyPlan,
  }, //updateJourneyPlan, getTrack, uploadImgs, getAppMockupsTypes }
};

let variableList = {
  maintenanceReducer: { maintenance: "" },
  assetReducer: { assets: "" },
  lineSelectionReducer: { selectedLine: {} },
  assetHelperReducer: { lineAssets: [] },
  userReducer: {
    userList: [],
    userListByGroup: [],
  },
  assetTypeReducer: {
    assetTypes: [],
  },
  applicationlookupsReducer: { applicationlookupss: [] },
  journeyPlanReducer: { journeyPlan: null },
};

//journeyPlanReducer: { journeyPlan: '' }, trackReducer: { tracks: '' }, diagnosticsReducer: { assetTypes: '' } }
// console.log("Container Called")

const MaintenanceDetailContainer = CRUDFunction(MaintenanceDetail, "maintenancedetail", actionOptions, variableList, [
  "maintenanceReducer",
  "assetReducer",
  "lineSelectionReducer",
  "assetHelperReducer",
  "userReducer",
  "assetTypeReducer",
  "applicationlookupsReducer",
  "journeyPlanReducer",
]);

export default MaintenanceDetailContainer;

const ToggleButton = (props) => {
  return (
    <div style={{ display: "inline-block" }}>
      <div
        onClick={(e) => {
          props.handleStatusClick(1);
        }}
        style={{
          cursor: "pointer",
          display: "inline-block",
          borderRadius: "2px",
          padding: "7px 7px 7px 7px ",
          background: props.viewStatus == 1 ? "var(--twelve)" : "var(--fifth)",
          color:
            props.viewStatus == 1
              ? themeService({ retro: "var(--sixth)", electric: "var(--fifth)" })
              : themeService({ retro: "var(--sixth)", electric: "var(--sixth)" }),
          border: "1px solid",
          borderColor: props.viewStatus == 1 ? "var(--twelve)" : "grey",
        }}
      >
        {languageService("Work Order")}
      </div>
      <div
        onClick={(e) => {
          props.handleStatusClick(2);
        }}
        style={{
          cursor: "pointer",
          display: "inline-block",
          borderRadius: "2px",
          padding: "7px 7px 7px 7px ",
          background: props.viewStatus == 1 ? "var(--fifth)" : "var(--twelve)",
          color:
            props.viewStatus == 1
              ? themeService({ retro: "var(--sixth)", electric: "var(--sixth)" })
              : themeService({ retro: "var(--sixth)", electric: "var(--fifth)" }),
          border: "1px solid",
          borderColor: props.viewStatus == 1 ? "grey" : "var(--twelve)",
        }}
      >
        {languageService("Maintenance")}
      </div>
    </div>
  );
};
