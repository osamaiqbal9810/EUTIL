/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import "./dropdown.css";
import { PlanningSummaryLinear } from "./PlanningSummary";
import { IssuesSummaryLinear } from "./IssuesSummary";
import MyPlanningTable from "./MyPlanningTable";
import IssuesReported from "./IssuesReported";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { savePageNum, clearPageNum } from "reduxRelated/actions/utilActions";
import { languageService } from "../../Language/language.service";
import SpinnerLoader from "components/Common/SpinnerLoader";
import LinesDataStackedBar from "components/Dashboard/LinesDataStackedBar";
import "./Dashboard.css";
import DataChartWrapper from "./DataChart/DataChartWrapper";
import MenuFilter from "components/Common/MenuFilters/index";
import moment from "moment";
import { updateFilterState } from "reduxRelated/actions/filterStateAction";
import { LIST_VIEW_SELECTION_TYPES } from "components/JourneyPlan/ViewSelection.js";
import { themeService } from "theme/service/activeTheme.service";
import { DashboardPageStyle } from "./styles/DashboardPageStyle";
import { commonStylesDashboard } from "./styles/commonStylesDashboard";
import { inspectionTemplate } from "../../templates/InspectionTemplate";
import { issueTemplate } from "../../templates/IssueTemplate";

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inspections: [],
      actionType: "",
      issuesData: [],
      sodList: [],
      workplans: [],

      summaryValueIssues: {
        total: 0,
        info: 0,
        low: 0,
        medium: 0,
        high: 0,
        pending: 0,
      },

      summaryValuePlan: { total: 0, upcoming: 0, inProgress: 0, missed: 0, overdue: 0, completed: 0 },
      listPage: 0,
      planFilter: "all",
      planPageSize: this.props.planPageSize,
      spinnerLoading: false,
      overAllData: {},
      assetChildren: [],
      displayMenuAll: true,
      issuesDataToShow: [],
      inspectionsDataToShow: [],
      currentMonth: moment(),
    };

    this.summaryLabels = {
      first: "Total",
      second: inspectionTemplate.overdue.label,
      third: inspectionTemplate.missed.label,
      fourth: inspectionTemplate.upcoming.secondVal,
      fifth: inspectionTemplate.inProgress.label,
      sixth: inspectionTemplate.completed.label,
    };
    this.summaryDesc = {
      first: languageService("Total Inspections"),
      second: languageService(inspectionTemplate.overdue.label),
      third: languageService(inspectionTemplate.missed.label),
      fourth: languageService(inspectionTemplate.upcoming.label),
      fifth: languageService(inspectionTemplate.inProgress.label),
      sixth: languageService(inspectionTemplate.completed.label),
    };

    this.summaryIssuesLabels = {
      first: "Total",
      second: issueTemplate.high.label,
      third: issueTemplate.medium.label,
      fourth: issueTemplate.low.label,
      fifth: issueTemplate.info.label,
      sixth: issueTemplate.pending.label,
    };

    this.summaryIssuesDesc = {
      first: languageService("Total Issues"),
      second: languageService(issueTemplate.high.detailLabel),
      third: languageService(issueTemplate.medium.detailLabel),
      fourth: languageService(issueTemplate.low.detailLabel),
      fifth: languageService(issueTemplate.info.label),
      sixth: languageService(issueTemplate.pending.detailLabel),
    };

    this.fixedRange = {
      Month: {
        today: moment().endOf("day"),
        from: moment().startOf("month"),
        to: moment().endOf("month"),
      },
    };

    this.handlePageStateSave = this.handlePageStateSave.bind(this);
    this.resetPage = this.resetPage.bind(this);
    this.menuFilterApplied = this.menuFilterApplied.bind(this);
    this.handelMenuClickData = this.handelMenuClickData.bind(this);
    this.handleAssetsDataLoad = this.handleAssetsDataLoad.bind(this);
    this.handleSummaryClick = this.handleSummaryClick.bind(this);
    this.barItemFilterList = this.barItemFilterList.bind(this);
  }

  componentDidMount() {
    if (this.props.assetTypes.length == 0) {
      this.props.getAssetType();
    }
    this.props.getAssets();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType == "DASHBOARD_READ_REQUEST" && this.props.actionType !== prevProps.actionType) {
      this.setState({
        spinnerLoading: true,
      });
    }
    if (this.props.actionType == "DASHBOARD_READ_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      let data = this.props.dashboard; // adjustTodayInspectionsFromData(this.props.dashboard);
      this.setLinesForFilter(data, this.state.assetChildren);

      this.setState({
        spinnerLoading: false,
        adjustedData: data,
      });
    }
    if (this.props.actionType == "DASHBOARD_READ_FAILURE" && this.props.actionType !== prevProps.actionType) {
      this.setState({
        spinnerLoading: false,
      });
    }

    if (prevState.actionType !== this.state.actionType && this.state.actionType == "JOURNEYPLANS_READ_FAILURE") {
      if (this.props.journeyPlanErrorMessage !== prevProps.journeyPlanErrorMessage && this.props.journeyPlanErrorMessage.status == 401) {
        this.props.history.push("/login");
      }
    }
  }
  menuFilterApplied(assetChildren, options) {
    let range = { today: moment().endOf("day"), from: moment().startOf("month"), to: moment().endOf("month") };
    var jsonArray = encodeURIComponent(JSON.stringify(range));
    let arg = "?dateRange=" + jsonArray;
    this.props.getDashboard(arg);
    this.setState({ assetChildren, lineNames: [...options] });
  }
  handleAssetsDataLoad(assetsChildrenCopy, displayMenuAll, lineNames) {
    this.handelMenuClickData(assetsChildrenCopy, displayMenuAll, lineNames);
  }
  handelMenuClickData(assetChildrenCopy, displayMenuAll, lineNames) {
    this.setLinesForFilter(this.state.adjustedData, assetChildrenCopy);
    this.setState({ displayMenuAll, assetChildren: assetChildrenCopy, lineNames: lineNames });
  }
  setLinesForFilter(data, assetChildren) {
    if (data && data.lineLists) {
      let linesToShow = [];
      let overAllData = data.lineLists;
      assetChildren &&
        //assetChildren.forEach(locations => {
        assetChildren.forEach((planAndLocation) => {
          if (planAndLocation.state) {
            linesToShow.push(data.lineLists[planAndLocation.title]);
          }
          //});
        });
      this.fillLineRelevantData(linesToShow);

      this.setState({
        overAllData: overAllData,
      });
    }
  }

  handlePageStateSave(page) {
    this.setState({
      listPage: page,
    });
  }

  resetPage() {
    this.setState({
      listPage: 0,
    });
  }

  fillLineRelevantData(lines, lineToday) {
    let planSummary = { total: 0, upcoming: 0, inProgress: 0, missed: 0, overdue: 0, completed: 0 };
    let issueSummary = { total: 0, info: 0, low: 0, medium: 0, high: 0, pending: 0 };
    let issues = [];
    let inspections = [];
    lines.forEach((line) => {
      line.inspections && updateLocationSummaryCalculation(planSummary, line.inspections.summary);
      line.issues && updateLocationSummaryCalculation(issueSummary, line.issues.summary);
      pushListItems(line.inspections, inspections);
      pushListItems(line.issues, issues);
    });

    issues = issues.sort(function compare(a, b) {
      let dateA = new Date(a.timeStamp);
      let dateB = new Date(b.timeStamp);
      return dateB - dateA;
    });

    this.setState({
      summaryValuePlan: planSummary,
      inspections: inspections,
      inspectionsDataToShow: [...inspections],
      summaryValueIssues: issueSummary,
      issuesData: issues,
      issuesDataToShow: [...issues],
    });
  }
  handleSummaryClick(summaryName, path) {
    console.log(summaryName);
    if (path == "inspection") {
      this.props.updateFilterState("inspectionFilter", {
        ...this.props.inspectionFilter,
        fromDashboard: {
          activeSummary: summaryName,
          rangeState: this.fixedRange["Month"],
          assetChildren: this.state.assetChildren,
          listViewDataToShow: LIST_VIEW_SELECTION_TYPES.LIST,
          lineNames: this.state.lineNames,
          dateFilterName: "Month",
        },
      });
    } else if (path == "issuereports") {
      //let children = [];
      // this.state.assetChildren.forEach((child, index) => {
      //   children = [...children, ...child];
      // });
      this.props.updateFilterState("issuesFilter", {
        ...this.props.issuesFilter,
        fromDashboard: {
          activeSummary: summaryName,
          rangeState: this.fixedRange["Month"],
          assetChildren: this.state.assetChildren,
          lineNames: this.state.lineNames,
          dateFilterName: "Month",
        },
      });
    }
    this.props.history.push("/" + path);
  }

  barItemFilterList(propItem, type) {
    let data = [];
    let stateTOUpdate = {};

    if (propItem.label == "Fixed") {
      data = this.state.issuesData.filter((el) => el.marked == true);
      stateTOUpdate.issuesDataToShow = data;
    } else {
      type == "inspections" && (data = this.filterElementOnBarClick(this.state.inspections, propItem, "status"));
      type == "inspections" && (stateTOUpdate.inspectionsDataToShow = data);
      type == "issues" && (data = this.filterElementOnBarClick(this.state.issuesData, propItem, "priority"));
      type == "issues" && (stateTOUpdate.issuesDataToShow = data);
    }
    this.setState(stateTOUpdate);
  }
  filterElementOnBarClick(stateItems, propItem, fieldNameToCheck) {
    let itemsToReturn = [];
    stateItems.forEach((item) => {
      (item[fieldNameToCheck] === propItem.label || item[fieldNameToCheck] === propItem.secondVal || propItem.label == "total") &&
        itemsToReturn.push(item);
    });
    return itemsToReturn;
  }

  render() {
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <Col id="mainContent" md={12} style={themeService(DashboardPageStyle.mainContainerStyle)}>
        <MenuFilter
          menuFilterApplied={this.menuFilterApplied}
          handelMenuClickData={this.handelMenuClickData}
          displayMenuAll={this.state.displayMenuAll}
          dataLoadedCallback={this.handleAssetsDataLoad}
        ></MenuFilter>
        {modelRendered}
        <Row style={themeService(commonStylesDashboard.zeroMarginRow)}>
          <PlanningSummaryLinear
            descriptions={this.summaryDesc}
            values={this.state.summaryValuePlan}
            handleSummaryClick={this.handleSummaryClick}
            summaryLabels={this.summaryLabels}
          />
        </Row>

        <Row style={themeService(DashboardPageStyle.headingRow)}>{languageService("Inspections")}</Row>
        <Row style={themeService(DashboardPageStyle.tablesContainerRow)}>
          <Col md={6} style={themeService(commonStylesDashboard.innerContainerCol)}>
            <MyPlanningTable
              journeyPlans={this.state.inspectionsDataToShow}
              actionType={this.state.actionType}
              handlePageSave={this.handlePageStateSave}
              pageSize={this.state.planPageSize}
              page={this.state.listPage}
              planFilter={this.state.planFilter}
              resetPage={this.resetPage}
            />
          </Col>
          <Col md={6} style={themeService(commonStylesDashboard.innerContainerCol)}>
            {!this.state.displayMenuAll && (
              <DataChartWrapper
                overAllData={this.state.summaryValuePlan}
                chartField="inspections"
                tableLabel={languageService("Inspections")}
                barItemFilterList={this.barItemFilterList}
              />
            )}
            {this.state.displayMenuAll && <LinesDataStackedBar overAllData={this.state.overAllData} chartField="inspections" />}
          </Col>
        </Row>
        <Row style={themeService(commonStylesDashboard.zeroMarginRow)}>
          <IssuesSummaryLinear
            descriptions={this.summaryIssuesDesc}
            values={this.state.summaryValueIssues}
            handleSummaryClick={this.handleSummaryClick}
            summaryLabels={this.summaryIssuesLabels}
          />
        </Row>
        <Row style={themeService(DashboardPageStyle.headingRow)}>{languageService("Issues Reported")}</Row>
        <Row style={themeService(DashboardPageStyle.tablesContainerRow)}>
          <Col md={6} style={themeService(commonStylesDashboard.innerContainerCol)}>
            <IssuesReported issuesData={this.state.issuesDataToShow} />
          </Col>
          <Col md={6} style={themeService(commonStylesDashboard.innerContainerCol)}>
            {!this.state.displayMenuAll && (
              <DataChartWrapper
                overAllData={this.state.summaryValueIssues}
                chartField="issues"
                tableLabel={languageService("Issues")}
                barItemFilterList={this.barItemFilterList}
              />
            )}
            {this.state.displayMenuAll && <LinesDataStackedBar overAllData={this.state.overAllData} chartField="issues" />}
          </Col>
        </Row>
      </Col>
    );
  }
}
const getAssets = curdActions.getAssets;
const getAssetType = curdActions.getAssetType;
let actionOptions = {
  create: false,
  update: false,
  read: true,
  delete: false,
  others: { savePageNum, clearPageNum, getAssets, getAssetType, updateFilterState },
};

