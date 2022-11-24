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
import SvgIcon from "react-icons-kit";
import { moveUp } from "react-icons-kit/icomoon/moveUp";
import { ic_vertical_align_bottom } from "react-icons-kit/md/ic_vertical_align_bottom";
import { ic_vertical_align_top } from "react-icons-kit/md/ic_vertical_align_top";
import { moveDown } from "react-icons-kit/icomoon/moveDown";
import "./style.css";
import { check } from "react-icons-kit/metrize/check";
import Radium from "radium";
import { save } from "react-icons-kit/fa/save";
import { bell } from "react-icons-kit/fa/bell";
import { ic_cancel } from "react-icons-kit/md/ic_cancel";
import { edit } from "react-icons-kit/fa/edit";
import { languageService } from "../../../Language/language.service";

class JourneyPlanList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      filteredData: [],
      editMode: false,
      defaultFilter: false,
      customFilter: true,
      sortModeLocal: "",
      columns: [
        {
          Header: "Sort",
          id: "sortCol",
          accessor: (d) => {
            return (
              <div>
                <div
                  className="sortContainer"
                  onClick={(e) => {
                    this.handleSort(d, "moveTop");
                  }}
                >
                  <SvgIcon size={20} icon={ic_vertical_align_top} />
                </div>
                <div
                  className="sortContainer"
                  onClick={(e) => {
                    this.handleSort(d, "moveUp");
                  }}
                >
                  <SvgIcon size={20} icon={moveUp} />
                </div>
                <div
                  className="sortContainer"
                  onClick={(e) => {
                    this.handleSort(d, "moveDown");
                  }}
                >
                  <SvgIcon size={20} icon={moveDown} />
                </div>
                <div
                  className="sortContainer"
                  onClick={(e) => {
                    this.handleSort(d, "moveToDown");
                  }}
                >
                  <SvgIcon size={20} icon={ic_vertical_align_bottom} />
                </div>
              </div>
            );
          },
          width: 120,
          show: false,
        },
        // {
        //   Header: 'Sort ID',
        //   accessor: 'sort_id',
        //   minWidth: 150
        // },
        {
          Header: languageService("Name"),
          accessor: "title",
          minWidth: 150,
        },
        {
          Header: languageService("Title"),
          id: "inspectionTitleRun",
          accessor: (d) => {
            let desc = "";
            if (d.runRanges) {
              desc = d.inspectionRun;
            }
            return desc;
          },

          minWidth: 200,
        },
        {
          Header: languageService("Work Zone"),
          id: "workZone",
          accessor: (d) => {
            let marked = "";
            if (d.workZone == 1) {
              marked = <SvgIcon size={20} icon={check} />;
            }
            return <div style={{ color: "inherit" }}>{marked}</div>;
          },
          minWidth: 100,
        },
        {
          Header: languageService("Foul Time"),
          id: "foulTime",
          accessor: (d) => {
            let marked = "";
            if (d.foulTime == 1) {
              marked = <SvgIcon size={20} icon={check} />;
            }
            return <div style={{ color: "inherit" }}>{marked}</div>;
          },
          minWidth: 60,
        },
        {
          Header: languageService("Inspector"),
          id: "assignedUser",
          accessor: (d) => {
            let userName = "";
            if (d.user) {
              userName = d.user.name;
            }
            return userName;
          },

          minWidth: 120,
        },
        {
          Header: languageService("Watchmen"),
          id: "watchMen",
          accessor: (d) => {
            let watchMenNames = "";
            if (d.watchmen) {
              watchMenNames = d.watchmen.name;
            }
            return watchMenNames;
          },
          minWidth: 120,
        },
        {
          Header: languageService("Date Created"),
          id: "dateCreated",
          accessor: (d) => {
            let date = "";
            if (d.createdAt) {
              date = moment(d.createdAt).format("ll");
            }
            return date;
          },

          minWidth: 120,
        },
        {
          Header: languageService("Last Inspection"),
          id: "lastInspection",
          accessor: (d) => {
            let date = "";
            if (d.lastInspection) {
              date = moment(d.lastInspection).format("llll");
            }
            return date;
          },

          minWidth: 120,
        },
        {
          Header: languageService("Next Inspection"),
          id: "nextInspection",
          accessor: (d) => {
            let date = "";
            if (d.nextInspectionDate) {
              date = moment(d.nextDueDate ? d.nextDueDate : d.nextInspectionDate).format("ll");
            }
            return date;
          },

          minWidth: 120,
        },
        // {
        //   Header: languageService("Special"),
        //   id: "special",
        //   accessor: d => {
        //     let marked = "";
        //     if (d.type == 1) {
        //       marked = <SvgIcon size={20} icon={check} />;
        //     }
        //     return <div style={{ color: "inherit" }}>{marked}</div>;
        //   },
        //   minWidth: 60,
        // },
        // {
        //   Header: 'Status',
        //   id: 'Status',
        //   width: 130,
        //   accessor: d => {
        //     let status = 'Template'
        //     // if (d.status) {
        //     //   status = d.status
        //     // }
        //     return (
        //       <div
        //         style={{
        //           background: getStatusColor(status),
        //           padding: '5px',
        //           textAlign: 'center',
        //           margin: '15px',
        //           borderRadius: '2px',
        //           color: '#fff'
        //         }}
        //       >
        //         {status}
        //       </div>
        //     )
        //   }
        // },
        {
          Header: languageService("Actions"),
          id: "actions",
          accessor: (d) => {
            return (
              <div>
                {permissionCheck("WORKPLAN", "read") && (
                  <Link to={`${this.props.path}s/` + d._id} className="linkStyleTable">
                    <ButtonActionsTable
                      handleClick={(e) => {
                        this.props.handleViewClick(d, this.state.sortModeLocal, this.props.pageSize);
                      }}
                      margin="0px 10px 0px 0px"
                      buttonText={languageService("View")}
                    />
                  </Link>
                )}
                {permissionCheck("WORKPLAN", "update") && (
                  <ButtonActionsTable
                    handleClick={(e) => {
                      this.props.handleEditClick("Edit", d, this.state.sortModeLocal, this.props.pageSize);
                    }}
                    margin="0px 10px 0px 0px"
                    buttonText={languageService("Edit")}
                  />
                )}
                {permissionCheck("WORKPLAN", "delete") && (
                  <ButtonActionsTable
                    handleClick={(e) => {
                      this.props.handleDeleteClick(d);
                    }}
                    margin="0px 10px 0px 0px"
                    buttonText={languageService("Delete")}
                  />
                )}

                {d.alertRules && d.alertRules.length > 0 && (
                  <ButtonActionsTable
                    handleClick={(e) => {
                      this.props.handleAlertClick(d);
                    }}
                    margin="0px 10px 0px 0px"
                    buttonText={<SvgIcon icon={bell} size={15} />}
                  />
                )}
              </div>
            );
          },
          minWidth: 150,
        },
      ],
    };

    this.dataColumns = [
      {
        id: "planTitle",
        header: languageService("Name"),
        type: "text",
        field: "title",
        //  accessor: wrapper,
        minWidth: 150,
        editable: false,
      },

      {
        id: "inspectionRun",
        header: languageService("Inspection Run Name"),
        type: "text",
        field: "  inspecitonRun",
        //  accessor: wrapper,
        minWidth: 150,
        editable: false,
      },
      {
        id: "workZone",
        header: languageService("Work Zone"),
        type: "text",
        field: "workzone",
        minWidth: 100,
        editable: true,
      },
      {
        id: "foulTime",
        header: languageService("Foul Time"),
        type: "text",
        field: "foulTime",
        minWidth: 100,
        editable: true,
      },
      {
        id: "assignedUser",
        header: languageService("Inspector"),
        type: "text",
        field: "userName",
        editable: true,
        minWidth: 150,
        possibleValues: ["UserA", "UserB", "UserC"],
      },
      {
        id: "watchmen",
        header: languageService("Watchman"),
        type: "text",
        field: "Watchman",
        editable: true,
        minWidth: 150,
        possibleValues: ["UserA", "UserB", "UserC"],
      },
      {
        id: "actions",
        header: languageService("Actions"),
        type: "action",
        immediate: ["Edit", "Delete"],
        editMode: ["Save", "Cancel"],
      },
    ];

    this.checkTodayAllFilter = this.checkTodayAllFilter.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.EditMode = this.EditMode.bind(this);
  }

  EditMode(method) {
    let cols = _.cloneDeep(this.state.columns);
    if (method == "Edit") {
      let cols = _.cloneDeep(this.state.columns);
      if (this.props.sortMode == "Custom") {
        cols = this.state.columns.map((col, i) => {
          return col.id == "sortCol" ? { ...col, show: true } : col;
        });
      }
      this.setState({
        editMode: true,
        columns: cols,
      });
    } else {
      let sortModeLocal = this.state.sortModeLocal;
      if (method == "Reset") {
        this.props.handleCancelEdit("Reset");
      } else {
        if (method == "Save") {
          this.props.handleSaveEditClick();
        }
        if (method == "Cancel") {
          sortModeLocal = this.props.sortMode;
          this.props.handleCancelEdit();
        }
        cols = this.state.columns.map((col, i) => {
          return col.id == "sortCol" ? { ...col, show: false } : col;
        });
        this.setState({
          editMode: false,
          columns: cols,
          sortModeLocal: sortModeLocal,
        });
      }
    }
  }

  checkTodayAllFilter(filterName) {
    let filteredData = [];
    let cols = _.cloneDeep(this.state.columns);
    if (filterName == "Custom") {
      if (this.state.editMode) {
        cols = this.state.columns.map((col, i) => {
          return col.id == "sortCol" ? { ...col, show: true } : col;
        });
      }
      filteredData = this.props.planningTableData;
    } else if (filterName == "Default") {
      cols = this.state.columns.map((col, i) => {
        return col.id == "sortCol" ? { ...col, show: false } : col;
      });
      filteredData = this.props.planningTableData;
    }
    if (this.state.sortModeLocal !== filterName) {
      if (this.props.resetPage) {
        this.props.resetPage();
      }
    }
    this.setState({
      columns: cols,
      filteredData: filteredData,
      sortModeLocal: filterName,
      customFilter: filterName == "Custom" ? true : false,
      defaultFilter: filterName == "Default" ? true : false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.actionType == "WORKPLANTEMPLATES_READ_SUCCESS" &&
      this.props.planningTableData &&
      this.props.planningTableData !== prevProps.planningTableData
    ) {
      let sortModeLocal = this.state.sortModeLocal;
      if (this.state.sortModeLocal == "") {
        sortModeLocal = this.props.sortMode;
      }
      this.checkTodayAllFilter(sortModeLocal);
    }
  }

  componentDidMount() {
    if (this.props.planningTableData.length > 0) {
      this.checkTodayAllFilter(this.props.sortMode);
    }
  }

  handleFilterClick(filterName) {
    let sortMode = "";
    if (filterName == "Custom") {
      sortMode = "Custom";
      if (!this.state.customFilter) {
        this.props.setSortCustomMode();
        this.setState({
          customFilter: true,
          sortModeLocal: sortMode,
          defaultFilter: false,
        });
      }
    } else if (filterName == "Default") {
      sortMode = "Default";
      if (!this.state.defaultFilter) {
        this.props.handleCancelEdit("Reset");
        this.setState({
          customFilter: false,
          sortModeLocal: sortMode,
          defaultFilter: true,
        });
      }
    }
  }

  async handleSort(data, sortMethod) {
    await this.handleFilterClick("Custom");
    this.props.handleSort(data, sortMethod);
  }

  render() {
    //TODO : TO BE PUT IN THE STATE COLUMNS , ACTION COL SHOW FALSE
    const styles = getStyles(this.props, this.state);
    if (this.props.noActionColumn) {
      _.remove(this.columns, { id: "actions" });
    }
    let editButtons = null;
    let saveButton = false;
    if (this.props.sortedChangesSaveButton && (this.state.sortModeLocal !== this.props.sortMode || this.props.sortDirectionChange)) {
      saveButton = true;
    }
    if (this.state.editMode) {
      editButtons = (
        <div>
          <div style={{ padding: "5px 15px 0px", float: "right" }}>
            {saveButton && (
              <div
                style={{
                  padding: "5px 15px 0px",
                  color: "rgba(64, 118, 179)",
                  cursor: "pointer",
                  display: "inline-block",
                }}
                onClick={(e) => {
                  this.EditMode("Save");
                }}
              >
                <SvgIcon size={21} icon={save} />
              </div>
            )}
            {!saveButton && (
              <div
                style={{
                  padding: "5px 15px 0px",
                  color: "#b75555",
                  cursor: "no-drop",
                  display: "inline-block",
                }}
              >
                <SvgIcon size={21} icon={save} />
              </div>
            )}
            <div
              style={{
                color: " rgba(64, 118, 179)",
                border: "3px solid rgba(64, 118, 179)",
                background: " #e3e9ef",
                width: "24px",
                cursor: "pointer",
                height: "24px",
                borderRadius: "50%",
                display: "inline-block",
              }}
              onClick={(e) => {
                this.EditMode("Cancel");
              }}
            >
              <SvgIcon size={18} icon={ic_cancel} />
            </div>
          </div>
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "7px 0px 0px 0px",
              }}
            >
              <div
                style={styles.defaultTodayCommonStyleToday}
                key="Custom"
                onClick={(e) => {
                  this.handleFilterClick("Custom");
                }}
              >
                Custom
              </div>
              <div style={styles.divider} key="divider1">
                |
              </div>
              <div
                style={styles.defaultTodayCommonStyleAll}
                key="Default "
                onClick={(e) => {
                  this.handleFilterClick("Default");
                }}
              >
                Default
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      editButtons = permissionCheck("WORKPLAN", "plan_sort") && (
        <div style={{ padding: "10px 15px 0px", float: "right" }}>
          <div
            style={{
              padding: "0px 15px",
              color: "rgba(64, 118, 179)",
              display: "inline-block",
              cursor: "pointer",
            }}
            onClick={(e) => {
              this.EditMode("Edit");
            }}
          >
            <SvgIcon size={22} icon={edit} />
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          padding: "0px 15px 15px",
          width: "-webkit-fill-available",
        }}
      >
        {/* {permissionCheck('WORKPLAN', 'plan_sort') && <div>{editButtons}</div>} */}
        {!this.props.noFilter && (
          <CommonFilters
            noFilters
            tableInFilter
            checkTodayAllFilter={this.checkTodayAllFilter}
            tableColumns={this.state.columns}
            tableData={filterByDate(this.props.planningTableData, "createdAt")}
            pageSize={this.props.pageSize}
            // editorView={editButtons}
            pagination={true}
            //handlePageSize={this.props.handlePageSave}
            handlePageSave={this.props.handlePageSave}
            page={this.props.page}
          />
        )}
      </div>
    );
  }
}

