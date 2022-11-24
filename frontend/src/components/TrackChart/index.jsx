/* eslint eqeqeq: 0 */

import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import moment from "moment";
import _ from "lodash";
import { toast } from "react-toastify";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import { languageService } from "../../Language/language.service";
import { LineView } from "components/Maintenance/LineView";
import { getMultiLineData } from "reduxRelated/actions/lineSelectionAction";
import { getAssetLinesWithSelf, getInspectableAssets } from "../../reduxRelated/actions/assetHelperAction";
import { getWorkOrders } from "../../reduxRelated/actions/workorderActions";
import { updateFilterState } from "reduxRelated/actions/filterStateAction";
import { maintenanceTemplate } from "../../templates/MaintenanceTemplate";
import { themeService } from "../../theme/service/activeTheme.service";
import MenuFilter from "components/Common/MenuFilters";
import { getStatusColor } from "utils/statusColors";
import { userListByGroupRequest, userListRequest } from "../../reduxRelated/actions/userActions";
class TrackChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      maintenanceList: [],
      filterData: [],
      addModal: false,
      selectedMaintenance: null,
      confirmationDialog: false,
      modalState: "",
      actionType: "",
      spinnerLoading: false,
      summaryShowHide: true,

      lineNames: [],
      assetChildren: null,
      fromDashboard: null,
      rangeState: null,
      dateFilterName: "Month",
      activeSummary: "Total",
      usersActionType: "",

      summaryValue: { first: 0, second: 0, third: 0, fourth: 0, sixth: 0, seventh: 0 },

      listFilter: this.props.planFilter,

      tooltip: null,

      dateSelectionDialog: false,
      dateSelectionAction: "",
      filters: [
        { text: "Due Date", state: false, logic: 1 },
        { text: "Created", state: false, logic: 1 },
      ],
      lineFilters: [{ text: "Line's", state: false, logic: 2 }],
      filterDateText: "",
      lineSelectionDialog: false,
      linearDataSort: "",
      pmModal: false,
      // meModal: false,
      // mcModal: false,
      maintenanceToPlan: {},
      // maintenanceToExecute: {},
      // maintenanceToClose: {},
      notStartedWorkOrders: [],

      maintenanceTypes: [],
      displayMenuAll: true,
    };

    this.summaryLabels = {
      first: "Total",
      second: maintenanceTemplate.notPlanned.label,
      third: maintenanceTemplate.inProgress.label,
      fourth: maintenanceTemplate.planned.label,
      sixth: maintenanceTemplate.closed.label,
      seventh: maintenanceTemplate.planning.label,
    };

    this.summaryDesc = {
      ...this.summaryLabels,
      second: languageService(maintenanceTemplate.notPlanned.detailLabel),
      third: languageService(maintenanceTemplate.inProgress.label),
      fourth: languageService(maintenanceTemplate.planned.label),
      sixth: languageService(maintenanceTemplate.closed.label),
      seventh: languageService(maintenanceTemplate.planning.label),
    };

    this.rowColorMap = [
      { fieldName: "status", value: maintenanceTemplate.notPlanned.label, textColor: getStatusColor(maintenanceTemplate.notPlanned.label) },
      { fieldName: "status", value: maintenanceTemplate.inProgress.label, textColor: getStatusColor(maintenanceTemplate.inProgress.label) },
      { fieldName: "status", value: maintenanceTemplate.planned.label, textColor: getStatusColor(maintenanceTemplate.planned.label) },
      { fieldName: "status", value: maintenanceTemplate.closed.label, textColor: getStatusColor(maintenanceTemplate.closed.label) },
      { fieldName: "status", value: maintenanceTemplate.planning.label, textColor: getStatusColor(maintenanceTemplate.planning.label) },
    ];

    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleDateSelectionClick = this.handleDateSelectionClick.bind(this);

    this.handleLinearMaintenanceSortSelect = this.handleLinearMaintenanceSortSelect.bind(this);
    this.handleLineMaintenanceClick = this.handleLineMaintenanceClick.bind(this);

    this.menuFilterApplied = this.menuFilterApplied.bind(this);
    this.handelMenuClickData = this.handelMenuClickData.bind(this);
    this.handleUpdateFilterState = this.handleUpdateFilterState.bind(this);

    this.handlePageSize = this.handlePageSize.bind(this);
  }

  componentDidMount() {
    this.props.userListRequest();
    this.props.getInspectableAssets();
    //if(this.props.lineAssets.length===0)
    this.props.getAssetLinesWithSelf();
    this.props.getMaintenances();
    this.props.getWorkOrders();
    this.props.getApplicationlookupss(["maintenanceTypes", "crewSkills", "equipmentTypes", "materialTypes"]); //, "crewSkills", "equipmentTypes", "materialTypes"]);
    //this.props.updateFilterState("workOrderFilters", {}); // other filter to maintain here
  }
  getFilteredPropsList()
  {
    return this.props.maintenances.filter(m=>{return m.status==="Closed";});
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('maintenance actiontype:', this.props.actionType,this.props.lineSelectionActionType, this.props);
    if (
      prevProps.maintenanceActionType !== this.props.maintenanceActionType &&
      this.props.maintenanceActionType == "MAINTENANCES_READ_SUCCESS"
    ) {
      // if (this.maintenanceFilter.assetChildren) {
      //   this.handelMenuClickData(this.state.assetChildren, "", this.state.lineNames);
      // } else {
      //let sumval = this.calculateSummaryData(this.props.maintenances);
      let maintenanceList = this.getFilteredPropsList();
      let sumval = this.calculateSummaryDataCalculated(maintenanceList, this.state.assetChildren, this.state.activeSummary);
      this.setState({
        summaryValue: sumval.sumval,
        maintenanceList: maintenanceList, //this.props.maintenances,
        filterData: sumval.filterData,
      });
      // }
    }

    if (prevProps.workorderActionType !== this.props.workorderActionType && this.props.workorderActionType === "WORKORDERS_READ_SUCCESS") {
      this.setNotStartedWorkorders(this.props.workorders);
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType === "APPLICATIONLOOKUPSS_READ_SUCCESS"
    ) {
      this.setApplicationLists(this.props.applicationlookupss);
    }
  }
  handleUpdateFilterState(propertiesToUpdate) {
    let maintenanceFilter = this.props.maintenanceFilter ? this.props.maintenanceFilter : {};

    // this.props.updateFilterState("trackChartFilter", {
    //   ...maintenanceFilter,
    //   ...propertiesToUpdate,
    // });
  }
  menuFilterApplied(assetChildren, options) {
    this.setState({ lineNames: [...options], assetChildren });
    // this.handleUpdateFilterState({ assetChildren: assetChildren, lineNames: [...options] });
  }
  handelMenuClickData(assetChildren, displayMenuAll, lineNames) {
    let maintenanceToShow = [];
    this.state.maintenanceList.forEach((maintenance) => {
      let checkMenuFilterAllowed = _.find(assetChildren, { state: true, id: maintenance.lineId });
      if (checkMenuFilterAllowed) {
        maintenanceToShow.push(maintenance);
      }
    });

    // this.handleUpdateFilterState({
    //   assetChildren,
    //   lineNames,
    // });
    let sumval = this.calculateSummaryData(maintenanceToShow);
    this.setState({
      summaryValue: sumval,
      filterData: maintenanceToShow,
    });
  }
  handlePageSize(pageSize) {
    // this.handleUpdateFilterState({
    //   pageSize,
    // });
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

  calculateSummaryData(maintenancesData) {
    let sumVal = {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      sixth: 0,
      seventh: 0,
    };
    sumVal.first = maintenancesData.length;

    maintenancesData.forEach((m) => {
      if (m.status == "New") {
        sumVal.second++;
      } else if (m.status == "In Progress") {
        sumVal.third++;
      } else if (m.status == "Planned") {
        sumVal.fourth++;
      } else if (m.status == "Closed") {
        sumVal.sixth++;
      } else if (m.status == "Planning") {
        sumVal.seventh++;
      }
    });
    return sumVal;
  }
  calculateSummaryDataCalculated(maintenancesData, assetChildren, activeSummary) {
    //let children = [];
    let filterData = [];
    // assetChildren.forEach((child, index) => {
    //   children = [...children, ...child];
    // });

    let maintenanceToShow = [];
    if (assetChildren) {
      maintenancesData.forEach((maintenance) => {
        let checkMenuFilterAllowed = _.find(assetChildren, { state: true, id: maintenance.lineId });
        if (checkMenuFilterAllowed){// && maintenance && maintenance.status == "Closed") {
          maintenanceToShow.push(maintenance);
        }
      });
    } // todo: fix this the right way. if you press F5 on the page the asset children is null so no maintenace is displayed
    else {
      maintenanceToShow = maintenancesData;
    }

    // this.handleUpdateFilterState({
    //   assetChildren,
    //   activeSummary,
    // });
    let sumval = this.calculateSummaryData(maintenanceToShow);
    if (activeSummary !== this.summaryLabels.first) {
      filterData = maintenanceToShow.filter((el) => el.status == activeSummary);
    } else {
      filterData = [...maintenanceToShow];
    }
    return { sumval, maintenances: maintenanceToShow, filterData };
  }
  setNotStartedWorkorders(notStartedWorkOrders) {
    this.setState({ notStartedWorkOrders: notStartedWorkOrders });
    //console.log('not started workorders', notStartedWorkOrders);
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
  setApplicationLists(lists) {
    if (lists && lists.length) {
      let maintenanceTypes = this.getListType("maintenanceTypes", lists);
      // let crewSkills = this.getListType("crewSkills", lists);
      // let equipmentTypes = this.getListType("equipmentTypes", lists);
      // let materialTypes = this.getListType("materialTypes", lists);

      this.setState({ maintenanceTypes: maintenanceTypes }); //, crewSkills: crewSkills, equipmentTypes: equipmentTypes, materialTypes: materialTypes});
    }
  }
  handleFilterClick(filter) {
    if (filter.logic == 1) {
      if (filter.state) {
        this.setState({
          dateSelectionDialog: true,
          dateSelectionAction: filter.text,
        });
      } else {
        this.clearAllDateFilters();
      }
    } else if (filter.state && filter.logic == 2) {
      this.setState({
        lineSelectionDialog: true,
      });
      this.openModelMethod();
    } else {
      this.clearLineFilter();
    }
  }
  filterData(dataCollection, key, from, to, isEqual = null, isGreater = null, isLess = null) {
    if (!isGreater)
      isGreater = (a, b) => {
        return a > b;
      };
    if (!isLess)
      isLess = (a, b) => {
        return a < b;
      };
    if (!isEqual)
      isEqual = (a, b) => {
        return a === b;
      };

    if (to == undefined) to = from;

    let filteredData = dataCollection.filter((d) => {
      let grt = isGreater(d[key], from);
      let eqf = isEqual(d[key], from);
      let lst = isLess(d[key], to);
      let eqt = isEqual(d[key], to);

      return d && d.hasOwnProperty(key) && (grt || eqf) && (lst || eqt);
      //(d[key]>=from && d[key]<=to));
    });

    return filteredData;
  }
  handleDateSelectionClick(range) {
    let action = this.state.dateSelectionAction;
    let allData = this.getFilteredPropsList();//this.props.maintenances;
    if (this.state.lineFilters[0].state) {
      allData = this.props.multiData;
    }
    let cols = [];
    cols["Due Date"] = "dueDate";
    cols["Created"] = "createdAt";
    if (cols[action] == undefined) {
      return;
    }
    //console.log(cols);
    allData = this.filterData(
      allData,
      cols[action],
      range.from,
      range.to,
      (a, b) => {
        return moment(a).isSame(b, "day");
      },
      (a, b) => {
        return moment(a).isAfter(b, "day");
      },
      (a, b) => {
        return moment(a).isBefore(b, "day");
      },
    );

    let filterDateText = "";
    if (range && range.from != undefined) {
      filterDateText = range.from.toLocaleDateString("en-US");

      if (range.to != undefined && range.from.getTime() != range.to.getTime()) {
        filterDateText += " to " + range.to.toLocaleDateString("en-US");
      }
    }

    let sumval = this.calculateSummaryData(allData);
    // this.handleUpdateFilterState({
    //   summaryValue: sumval,
    // });
    this.setState({
      summaryValue: sumval,
      dateSelectionDialog: !this.state.dateSelectionDialog,
      filterDateText: filterDateText,
      maintenanceList: allData,
      dateRange: range,
      filterData: allData,
    });
  }
  clearAllDateFilters(additionalState = null) {
    let allData = this.getFilteredPropsList();//this.props.maintenances;
    if (this.state.lineFilters[0].state) {
      allData = this.props.multiData;
    }
    let sumval = this.calculateSummaryData(allData);

    let st = {
      filterDateText: "",
      summaryValue: sumval,
      maintenanceList: allData,
    };

    if (additionalState) {
      st = Object.assign(st, additionalState);
    }
    this.setState(st);
  }

  clearLineFilter() {
    if (this.state.filterDateText) {
      let lineFilters = _.cloneDeep(this.state.lineFilters);
      for (let lineFilter of lineFilters) {
        lineFilter.state = false;
      }
      let newobj = [...this.state.maintenanceList];
      _.remove(newobj, (mntnce) => {
        return mntnce.lineId !== this.props.selectedLine._id;
      });
      let sumval = this.calculateSummaryData(newobj);
      // this.handleUpdateFilterState({
      //   summaryValue: sumval,
      // });
      this.setState({
        maintenanceList: newobj,
        filterData: newobj,
        summaryValue: sumval,
      });
    }
    //else {
    //   //if (this.props.selectedLine._id) {
    //     //  this.props.getRunOfLines(this.props.selectedLine._id)
    //     this.props.getMaintenances();//this.props.selectedLine._id);
    //   //} else {
    //    // this.props.history.push("/line/maintenancebacklog");
    //   //}
    // }
  }

  getMPLocation(Locs) {
    let l =
      !Locs || Locs.length == 0
        ? { start: 0, end: 0 }
        : Locs[0].type === "Milepost"
        ? Locs[0]
        : Locs.length > 1 && Locs[1].type === "Milepost"
        ? Locs[1]
        : { start: 0, end: 0 }; //null;
    return l;
  }

  handleLineMaintenanceClick(cm, opt = "item") {
    if (opt === "title") {
      let m1 = this.state.maintenanceList.find((m1) => {
        return m1.mrNumber === cm;
      });
      if (m1) {
        this.props.history.push("/maintenancebacklogs/" + m1._id);
      }
      return;
    }
    this.props.history.push("/maintenancebacklogs/" + cm);
  }
  handleLinearMaintenanceSortSelect(sort) {
    if (sort.state) {
      let maintenances = _.cloneDeep(this.state.maintenanceList);
      maintenances = _.sortBy(maintenances, [
        (o) => {
          return this.getMPLocation(o.location).start;
        },
      ]);
      this.setState({ maintenanceList: maintenances, linearDataSort: sort.text, filterData: maintenances });
    } else {
      let maintenances = _.cloneDeep(this.state.maintenanceList);
      maintenances = _.sortBy(maintenances, [
        (o) => {
          return o.createdAt;
        },
      ]);
      this.setState({ maintenanceList: maintenances, linearDataSort: "", filterData: maintenances });
    }
  }

  render() {
    const { path } = this.props.match;
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <Col id="mainContent" md="12">
        {modelRendered}
        <Row>
          <Col md={12}>
            <MenuFilter
              menuFilterApplied={this.menuFilterApplied}
              handelMenuClickData={this.handelMenuClickData}
              displayMenuAll={this.state.displayMenuAll}
              assetChildren={this.state.assetChildren}
              lineNames={this.state.lineNames}
            ></MenuFilter>
          </Col>
        </Row>
        <Row
          style={{
            transition: "all .3s ease-in-out",
            opacity: this.state.summaryShowHide ? "1" : "0",
            height: this.state.summaryShowHide ? "60px" : "0",
          }}
        >
          <Col md="12">
            <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Track Chart")}</h4>
            </div>
          </Col>
        </Row>
        <Col md="12">
          <LineView
            sort={this.state.linearDataSort}
            list={this.state.filterData}
            range={{ start: this.props.selectedLine.start, end: this.props.selectedLine.end }}
            handleClick={this.handleLinearMaintenanceSortSelect}
            linesList={this.props.lineAssets}
            onClick={this.handleLineMaintenanceClick}
            allowTitleClick
          />
        </Col>
      </Col>
    );
  }
}

