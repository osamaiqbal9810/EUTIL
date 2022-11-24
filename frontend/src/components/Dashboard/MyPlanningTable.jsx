/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import Gravatar from "react-gravatar";
import { getStatusColor } from "utils/statusColors.js";
import JourneyPlanList from "components/JourneyPlan/JourneyPlanList/index";
import { languageService } from "../../Language/language.service";
import { themeService } from "../../theme/service/activeTheme.service";
import { commonStylesDashboard } from "./styles/commonStylesDashboard";
import { MyPlanningTableStyle } from "./styles/MyPlanningTableStyle";

class MyPlanningTable extends Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        Header: "Title",
        accessor: "title",
        minWidth: 200,
      },
      {
        Header: "User",
        id: "assignedUser",

        accessor: d => {
          return (
            <div className="CustomAvatar-person " style={themeService(MyPlanningTableStyle.gravatarStyle)}>
              <Gravatar email={d.assignedUser} size={20} />
            </div>
          );
        },
        width: 60,
      },
      {
        Header: "Date",
        id: "Date",
        minWidth: 160,

        accessor: d => {
          return d.date;
        },
      },
      {
        Header: "Status",
        id: "Status",
        minWidth: 150,
        accessor: d => {
          let status = "Unknown";
          if (d.status) {
            status = d.status;
          }
          return (
            <div
              style={{
                background: getStatusColor(status),
                ...themeService(MyPlanningTableStyle.statusStyle),
              }}
            >
              {status}
            </div>
          );
        },
      },
    ];
  }

  render() {
    return (
      <Col md="12">
        {this.props.showHeading && <Row style={themeService(commonStylesDashboard.tableHeadings)}>{languageService("Inspections")}</Row>}
        <Row style={themeService(MyPlanningTableStyle.planningTableContainerMargin)}>
          <JourneyPlanList
            planningTableData={this.props.journeyPlans}
            noActionColumn
            actionType={this.props.actionType}
            handlePageSave={this.props.handlePageSave}
            pageSize={this.props.pageSize}
            page={this.props.page}
            planFilter={this.props.planFilter}
            resetPage={this.props.resetPage}
            noFilter
            forDashboard
            classNameCustom={"fillFullHeight"}
            fromDashboardToLink={"/inspection"}
          />
        </Row>
      </Col>
    );
  }
}

export default MyPlanningTable;
