import React, { Component } from "react";
import ThisTable from "components/Common/ThisTable/index";
import { getStatusColor } from "utils/statusColors.js";
import { Row, Col, Label, Button } from "reactstrap";
import moment from "moment";
import { ButtonActionsTable } from "components/Common/Buttons";
import ResponseForm from "./ResponseForm";
import CommonFilters from "components/Common/Filters/CommonFilters";
import { languageService } from "../../../../Language/language.service";
import permissionCheck from "../../../../utils/permissionCheck";
class TrackUnitsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formModal: false,
      selectedTaskForms: {},
      pageSize: 30,
      page: 0,
    };

    this.showTaskResponseForms = this.showTaskResponseForms.bind(this);
    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.handlePageSave = this.handlePageSave.bind(this);

    this.columns = [
      {
        Header: "#",
        id: "row",
        maxWidth: 50,
        filterable: false,
        Cell: (row) => {
          return <div style={{ textAlign: "center" }}>{row.index + 1}</div>;
        },
      },
      {
        Header: languageService("Title"),
        id: "title",
        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{d.title} </div>;
        },
        minWidth: 100,
      },
      {
        Header: languageService("Description"),
        id: "description",
        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{d.desc} </div>;
        },
        minWidth: 150,
      },

      {
        Header: languageService("Units"),
        id: "units",
        accessor: (d) => {
          let unitsToShow = d.units.map((unitOp, index) => {
            let comma = ",";
            if (index == d.units.length - 1) {
              comma = ".";
            }
            return (
              <div style={{ display: "inline-block", marginRight: "3px", color: "inherit" }} key={unitOp.id}>
                {unitOp.unitId}
                {comma}{" "}
              </div>
            );
          });
          return (
            <div
              style={{
                fontSize: "12px",
                color: "inherit",
              }}
            >
              {unitsToShow}
            </div>
          );
        },
        minWidth: 200,
      },
      {
        Header: languageService("Notes"),
        id: "notes",
        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{d.notes} </div>;
        },
        minWidth: 200,
      },
      {
        Header: languageService("Actions"),
        id: "actions",
        accessor: (d) => {
          let firstTask = null;
          if (
            this.props.journeyPlan &&
            this.props.journeyPlan.tasks &&
            this.props.journeyPlan.tasks.length > 0 &&
            d.taskId == this.props.journeyPlan.tasks[0].taskId
          ) {
            firstTask = true;
          }
          return (
            <div>
              {/* {!planDatePassed && !taskStarted && ( */}
              {permissionCheck("INSPECTION TASK", "update") && (
                <ButtonActionsTable
                  handleClick={(e) => {
                    this.props.handleEditClick("Edit", d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Edit")}
                />
              )}
              {/* )} */}
              {/* {!planDatePassed && !planDateToday && !taskStarted && ( */}
              {!firstTask && permissionCheck("INSPECTION TASK", "delete") && (
                <ButtonActionsTable
                  handleClick={(e) => {
                    this.props.handleDeleteClick(d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Delete")}
                />
              )}
              {/* )} */}

              {/* <ButtonActionsTable
                handleClick={e => {
                  this.showTaskResponseForms(d)
                }}
                margin="0px 10px 0px 0px"
                buttonText={'Forms'}
              /> */}
            </div>
          );
        },
        minWidth: 100,
      },
    ];
  }

  handlePageSave(page, pageSize) {
    this.setState({
      page: page,
      pageSize: pageSize,
    });
  }

  showTaskResponseForms(task) {
    console.log(task);
    this.setState({
      formModal: !this.state.formModal,
      selectedTaskForms: task,
    });
  }

  handleModalToggle() {
    this.setState({
      formModal: !this.state.formModal,
    });
  }

  render() {
    let tasksData = [];
    if (this.props.journeyPlan.tasks) {
      tasksData = this.props.journeyPlan.tasks;
    }
    return (
      <Col md="12">
        <ResponseForm
          modal={this.state.formModal}
          task={this.state.selectedTaskForms}
          toggle={this.handleModalToggle}
          handleClose={this.handleModalToggle}
        />
        <div style={{ boxShadow: "3px 3px 5px #cfcfcf" }}>
          <CommonFilters
            tableInFilter
            noFilters
            tableColumns={this.columns}
            tableData={tasksData}
            pageSize={this.state.pageSize}
            pagination={true}
            handlePageSave={this.handlePageSave}
            page={this.state.page}
          />
          {/* <ThisTable tableColumns={this.columns} tableData={tasksData} pageSize={10} pagination={true} />*/}
        </div>
      </Col>
    );
  }
}

export default TrackUnitsTable;