let variables = {
  maintenanceReducer: { maintenances: [] },
  userReducer: {
    userList: [],
    userListByGroup: [],
  },
  utilReducer: {
    planFilter: "today",
  },
  lineSelectionReducer: {
    selectedLine: {},
    multiData: [],
  },
  assetHelperReducer: {
    lineAssets: [],
    inspectableUserAssets: [],
  },
  workorderReducer: { workorders: [] },
  filterStateReducer: {
    workOrderFilters: null,
    maintenanceFilter: null,
  },

  applicationlookupsReducer: { applicationlookupss: [] },
};
const getApplicationlookupss = curdActions.getApplicationlookupss;
const getMaintenances = curdActions.getMaintenances;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    userListRequest,
    userListByGroupRequest,
    getMultiLineData,
    getAssetLinesWithSelf,
    getInspectableAssets,
    getWorkOrders,
    updateFilterState,
    getApplicationlookupss,
    getMaintenances,
  },
};
let MaintenanceContainer = CRUDFunction(TrackChart, "trackChart", actionOptions, variables, [
  "utilReducer",
  "lineSelectionReducer",
  "userReducer",
  "assetHelperReducer",
  "workorderReducer",
  "filterStateReducer",
  "applicationlookupsReducer",
  "maintenanceReducer",
]);
export default MaintenanceContainer;
function removeViewChangers(list, itemTitle) {
  let filteredList = _.cloneDeep(list);
  if (itemTitle) {
    _.remove(filteredList, { title: itemTitle });
  }
  return filteredList;
}