export default Radium(JourneyPlanList);

function filterByDate(data, sortProp) {
  let sortedData = data.sort((a, b) => moment(b[sortProp]) - moment(a[sortProp]));
  return sortedData;
}

let getStyles = (props, state) => {
  // Borders ALL TODAY
  let borders = {
    defaultToday: {
      borderAllTop: "1px solid #e3e9ef",
      borderHoverTopAll: "1px solid rgba(64, 118, 179)",
      borderHoverTopToday: "1px solid rgba(64, 118, 179)",
      borderTodayTop: "1px solid #e3e9ef",
    },
  };
  if (state.defaultFilter) {
    borders.defaultToday.borderAllTop = "3px solid rgba(64, 118, 179)";
    borders.defaultToday.borderHoverTopAll = "3px solid rgba(64, 118, 179)";
  }
  if (state.customFilter) {
    borders.defaultToday.borderTodayTop = "3px solid rgba(64, 118, 179)";
    borders.defaultToday.borderHoverTopToday = "3px solid rgba(64, 118, 179)";
  }

  let commonStyle = {
    display: "inline-block",
    padding: "5px",
    margin: "0px 5px",
    fontSize: "12px",
    color: "rgba(64, 118, 179)",
    cursor: "pointer",

    borderBottom: "1px solid #e3e9ef",
    borderLeft: "1px solid #e3e9ef",
    borderRight: "1px solid #e3e9ef",
    borderRadius: "5px",
  };
  let hoverCommonStyle = {
    color: "rgba(64, 118, 179)",
    borderBottom: "1px solid rgba(64, 118, 179)",
    borderLeft: "1px solid rgba(64, 118, 179)",
    borderRight: "1px solid rgba(64, 118, 179)",
  };

  // BORDERS
  return {
    filterArea: { float: "left", fontFamily: "Arial", fontSize: "12px" },
    defaultTodayCommonStyleToday: {
      ...commonStyle,
      borderTop: borders.defaultToday.borderTodayTop,
      ":hover": {
        ...hoverCommonStyle,
        borderTop: borders.defaultToday.borderHoverTopToday,
      },
    },
    defaultTodayCommonStyleAll: {
      ...commonStyle,
      borderTop: borders.defaultToday.borderAllTop,
      ":hover": {
        ...hoverCommonStyle,
        borderTop: borders.defaultToday.borderHoverTopAll,
      },
    },
    divider: {
      display: "inline-block",
      color: "rgba(64, 118, 179)",
    },
  };
};
