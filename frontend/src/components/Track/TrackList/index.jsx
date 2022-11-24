import React, { Component } from "react";
import ThisTable from "components/Common/ThisTable/index";
import moment from "moment";
import Gravatar from "react-gravatar";
import { getStatusColor } from "utils/statusColors.js";
import { Link, Route } from "react-router-dom";
import { ButtonActionsTable } from "components/Common/Buttons";
import permissionCheck from "utils/permissionCheck.js";
import CommonFilters from "components/Common/Filters/CommonFilters";
import SyncLoader from "react-spinners/SyncLoader";
class TrackList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
    };

    this.columns = [
      {
        Header: "Subdivision",
        id: "subdivision",
        accessor: d => {
          let subdiv = "";
          if (d.subdivision) {
            subdiv = d.subdivision;
          }
          return <div style={{ textAlign: "center" }}> {subdiv} </div>;
        },
        minWidth: 150,
      },
      {
        Header: "Segment",
        id: "trackId",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.trackId} </div>;
        },
        minWidth: 100,
      },
      {
        Header: "Start (milepost)",
        id: "start",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.start} </div>;
        },
        minWidth: 100,
      },

      {
        Header: "End (milepost)",
        id: "end",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.end} </div>;
        },
        minWidth: 100,
      },
      {
        Header: "Length (milepost)",
        id: "length",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.assetGroupLength} </div>;
        },
        minWidth: 100,
      },
      {
        Header: "Track Type",
        id: "trackType",
        accessor: d => {
          return <div style={{ textAlign: "center" }}> {d.trackType + ""} </div>;
        },
        minWidth: 150,
      },
      {
        Header: "Traffic Type",
        id: "trafficType",
        accessor: d => {
          return <div style={{ textAlign: "center" }}> {d.trafficType + ""} </div>;
        },
        minWidth: 150,
      },
      {
        Header: "Allowed Weight",
        id: "weight",
        accessor: d => {
          return <div style={{ textAlign: "center" }}> {d.weight + ""} mgt </div>;
        },
        minWidth: 70,
      },
      {
        Header: "Class",
        id: "class",
        accessor: d => {
          return <div style={{ textAlign: "center" }}> {d.class + ""} </div>;
        },
        minWidth: 50,
      },
      {
        Header: "Plan",
        id: "planActions",
        accessor: d => {
          return (
            <div>
              {permissionCheck("TRACK WORKPLAN", "create") && !d.templateCreated && !d.showSpinner && (
                <ButtonActionsTable
                  handleClick={e => {
                    this.props.handleCreateWorkPlan(d);
                  }}
                  buttonText={"Create"}
                  margin="0px 10px 0px 0px"
                />
              )}
              {permissionCheck("WORKPLAN", "read") && d.templateCreated && !d.showSpinner && (
                <Link to={`workplantemplates/` + d.templateCreated} className="linkStyleTable">
                  <ButtonActionsTable
                    handleClick={e => {
                      this.props.handleGetTemplatePlan(d.templateCreated);
                    }}
                    margin="0px 10px 0px 0px"
                    buttonText={"View"}
                  />
                </Link>
              )}
              {d.showSpinner && <SyncLoader loading={this.props.showSpinner} color={"#5e8d8f"} size={5} />}
            </div>
          );
        },
        minWidth: 50,
      },
      {
        Header: "Actions",
        id: "actions",
        accessor: d => {
          return (
            <div>
              {permissionCheck("TRACK", "read") && (
                <Link to={`${this.props.path}s/` + d._id} className="linkStyleTable">
                  <ButtonActionsTable
                    handleClick={e => {
                      this.props.handleViewClick(d, this.props.pageSize);
                    }}
                    margin="0px 10px 0px 0px"
                    buttonText={"View"}
                  />
                </Link>
              )}
              {permissionCheck("TRACK", "update") && (
                <ButtonActionsTable
                  handleClick={e => {
                    this.props.handleEditClick("Edit", d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={"Edit"}
                />
              )}
              {permissionCheck("TRACK", "delete") && (
                <ButtonActionsTable
                  handleClick={e => {
                    this.props.handleDeleteClick(d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={"Delete"}
                />
              )}
            </div>
          );
        },
        minWidth: 150,
      },
    ];
  }

  render() {
    return (
      <div style={{ padding: "0px 15px 15px" }}>
        <CommonFilters
          tableInFilter
          noFilters
          tableColumns={this.columns}
          tableData={this.props.planningTableData}
          pageSize={this.props.pageSize}
          pagination={true}
          handlePageSave={this.props.handlePageSave}
          page={this.props.page}
        />
        {/* <div style={{ boxShadow: '3px 3px 5px #cfcfcf' }}>
          <ThisTable
            tableColumns={this.columns}
            tableData={this.props.planningTableData}
            pageSize={10}
            pagination={true}
            handlePageChange={page => this.props.handlePageSave(page)}
            page={this.props.page}
          />
        </div> */}
      </div>
    );
  }
}

export default TrackList;
