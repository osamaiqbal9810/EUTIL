import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import CommonTeamListRow from "../CommonTeamListRow.jsx";
import CommonFilters from "components/Common/Filters/CommonFilters";
import { ButtonActionsTable } from "components/Common/Buttons";
import Gravatar from "react-gravatar";
import _ from "lodash";
import { languageService } from "../../../Language/language.service";
import { lang } from "moment";
import { themeService } from "../../../theme/service/activeTheme.service";
import { allMemberStyle } from "../styles/allMemberStyle";
import permissionCheck from "utils/permissionCheck.js";

export default class AllMembers extends Component {
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
        Header: languageService("User"),
        id: "iconUser",
        accessor: d => {
          return <Gravatar email={d.email} size={20} />;
        },
        minWidth: 100,
      },
      {
        Header: languageService("Name"),
        id: "name",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.name} </div>;
        },
        minWidth: 120,
      },
      {
        Header: languageService("Email"),
        id: "start",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.email} </div>;
        },
        minWidth: 160,
      },
      {
        Header: languageService("Actions"),
        id: "actions",
        accessor: d => {
          return (
            <div>
              {this.props.addAction && !d.selected && permissionCheck("TEAM", "create") && (
                <ButtonActionsTable
                  handleClick={e => {
                    this.props.handleAddtoTeam(d, this.props.ComponentName);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Add")}
                />
              )}
              {!this.props.noViewButton && permissionCheck("TEAM", "view") && (
                <ButtonActionsTable
                  handleClick={e => {
                    this.props.handleViewTeam(d, this.props.ComponentName);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("View")}
                />
              )}
              {this.props.deleteAction && permissionCheck("TEAM", "delete") && (
                <ButtonActionsTable
                  handleClick={e => {
                    this.props.handleDeleteFromTeam(d, this.props.ComponentName);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Remove")}
                />
              )}
              {d.selected == true && this.props.deleteFromTeamInModalButton && permissionCheck("TEAM", "delete") && (
                <ButtonActionsTable
                  handleClick={e => {
                    this.props.handleRemoveFromAddInModal(d, this.props.ComponentName);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Remove")}
                />
              )}
            </div>
          );
        },
        minWidth: 150,
      },
      {
        Header: languageService("Monday"),
        id: "monday",
        show: this.props.viewMode ? true : false,
        accessor: d => {
          // console.log("::", d);
          let chk = chkDayFreq(d, "1");
          return chk ? <div style={{ textAlign: "center" }}>{d.plans["1"].title} </div> : "";
        },
        minWidth: 120,
      },
      {
        Header: languageService("Tuesday"),
        id: "tuesday",
        show: this.props.viewMode ? true : false,
        accessor: d => {
          let chk = chkDayFreq(d, "2");
          return chk ? <div style={{ textAlign: "center" }}>{d.plans["2"].title} </div> : "";
        },
        minWidth: 120,
      },
      {
        Header: languageService("Wednesday"),
        id: "wednesday",
        show: this.props.viewMode ? true : false,
        accessor: d => {
          let chk = chkDayFreq(d, "3");
          return chk ? <div style={{ textAlign: "center" }}>{d.plans["3"].title} </div> : "";
        },
        minWidth: 120,
      },
      {
        Header: languageService("Thursday"),
        id: "thursday",
        show: this.props.viewMode ? true : false,
        accessor: d => {
          let chk = chkDayFreq(d, "4");
          return chk ? <div style={{ textAlign: "center" }}>{d.plans["4"].title} </div> : "";
        },
        minWidth: 120,
      },
      {
        Header: languageService("Friday"),
        id: "friday",
        show: this.props.viewMode ? true : false,
        accessor: d => {
          let chk = chkDayFreq(d, "5");
          return chk ? <div style={{ textAlign: "center" }}>{d.plans["5"].title} </div> : "";
        },
        minWidth: 120,
      },
      {
        Header: languageService("Saturday"),
        id: "saterday",
        show: this.props.viewMode ? true : false,
        accessor: d => {
          let chk = chkDayFreq(d, "6");
          return chk ? <div style={{ textAlign: "center" }}>{d.plans["6"].title} </div> : "";
        },
        minWidth: 120,
      },
      {
        Header: languageService("Sunday"),
        id: "sunday",
        show: this.props.viewMode ? true : false,
        accessor: d => {
          let chk = chkDayFreq(d, "7");
          return chk ? <div style={{ textAlign: "center" }}>{d.plans["7"].title} </div> : "";
        },
        minWidth: 120,
      },
    ];
    this.exampleSet = [
      { name: "John Doe1", email: "johndoe1@timps.com" },
      { name: "John Doe2", email: "johndoe2@timps.com" },
      { name: "John Doe3", email: "johndoe3@timps.com" },
      { name: "John Doe4", email: "johndoe4@timps.com" },
    ];
  }

  handlePageSave(page, pageSize) {
    this.setState({
      page: page,
      pageSize: pageSize,
    });
  }
  render() {
    //console.log(this.props.workplans);
    //console.log(this.props.userList);

    return (
      <Col md="12" style={{ padding: "0px", marginTop: "15px" }}>
        <Row style={themeService(allMemberStyle.tableHeading)}>{this.props.headerName}</Row>
        <Row style={{ margin: "5px 0px 5px" }} className={localStorage.getItem("theme")}>
          <CommonFilters
            tableInFilter
            noFilters
            tableColumns={this.columns}
            tableData={this.props.userList}
            pageSize={this.state.pageSize}
            pagination={true}
            handlePageSave={this.handlePageSave}
            page={this.state.page}
          />
        </Row>
      </Col>
    );
  }
}

function chkDayFreq(user, dayFreq) {
  if (user.plans) {
    return user.plans[dayFreq] ? true : false;
  } else {
    return false;
  }
}