let variableList = {
  journeyPlanReducer: { journeyPlans: "" },
  // dashboardHelperReducer: {
  //   dashboardData: [],
  // },
  utilReducer: {
    planPageNum: 0,
    planFilter: "all",
    planPageSize: 10,
  },
  assetReducer: { assets: "" },
  assetTypeReducer: {
    assetTypes: [],
  },
  filterStateReducer: {
    inspectionFilter: {},
    issuesFilter: {},
  },
};

const DashboardContainer = CRUDFunction(DashboardPage, "dashboard", actionOptions, variableList, [
  "journeyPlanReducer",
  "utilReducer",
  "assetReducer",
  "assetTypeReducer",
  "filterStateReducer",
  // "dashboardHelperReducer",
]);

export default DashboardContainer;

function updateLocationSummaryCalculation(collectiveSummary, summary) {
  //console.log(collectiveSummary);
  let objKeys = Object.keys(collectiveSummary);
  objKeys.forEach((sum) => {
    collectiveSummary[sum] += summary[sum];
  });
}

function pushListItems(itemCategory, arrayOfList) {
  let detailCount = 0;
  let limit = itemCategory.details.length;
  if (itemCategory && itemCategory.details && itemCategory.details.length < 8) {
    limit = itemCategory.details.length;
  }
  if (itemCategory && itemCategory.details) {
    while (detailCount < limit) {
      arrayOfList.push(itemCategory.details[detailCount]);
      detailCount++;
    }
  }
}
