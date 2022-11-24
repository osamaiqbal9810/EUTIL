import React, { Component } from "react";
import ThisTable from "components/Common/ThisTable/index";
import { getStatusColor } from "utils/statusColors.js";
import { Row, Col, Label, Button } from "reactstrap";
import moment from "moment";
import { ButtonActionsTable } from "components/Common/Buttons";
import CommonFilters from "components/Common/Filters/CommonFilters";
import { languageService } from "../../../../Language/language.service";
class TrackUnitsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 30,
      page: 0,
    };
    this.handlePageSave = this.handlePageSave.bind(this);
    this.columns = [
      {
        Header: "#",
        id: "row",
        maxWidth: 50,
        filterable: false,
        Cell: row => {
          return <div style={{ textAlign: "center" }}>{row.index + 1}</div>;
        },
      },
      {
        Header: "Asset",
        id: "name",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.assetType} </div>;
        },
        minWidth: 150,
      },
      {
        Header: "Asset Id",
        id: "assetId",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.unitId} </div>;
        },
        minWidth: 150,
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
          return <div style={{ textAlign: "center" }}>{d.assetLength} </div>;
        },
        minWidth: 100,
      },
      {
        Header: "Past Issue",
        id: "pastIssue",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.pastIssue} </div>;
        },
        minWidth: 100,
      },
      {
        Header: "Last Inspected",
        id: "lastDateInspected",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.lastInspection} </div>;
        },
        minWidth: 120,
      },
      {
        Header: "Next Inspection",
        id: "nextDateInspected",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.nextInspection} </div>;
        },
        minWidth: 120,
      },
      // {
      //   Header: 'Turnarounds',
      //   id: 'turnarounds',
      //   accessor: d => {
      //     return <div style={{ textAlign: 'center' }}>{d.turnarounds} </div>
      //   },
      //   minWidth: 100
      // },
      // {
      //   Header: 'Switches',
      //   id: 'switches',
      //   accessor: d => {
      //     return <div style={{ textAlign: 'center' }}>{d.switches} </div>
      //   },
      //   minWidth: 100
      // },
      // {
      //   Header: 'Frequency',
      //   id: 'frequency',
      //   accessor: d => {
      //     return <div style={{ textAlign: 'center' }}>{d.frequency} </div>
      //   },
      //   minWidth: 100
      // },
      {
        Header: "Actions",
        id: "actions",
        accessor: d => {
          return (
            <div>
              <ButtonActionsTable
                handleClick={e => {
                  this.props.handleEditClick("Edit", d);
                }}
                margin="0px 10px 0px 0px"
                buttonText={"Edit"}
              />
              <ButtonActionsTable
                handleClick={e => {
                  this.props.handleDeleteClick(d);
                }}
                margin="0px 10px 0px 0px"
                buttonText={"Delete"}
              />
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

  render() {
    let unitsData = [];
    if (this.props.track.units) {
      unitsData = this.props.track.units;
    }
    return (
      <Col md="12">
        <div
          style={{
            background: "#fff",
            padding: "0px 0px 8px 15px",
            fontSize: "18px",
            letterSpacing: "0.95px",
            fontFamily: "Arial",
            textAlign: "left",
            color: "rgba(64, 118, 179)",
            marginBottom: "10px",
          }}
        >
          {languageService("Assets")}
        </div>
        <div style={{ boxShadow: "3px 3px 5px #cfcfcf" }}>
          <CommonFilters
            tableInFilter
            noFilters
            tableColumns={this.columns}
            tableData={unitsData}
            pageSize={this.state.pageSize}
            pagination={true}
            handlePageSave={this.handlePageSave}
            page={this.state.page}
          />
          {/* <ThisTable tableColumns={this.columns} tableData={unitsData} pageSize={10} pagination={true} /> */}
        </div>
      </Col>
    );
  }
}

export default TrackUnitsTable;
