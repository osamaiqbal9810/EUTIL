/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Col } from "reactstrap";
import moment from "moment";
import { Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { ButtonActionsTable } from "components/Common/Buttons";
import ResponseForm from "./ResponseForm";
import CommonFilters from "components/Common/Filters/CommonFilters";
import { languageService } from "../../../../Language/language.service";
import AppForm from "./../../../Common/GenericForms";
import { versionInfo } from "../../../MainPage/VersionInfo";
import { LocPrefixService } from "../../../LocationPrefixEditor/LocationPrefixService";
let timpsSignalApp = versionInfo.isSITE();

class TrackUnitsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formModal: false,
      appFormModal: false,
      selectedTaskForms: {},
      pageSize: 30,
      page: 0,
      infoPopup: "",
      popupUnit: null,
    };

    this.showTaskResponseForms = this.showTaskResponseForms.bind(this);
    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.handleAppFormModalToggle = this.handleAppFormModalToggle.bind(this);
    this.handlePageSave = this.handlePageSave.bind(this);
    this.handleInfoPopup = this.handleInfoPopup.bind(this);

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
        Header: languageService("Start Time"),
        id: "startTime",
        accessor: (d) => {
          let date = "";
          if (d.startTime) {
            date = moment.utc(d.startTime).format("llll");
          }
          return date;
        },

        minWidth: 120,
      },
      {
        Header: languageService("End Time"),
        id: "endTime",
        accessor: (d) => {
          let date = "";
          if (d.endTime) {
            date = moment.utc(d.endTime).format("llll");
          }
          return date;
        },

        minWidth: 120,
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
        Header: languageService("Traversal"),
        id: "traversal",
        accessor: (d) => {
          if (d.traverseTrack) {
            let unit = d.units.find((u) => u.id === d.traverseTrack);
            unit.runId = d.title;

            return (
              <div
                onMouseOver={() => this.handleInfoPopup("mouseEnter", { ...unit, traverseBy: d.traverseBy })}
                onMouseOut={() => this.handleInfoPopup("mouseLeave", "")}
                style={{ overflowX: "hidden", zIndex: "1050", position: "relative", display: "block" }}
              >
                <div>
                  <div className="row">
                    <div className="col-12">
                      <div style={{ display: "inline-block" }}>{languageService(unit.unitId)}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div
                        style={{
                          display: "inline-block",
                          width: "110px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {languageService("Traverse By")}:{" "}
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        style={{
                          display: "inline-block",
                          width: "110px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {d.traverseBy}
                      </div>
                    </div>

                    <div className="col-6">
                      <div
                        style={{
                          display: "inline-block",
                          width: "110px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {languageService("Asset Type")}:{" "}
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        style={{
                          display: "inline-block",
                          width: "110px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {unit.assetType}
                      </div>
                    </div>

                    <div className="col-6">
                      <div
                        style={{
                          display: "inline-block",
                          width: "110px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {languageService("Milepost")}:{" "}
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        style={{
                          display: "inline-block",
                          width: "110px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {unit.start} - {unit.end}
                      </div>
                    </div>

                    <div className="col-6">
                      <div
                        style={{
                          display: "inline-block",
                          width: "110px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {languageService("Run")}:{" "}
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        style={{
                          display: "inline-block",
                          width: "110px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {unit.runId}
                      </div>
                    </div>
                  </div>
                </div>

                <div id={`popover-${unit.id}`} />
              </div>
            );
          }

          return <div style={{ textAlign: "center" }}>N/A </div>;
        },
        minWidth: 200,
      },
      {
        Header: languageService("Notes"),
        id: "notes",
        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{d.notes} </div>;
        },
        minWidth: 100,
      },
      {
        Header: languageService("Actions"),
        id: "actions",
        accessor: (d) => {
          let appForms =
            d.appForms && Array.isArray(d.appForms) && d.appForms.length > 0 ? (
              <ButtonActionsTable
                handleClick={(e) => {
                  this.showAppForms(d);
                }}
                margin="0px 10px 0px 0px"
                buttonText={languageService("AppForms")}
              />
            ) : null;
          return (
            <div>
              {/*{!timpsSignalApp && (*/}
              {/*<ButtonActionsTable*/}
              {/*handleClick={(e) => {*/}
              {/*this.showTaskResponseForms(d);*/}
              {/*}}*/}
              {/*margin="0px 10px 0px 0px"*/}
              {/*buttonText={languageService("Forms")}*/}
              {/*/>*/}
              {/*)}*/}

              {appForms}
            </div>
          );
        },
        minWidth: 100,
      },
    ];

    this.columns = this.columns.filter((c) => {
      return !(c.id === "actions" && timpsSignalApp);
    });
  }

  handleInfoPopup(action, unit) {
    if (action === "mouseEnter") {
      this.setState({ infoPopup: unit.id, popupUnit: unit });
    } else {
      this.setState({ infoPopup: "" });
    }
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

  showAppForms(task) {
    this.setState({
      appFormModal: !this.state.appFormModal,
      selectedTaskForms: task,
    });
  }

  handleModalToggle() {
    this.setState({
      formModal: !this.state.formModal,
    });
  }

  handleAppFormModalToggle() {
    this.setState({
      appFormModal: !this.state.appFormModal,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.tasksActionType !== prevProps.tasksActionType && this.props.tasksActionType == "JOURNEYPLANTASK_UPDATE_SUCCESS") {
      console.log(this.props.journeyPlan);
    }
  }

  render() {
    const unit = this.state.popupUnit;
    let mpPrefixStart = unit && LocPrefixService.getPrefixMp(unit.start, this.props.journeyPlan.lineId);
    let mpPrefixEnd = unit && LocPrefixService.getPrefixMp(unit.end, this.props.journeyPlan.lineId);
    return (
      <Col md="12">
        <ResponseForm
          modal={this.state.formModal}
          task={this.state.selectedTaskForms}
          toggle={this.handleModalToggle}
          handleClose={this.handleModalToggle}
        />

        <AppForm
          modal={this.state.appFormModal}
          task={this.state.selectedTaskForms}
          toggle={this.handleAppFormModalToggle}
          handleClose={this.handleAppFormModalToggle}
        />
        <div style={{ boxShadow: "3px 3px 5px #cfcfcf" }}>
          <CommonFilters
            tableInFilter
            noFilters
            tableColumns={this.columns}
            tableData={this.props.journeyPlan.tasks}
            pageSize={this.state.pageSize}
            pagination={true}
            handlePageSave={this.handlePageSave}
            page={this.state.page}
          />
          {/* <ThisTable tableColumns={this.columns} tableData={tasksData} pageSize={10} pagination={true} />*/}
        </div>

        {this.state.infoPopup !== "" && (
          <Popover placement="bottom" isOpen={this.state.infoPopup !== ""} target={`popover-${this.state.infoPopup}`} toggle={() => {}}>
            <PopoverHeader>{languageService(unit.unitId)}</PopoverHeader>
            <PopoverBody>
              <div className="row">
                <div className="col-6">
                  <div
                    style={{
                      display: "inline-block",
                      width: "110px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {languageService("Traverse By")}:{" "}
                  </div>
                </div>
                <div className="col-6">
                  <div
                    style={{
                      display: "inline-block",
                      width: "110px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {unit.traverseBy}
                  </div>
                </div>

                <div className="col-6">
                  <div
                    style={{
                      display: "inline-block",
                      width: "110px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {languageService("Asset Type")}:{" "}
                  </div>
                </div>
                <div className="col-6">
                  <div
                    style={{
                      display: "inline-block",
                      width: "110px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {unit.assetType}
                  </div>
                </div>

                <div className="col-6">
                  <div
                    style={{
                      display: "inline-block",
                      width: "110px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {languageService("Milepost")}:{" "}
                  </div>
                </div>
                <div className="col-6">
                  <div
                    style={{
                      display: "inline-block",
                      width: "110px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {mpPrefixStart} {unit.start} - {mpPrefixEnd} {unit.end}
                  </div>
                </div>

                <div className="col-6">
                  <div
                    style={{
                      display: "inline-block",
                      width: "110px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {languageService("Run")}:{" "}
                  </div>
                </div>
                <div className="col-6">
                  <div
                    style={{
                      display: "inline-block",
                      width: "110px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {unit.runId}
                  </div>
                </div>
              </div>
            </PopoverBody>
          </Popover>
        )}
      </Col>
    );
  }
}

export default TrackUnitsTable;
