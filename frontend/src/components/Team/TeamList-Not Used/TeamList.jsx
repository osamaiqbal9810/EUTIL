import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import moment from "moment";
import ReactTable from "react-table";
import Gravatar from "react-gravatar";
import { check } from "react-icons-kit/metrize/check";
import { CardTypeOne } from "components/Common/Cards";
import SvgIcon from "react-icons-kit";
import { getStatusColor } from "utils/statusColors.js";
import PaginationComponent from "components/Common/ThisTable/PaginationComponent";
import { ButtonActionsTable } from "components/Common/Buttons";
import { issuesReportedSummaryStyle } from "components/IssuesReports/styles/IssuesReportedSummaryStyle.js";
import { ButtonCirclePlus } from "components/Common/Buttons";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import TeamAdd from "../TeamAddEdit/TeamAdd";
import { languageService } from "../../../Language/language.service";

class TeamList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AddModal: false,

      teamTableData: [
        {
          teamLead: "Supervisor 2",
          user: "abc@abc.com",
          marked: true,
          name: "John Jack",
        },
        {
          teamLead: "Supervisor 3",
          user: "abc@abc.com",
          marked: true,
          name: "John Jack",
        },
        {
          teamLead: "Supervisor 2",
          user: "abc@abc.com",
          name: "John Jack",
          marked: true,
        },
        {
          teamLead: "Supervisor 3",
          user: "abc@abc.com",
          name: "John Jack",
          marked: true,
        },
        {
          teamLead: "Supervisor 2",
          user: "abc@abc.com",
          name: "John Jack",
          marked: false,
        },
        {
          teamLead: "Supervisor 2",
          user: "abc@abc.com",
          name: "John Jack",
          marked: true,
        },
        {
          teamLead: "Supervisor 3",
          user: "abc@abc.com",
          name: "John Jack",
          marked: false,
        },
        {
          teamLead: "Supervisor 2",
          user: "abc@abc.com",
          name: "John Jack",
          marked: true,
        },
        {
          teamLead: "Supervisor 3",
          user: "abc@abc.com",
          name: "John Jack",
          marked: false,
        },
        {
          teamLead: "Supervisor 5",
          user: "abc@abc.com",
          name: "John Jack",
          marked: false,
        },
        {
          teamLead: "Supervisor 6",
          user: "abc@abc.com",
          name: "John Jack",
          marked: false,
        },
        {
          teamLead: "Supervisor 6",
          user: "abc@abc.com",
          name: "John Jack",
          marked: false,
        },
        {
          teamLead: "Supervisor 9",
          user: "abc@abc.com",
          name: "John Jack",
          marked: false,
        },
        {
          teamLead: "Supervisor 7",
          user: "abc@abc.com",
          name: "John Jack",
          marked: false,
        },
        {
          teamLead: "Supervisor 3",
          user: "abc@abc.com",
          name: "John Jack",
          marked: false,
        },
        {
          teamLead: "Supervisor 6",
          user: "abc@abc.com",
          name: "John Jack",
          marked: true,
        },
        {
          teamLead: "Supervisor 7",
          user: "abc@abc.com",
          name: "John Jack",
          marked: false,
        },
        {
          teamLead: "Supervisor 8",
          user: "abc@abc.com",
          name: "John Jack",
          marked: true,
        },
        {
          teamLead: "Supervisor 3",
          user: "abc@abc.com",
          name: "John Jack",
          marked: true,
        },
      ],
    };

    this.columns = [
      {
        Header: "Team Leader",
        accessor: "teamLead",
        minWidth: 175,
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
      {
        Header: "Team Member ",
        id: "user",
        Aggregated: (row) => <span />,
        accessor: (d) => {
          return (
            <div>
              <Gravatar style={{ borderRadius: "30px", marginRight: "10px" }} email={d.user} size={20} />
              {d.name}
            </div>
          );
        },
        minWidth: 150,

        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
      {
        Header: "Assigned To Plan",
        id: "marked",
        accessor: (d) => {
          return <div style={{ color: "var(--first)" }}>{d.marked && <SvgIcon size={20} icon={check} />}</div>;
        },
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
        Aggregated: (row) => <span />,

        minWidth: 90,
      },

      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }) => (
          <div>
            <ButtonActionsTable
              handleClick={(e) => {
                this.handleResolveClick(row);
              }}
              margin="0px 10px 0px 0px"
              buttonText={languageService(" View")}
            />
            <ButtonActionsTable
              handleClick={(e) => {
                this.handleResolveClick(row);
              }}
              buttonText={languageService("Remove")}
            />
          </div>
        ),
        minWidth: 175,
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
    ];
    this.handleAddNewClick = this.handleAddNewClick.bind(this);
    this.handleResolveClick = this.handleResolveClick.bind(this);
  }

  handleResolveClick(row) {
    //console.log("Resolve Clicked Row Received below");
    //console.log(row);
  }

  handleAddNewClick() {
    this.setState({
      AddModal: !this.state.AddModal,
    });
  }

  render() {
    return (
      <div>
        <TeamAdd modal={this.state.AddModal} toggle={this.handleAddNewClick} />
        <Row style={{ borderBottom: "2px solid #d1d1d1", margin: "0px 30px", padding: "10px 0px" }}>
          <Col md="6" style={{ paddingLeft: "0px" }}>
            <div
              style={{
                float: "left",
                fontFamily: "Myriad Pro",
                fontSize: "24px",
                letterSpacing: "0.5px",
                color: "var(--first)",
              }}
            >
              Teams
            </div>
          </Col>
        </Row>
        <Row style={{ margin: "0px" }}>
          <Col md="11">
            <Row style={{ margin: "0px", padding: "15px" }}>
              <Col md="3" style={issuesReportedSummaryStyle.cardContainer}>
                <CardTypeOne number="7" numberColor="var(--first)" topRight="" text="TOTAL TEAMS" />
              </Col>
              <Col md="3" style={issuesReportedSummaryStyle.cardContainer}>
                <CardTypeOne number="19" numberColor="#37B34A" topRight="" text="MEMBERS" />
              </Col>
              <Col md="3" style={issuesReportedSummaryStyle.cardContainer}>
                <CardTypeOne number="9" numberColor="#25A9E0" topRight="" text="ASSIGNED TO PLAN" />
              </Col>
            </Row>
          </Col>
          <Col md="1">
            <ButtonCirclePlus
              iconSize={70}
              icon={withPlus}
              handleClick={this.handleAddNewClick}
              backgroundColor="#e3e9ef"
              margin="20px 0px 0px 0px"
              borderRadius="50%"
              hoverBackgroundColor="#e3e2ef"
              hoverBorder="0px"
              activeBorder="3px solid #e3e2ef "
              iconStyle={{
                color: "#c4d4e4",
                background: "var(--fifth)",
                borderRadius: "50%",
                border: "3px solid ",
              }}
            />
          </Col>
        </Row>
        <div style={{ padding: "15px 30px" }}>
          <div style={{ padding: "15px", background: "var(--fifth)", boxShadow: "3px 3px 5px #cfcfcf" }}>
            <div>
              <ReactTable
                data={this.state.teamTableData}
                columns={this.columns}
                pivotBy={["teamLead"]}
                defaultPageSize={this.state.teamTableData.length}
                showPagination={true}
                minRows={1}
                className="scrollbar"
                style={{
                  border: "none",
                }}
                getTableProps={(state, rowInfo, column, instance) => {
                  return {
                    className: "scrollbarHor",
                  };
                }}
                getTbodyProps={(state, rowInfo, column, instance) => {
                  return {
                    className: "scrollbar",
                  };
                }}
                getTrProps={(state, rowInfo, column, instance) => {
                  let indexRow = null;
                  if (rowInfo) {
                    indexRow = rowInfo.index;
                  }
                  return {
                    className: "rowHover",
                    style: {
                      fontSize: "12px",
                      color: "var(--first)",
                      fontFamily: "Arial",
                      letterSpacing: "0.3px",
                      height: "35px",
                    },
                  };
                }}
                getTrGroupProps={(state, rowInfo, column, instance) => {
                  return {
                    style: {
                      borderBottom: "1px solid rgb(227, 233, 239)",
                    },
                  };
                }}
                getTdProps={(state, rowInfo, column, instance) => {
                  return {
                    style: {
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    },
                  };
                }}
                showPageJump={false}
                PaginationComponent={PaginationComponent}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TeamList;
