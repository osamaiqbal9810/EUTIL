import React, { Component } from "react";
import ThisTable from "components/Common/ThisTable/index";
import moment from "moment";
import Gravatar from "react-gravatar";
import { getStatusColor } from "utils/statusColors.js";
import { Link, Route } from "react-router-dom";
import { ButtonActionsTable } from "components/Common/Buttons";
import _ from "lodash";
import CommonFilters from "components/Common/Filters/CommonFilters";
import permissionCheck from "utils/permissionCheck.js";
import { languageService } from "../../../Language/language.service";
import { statusStyle } from "../../JourneyPlan/JourneyPlanList/style";
import { themeService } from "../../../theme/service/activeTheme.service";
import { dateSort, generalSort } from "../../../utils/sortingMethods";
import { maintenanceOptions, getMaintenanceOptionsValueToText } from "../../IssuesReports/IssuesList/IssuesList";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import SvgIcon, { Icon } from "react-icons-kit";
class MaintenanceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: this.props.pageSize ? this.props.pageSize : 20,
      page: 0,
      selected: null,
      filteredData: [],
      //filterTodayOrAll: this.props.maintenanceFilter
      //customFilter: this.props.customFilter
    };
    this.columns = [
      {
        id: "mrnumber",
        Header: "MR#",
        minWidth: 120,
        accessor: (d) => {
          if (d.mrNumber) return d.mrNumber;

          return "";
        },
      },
      {
        id: "workOrderNumber",
        Header: "MWO#",
        minWidth: 120,
        accessor: (d) => {
          if (d.workOrderNumber) return d.workOrderNumber;

          return "";
        },
      },
      {
        Header: languageService("Date Created"),
        id: "timestamp",
        minWidth: 120,
        sortMethod: dateSort,
        accessor: (d) => {
          return moment(d.createdAt).format("llll");
        },
      },
      {
        id: "locLine",
        Header: languageService("Location"),
        minWidth: 200,
        accessor: (d) => {
          if (d.lineName) return d.lineName;

          return "";
        },
      },
      {
        Header: languageService("Assign Maintenance"),
        id: "issueMaintenance",
        width: 200,
        show: this.props.forDashboard ? false : true,
        accessor: (d) => {
          let maintenanceRole = d.maintenanceRole;
          let editMaintenance = d.maintenanceAction === "maintenanceMode";
          let changeable = d.status == "In Progress" || d.status == "Closed" || d.status == "Complete" ? false : true;

          return (
            <div>
              {changeable && (
                <React.Fragment>
                  <div style={{ display: "inline-block", width: "80%" }}>
                    <select
                      disabled={false}
                      onChange={(e) => {
                        props.handleUpdateMaintenance(d._id, e.target, "updateMaintenanceRole");
                      }}
                      name="maintenanceRole"
                      value={maintenanceRole || ""}
                    >
                      {maintenanceOptions(maintenanceRole)}
                    </select>
                    <React.Fragment>
                      {editMaintenance && (
                        <div style={{ display: "inline-block" }}>
                          <div
                            style={themeService({
                              default: { color: basicColors },
                              retro: { color: retroColors.second },
                              electric: { color: electricColors.second },
                            })}
                          >
                            <SvgIcon
                              size={15}
                              icon={checkmark}
                              onClick={(e) => props.handleUpdateMaintenance(d._id, e.target, "saveMaintenanceRole")}
                              style={{
                                marginRight: "5px",
                                marginLeft: "5px",
                                verticalAlign: "middle",
                                cursor: "pointer",
                                zIndex: "10",
                                position: "relative",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  </div>
                </React.Fragment>
              )}
              {!changeable && <React.Fragment>{getMaintenanceOptionsValueToText(d.maintenanceRole)}</React.Fragment>}
            </div>
          );
        },
      },
      {
        Header: languageService("Plan Date"),
        id: "dueDate",
        minWidth: 150,
        // sortMethod: dateSort,
        accessor: (d) => {
          let date = "";
          if (d.dueDate) {
            date = moment(d.dueDate).format("ll");
          }
          return date;
        },
      },
      // {
      //   Header: languageService("Execution Date"),
      //   id: "executionDate",
      //   minWidth: 150,
      //   // sortMethod: dateSort,
      //   accessor: (d) => {
      //     let date = "";
      //     if (d.executionDate) {
      //       date = moment(d.executionDate).format("ll");
      //     }
      //     return date;
      //   },
      // },
      {
        Header: languageService("Date Closed"),
        id: "closedDate",
        minWidth: 150,

        accessor: (d) => {
          let date = "";
          if (d.closedDate) {
            date = moment(d.closedDate).format("ll");
          }
          return date;
        },
      },
      {
        Header: languageService("Status"),
        id: "status",
        width: 130,
        sortMethod: generalSort,
        accessor: (d) => {
          let status = "Unknown";
          if (d.status) {
            status = d.status;
          }
          return <div style={themeService(statusStyle.statusColorStyle(status, this.props))}>{languageService(status)}</div>;
        },
      },
      {
        Header: languageService("Actions"),
        id: "actions",
        accessor: (d) => {
          return (
            <div>
              {/* {permissionCheck('MAINTENANCE', 'read') && */}{" "}
              {permissionCheck("MAINTENANCE", "view") && (
                <Link to={`${this.props.path}s/` + d._id} className="linkStyleTable">
                  <ButtonActionsTable
                    handleClick={(e) => {
                      this.props.handleViewClick(d, this.state.filterTodayOrAll, this.props.pageSize);
                    }}
                    margin="0px 10px 0px 0px"
                    buttonText={languageService("View")}
                  />
                </Link>
              )}
              {d.status !== "Complete" && d.status !== "Closed" && permissionCheck("MAINTENANCE", "update") && (
                <ButtonActionsTable
                  handleClick={() => {
                    this.props.editMaintenance("Edit", d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Edit")}
                />
              )}
              {/* {(!d.workOrderNumber || d.workOrderNumber === "") &&
                permissionCheck("MAINTENANCE WORK ORDER", "view") &&
                d.status !== "Closed" && (
                  <ButtonActionsTable
                    handleClick={() => {
                      this.props.handlePlanClick(d);
                    }}
                    margin="0px 10px 0px 0px"
                    buttonText={languageService("Capital Plan")}
                  />
                )} */}
              {/* permissionCheck('MAINTENANCE', 'update') && */}
              {/* {((d.status === "Planned") && //"Inprogress" && d.status !== "Closed" && (
                <ButtonActionsTable
                  handleClick={e => {
                    //this.props.handleEditClick('Edit', d, this.state.filterTodayOrAll, this.props.pageSize)
                    this.props.handleExecuteClick(d); //, this.state.filterTodayOrAll, this.props.pageSize);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={"Execute"}
                />
              )} */}
              {/* permissionCheck('MAINTENANCE', 'update') && */}
              {/* {((d.status === "In Progress") && //"Inprogress" && d.status !== "Closed" && (
                <ButtonActionsTable
                  handleClick={e => {
                    //this.props.handleEditClick('Edit', d, this.state.filterTodayOrAll, this.props.pageSize)
                    this.props.handleCloseClick(d); //, this.state.filterTodayOrAll, this.props.pageSize);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={"Close"}
                />
              )} */}
              {/* {d.status !== 'In Progress' && d.status !== 'Finished' && permissionCheck('WORKPLAN', 'delete') && (
                <ButtonActionsTable
                  handleClick={e => {
                    this.props.handleDeleteClick(d)
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={'Delete'}
                />
              )} */}
            </div>
          );
        },
        minWidth: 150,
      },
    ];
    this.handlePageSave = this.handlePageSave.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType == "MAINTENANCES_READ_SUCCESS" && this.props.maintenanceData) {
      let l = this.props.maintenanceData.length;
      if (l != this.state.dataLength && l > 0) {
        //console.log('MaintenanceList->componentDidUpdate', this.props.maintenanceData);
        this.setState({
          filteredData: this.props.maintenanceData,
          dataLength: l,
        });
      }
    }
    // console.log('maintenancelist->componentdidupdate', this.props.maintenanceData);
    // console.log(prevProps.actionType !== this.props.actionType, this.props.actionType=='MAINTENANCES_READ_SUCCESS', this.props.maintenanceData.length);
    // if(prevProps.actionType !== this.props.actionType && this.props.actionType=='MAINTENANCES_READ_SUCCESS')
    // {
    //     if(this.props.maintenanceData.length > 0)
    //     {
    //         console.log('MaintenanceList->componentDidUpdate', this.props.maintenanceData);
    //        // console.log('got data in maintenance list componentdidupdate', this.props.maintenaceData);
    //         this.setState({filteredData: this.props.maintenaceData});
    //     }
    // }
  }
  handlePageSave(page, pageSize) {
    this.setState({
      page: page,
      pageSize: pageSize,
    });
  }
  render() {
    let columns = this.columns;
    if (this.props.noActionColumn) {
      _.remove(this.columns, { id: "actions" });
    }
    return (
      <div>
        {!this.props.noFilter && (
          <CommonFilters
            noFilters
            tableInFilter
            //checkTodayAllFilter={this.props.checkTodayAllFilter}
            showCustomFilter
            customFilterComp={this.props.customFilterComp}
            tableColumns={columns}
            tableData={this.props.maintenanceData}
            pageSize={this.state.pageSize}
            pagination={true}
            handlePageSave={this.handlePageSave}
            page={this.state.page}
            handlePageSize={this.props.handlePageSize}
            defaultSorted={[{ id: "mrnumber", desc: true }]}
            rowStyleMap={this.props.rowStyleMap}
          />
        )}
      </div>
    );
  }
}

export default MaintenanceList;
