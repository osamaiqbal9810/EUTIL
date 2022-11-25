/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import ThisTable from "components/Common/ThisTable/index";
import moment from "moment";
// import Gravatar from "react-gravatar";
// import { getStatusColor } from "utils/statusColors.js";
import { Link, Route } from "react-router-dom";
import { ButtonActionsTable } from "components/Common/Buttons";
import _ from "lodash";
import CommonFilters from "components/Common/Filters/CommonFilters";
import permissionCheck from "utils/permissionCheck.js";
import { languageService } from "../../../Language/language.service";
import UserInLineEdit from "./UserInLineEdit";
import { themeService } from "theme/service/activeTheme.service";
import { statusStyle } from "./style/index";
import { dateSort, generalSort } from "../../../utils/sortingMethods";
import StyledCheckBox from "../../Common/StyledCheckBox";
import AppForm from "../../Common/GenericForms";
class JourneyPlanList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      filteredData: [],
      filterTodayOrAll: this.props.planFilter,
      appFormModal: false,
      selectedTaskForms: null,
    };
    let noInline = this.props.forDashboard;
    let permissionValue = true;

    if (this.props.permissionCheckProps) {
      permissionValue = this.props.permissionCheck;
    }
    this.columns = [
      {
        Header: languageService(this.props.forDashboard ? "Run Name" : "Inspection Run Name"),
        id: "title",
        // Cell: (row) => {
        //   /* Add data-tip */
        //   return <span data-tip={row.title}>{row.title}</span>;
        // },
        accessor: (d) => {
          return <div style={{ fontSize: this.props.forDashboard ? "12px" : "auto" }}>{d.title}</div>;
        },
        minWidth: this.props.forDashboard ? 120 : 200,
      },
      {
        Header: languageService("Inspector"),
        id: "assignedUser",
        accessor: (d) => {
          let obj = "";
          if ((d.status == "Future Inspection" || d.status == "Overdue") && !noInline && permissionValue) {
            obj = (
              <UserInLineEdit
                key={d._id ? d._id : d.date + d.title}
                userList={this.props.userList}
                inspection={d}
                changeUserAndUpdate={this.props.changeUserAndUpdate}
              />
            );
          } else {
            let userName = "";
            if (d.user) {
              userName = d.user.name;
            }
            obj = userName;
          }
          return <div style={{ fontSize: this.props.forDashboard ? "12px" : "auto" }}>{obj}</div>;
        },
        //    Cell: row => {
        //   console.log(row);
        //   let obj = "";

        //   if (row.original.status == "Future Inspection" || row.original.status == "Overdue") {
        //     this.num = this.num++;
        //     // console.log(this.props.userList);
        //     obj = (
        //       <UserInLineEdit
        //         key={row.index}
        //         userList={this.props.userList}
        //         inspection={row.original}
        //         testNum={this.num}
        //         changeUserAndUpdate={this.props.changeUserAndUpdate}
        //       />
        //     );
        //   } else {
        //     let userName = "";
        //     if (row.original.user) {
        //       userName = row.original.user.name;
        //     }
        //     obj = userName;
        //   }
        //   return obj;
        // },

        minWidth: this.props.forDashboard ? 60 : 150,
      },
      {
        Header: languageService("Next Inspection Date"),
        id: "Date",

        minWidth: this.props.forDashboard ? 90 : 160,
        sortMethod: (a, b) => {
          let aVal = a.props.children;
          let bVAl = b.props.children;
          return dateSort(aVal, bVAl);
        },
        accessor: (d) => {
          let date = this.props.forDashboard ? moment(d.date).format("ddd, MMM D YYYY") : moment(d.date).parseZone().format("ll");
          return <div style={{ fontSize: this.props.forDashboard ? "12px" : "auto" }}>{date}</div>;
        },
      },
      /*{
        Header: languageService("Start Time"),
        id: "startTime",
        minWidth: 160,
        show: this.props.forDashboard ? false : true,
        accessor: (d) => {
          let date = "";
          if (d.startDateTime) {
            date = moment(d.startDateTime).format("llll");
          }
          return date;
        },
      },
      {
        Header: languageService("Finish Time"),
        id: "endTime",
        minWidth: this.props.forDashboard ? 80 : 160,
        show: this.props.forDashboard ? false : true,
        accessor: (d) => {
          let date = "";
          if (d.endDateTime) {
            date = moment(d.endDateTime).format("llll");
          }
          return date;
        },
      },*/
      {
        Header: languageService("Status"),
        id: "Status",
        sortMethod: generalSort,
        width: this.props.forDashboard ? 100 : 160,

        accessor: (d) => {
          let status = "Unknown";
          if (d.status) {
            status = d.status;
          }
          return <div style={themeService(statusStyle.statusColorStyle(status, this.props))}>{languageService(status)}</div>;
        },
      },
      /*{
        Header: languageService("Issues"),
        id: "issues",
        show: this.props.forDashboard ? false : true,
        accessor: (d) => {
          let issues = 0;
          let tasks = d.tasks ? d.tasks : [];
          if (tasks.length > 0) {
            tasks.forEach((task) => {
              if (task.issues) {
                issues = issues + task.issues.length;
              }
            });
          }
          if (!issues) {
            issues = "";
          }
          return <div style={{ textAlign: "center" }}> {issues} </div>;
        },

        minWidth: 70,
      },
      {
        Header: languageService("Include in FRA"),
        id: "includeInFRAReport",
        show: this.props.forDashboard ? false : true,
        accessor: (d) => {
          let issues = 0;
          let tasks = d.tasks ? d.tasks : [];
          if (tasks.length > 0 && ["weather", "special"].includes(tasks[0].inspectionTypeTag)) {
            // issues = (<input onClick={() => {
            //   let journeyPlanObj = _.cloneDeep(d);
            //   journeyPlanObj.tasks[0].includeInFRAReport = !journeyPlanObj.tasks[0].includeInFRAReport;
            //   this.props.handleUpdateIncludeInFRA(journeyPlanObj)
            // }} type="checkbox" checked={!!tasks[0].includeInFRAReport}/>);

            issues = (
              <StyledCheckBox
                onClick={() => {
                  let journeyPlanObj = _.cloneDeep(d);
                  journeyPlanObj.tasks[0].includeInFRAReport = !journeyPlanObj.tasks[0].includeInFRAReport;
                  this.props.handleUpdateIncludeInFRA(journeyPlanObj);
                }}
                checked={!!tasks[0].includeInFRAReport}
              />
            );
          }
          if (!issues) {
            issues = "";
          }
          return <div style={{ textAlign: "center", cursor: "pointer" }}> {issues} </div>;
        },

        minWidth: 80,
      },*/
      {
        Header: languageService("Actions"),
        id: "actions",
        show: this.props.forDashboard ? false : true,
        accessor: (d) => {
          let checkRealObj = d._id;
          if (!checkRealObj) {
            checkRealObj = "futureInspection";
          }
          let appFormsCHeck =
            d.tasks && d.tasks.length > 0 && d.tasks[0].appForms && Array.isArray(d.tasks[0].appForms) && d.tasks[0].appForms.length > 0;
          return (
            <div>
              {permissionCheck("WORKPLAN", "read") && (
                <ButtonActionsTable
                    handleClick={(e) => {
                      this.props.handleViewModalClick("View", d);
                    }}
                    margin="0px 10px 0px 0px"
                    buttonText={languageService("View")}
                  />
                  )}
            </div>
          )
            }
        }
    ];

    this.checkTodayAllFilter = this.checkTodayAllFilter.bind(this);
    this.handleAppFormModalToggle = this.handleAppFormModalToggle.bind(this);
  }

  showAppForms(task) {
    this.setState({
      appFormModal: !this.state.appFormModal,
      selectedTaskForms: task,
    });
  }

  handleAppFormModalToggle() {
    this.setState({
      appFormModal: !this.state.appFormModal,
    });
  }
  checkTodayAllFilter(filterName) {
    let filteredData = [];
    if (filterName == "today") {
      this.props.planningTableData.forEach((plan) => {
        if (plan.status == "In Progress") {
          filteredData.push(plan);
        }
      });
    } else if (filterName == "all") {
      filteredData = this.props.planningTableData;
    }
    if (this.state.filterTodayOrAll !== filterName) {
      if (this.props.resetPage) {
        this.props.resetPage();
      }
    }

    this.setState({
      filteredData: filteredData,
      filterTodayOrAll: filterName,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.props.actionType == "JOURNEYPLANS_READ_SUCCESS" || this.props.actionType == "SOD_LIST_GET_SUCCESS") &&
      this.props.planningTableData &&
      this.props.planningTableData !== prevProps.planningTableData
    ) {
      this.checkTodayAllFilter(this.state.filterTodayOrAll);
    }
    if (this.props.workPlansUpdated) {
      this.checkTodayAllFilter(this.state.filterTodayOrAll);
      this.props.setWorkPlansUpdatedFalse();
    }
  }

  componentDidMount() {
    if (this.props.planningTableData && this.props.planningTableData.length > 0) {
      this.checkTodayAllFilter(this.state.filterTodayOrAll);
    }
  }

  render() {
    let columns = this.columns;
    if (this.props.noActionColumn) {
      _.remove(this.columns, { id: "actions" });
    }
    return (
      <React.Fragment>
        <AppForm
          modal={this.state.appFormModal}
          task={this.state.selectedTaskForms}
          toggle={this.handleAppFormModalToggle}
          handleClose={this.handleAppFormModalToggle}
        />
        <div style={{ padding: "0px 0px 0px", width: "-webkit-fill-available", width: "100%" }}>
          {!this.props.noFilter && (
            <div style={{ margin: "0 15px" }}>
              <CommonFilters
                tableInFilter
                showCustomFilter
                customFilterComp={this.props.customFilterComp}
                checkTodayAllFilter={this.checkTodayAllFilter}
                filterTodayOrAll={this.state.filterTodayOrAll}
                firstFilterName={languageService("In Progress")}
                noFilters
                tableColumns={columns}
                tableData={this.state.filteredData}
                pageSize={this.props.pageSize}
                pagination={true}
                handlePageSave={this.props.handlePageSave}
                handlePageSize={this.props.handlePageSize}
                page={this.props.page}
              />
            </div>
          )}
          {this.props.forDashboard && (
            <div style={{ boxShadow: "3px 3px 5px #cfcfcf" }}>
              <ThisTable
                tableColumns={columns}
                tableData={this.props.planningTableData}
                pageSize={8}
                minRows={8}
                pagination={true}
                forDashboard={true}
                handlePageChange={(page) => this.props.handlePageSave(page)}
                page={this.props.page}
                height={"auto"}
                classNameCustom={this.props.classNameCustom}
                fromDashboardToLink={this.props.fromDashboardToLink}
              />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default JourneyPlanList;
