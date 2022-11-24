import React, { Component } from "react";
import { Row, Col, Tooltip } from "reactstrap";
import Gravatar from "react-gravatar";
import AllMembers from "../AllMembers/AllMembers";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "components/Common/Buttons";
import SvgIcon from "react-icons-kit";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import { maintenaceDetailstyle } from "../../Maintenance/styles/maintenanceDetailstyle";
import { themeService } from "../../../theme/service/activeTheme.service";
import { selectedTeamStyle } from "../styles/selectedTeamStyle";
import { commonSummaryStyle } from "../../Common/Summary/styles/CommonSummaryStyle";
import { languageService } from "../../../Language/language.service";
export default class SelectedTeam extends Component {
  constructor(props) {
    super(props);
    this.state = { tooltipOpen: false };
    this.styles = {
      userHeading: {
        color: "rgba(64, 118, 179)",
        fontSize: "14px",
        paddingBottom: "1em",
      },
      userStyle: {
        width: "50%",
        border: "1px solid #f1f1f1",
        boxShadow: "rgb(238, 238, 238) 1px 1px 1px",
        padding: "10px",
        borderRadius: "5px",
      },
      JourneyPlanInfoContainer: {
        background: "#fff",
        boxShadow: "3px 3px 5px #cfcfcf",
        margin: "0px 0px  0px 0px",
        padding: "15px",
        textAlign: "left",
        color: " rgba(64, 118, 179)",
        fontSize: "12px",
      },
    };
    this.toggleTooltip = this.toggleTooltip.bind(this);
  }

  toggleTooltip() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }

  render() {
    let inspectorsUsers = [];
    if (this.props.teamLead.team) {
      inspectorsUsers = this.props.teamLead;
      // To Do :- Find the team lead users in all users and push them to inspectorsUsers.
    }
    let showAddButton = true;
    return (
      <div>
        <Row>
          <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
            <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Team Detail")}</h4>
          </div>
        </Row>
        <Col md="12" style={{ padding: "0px" }}>
          <div style={themeService(selectedTeamStyle.detailInfoContainer)}>
            <Row>
              <Col md={"11"} style={{ textAlign: "left" }}>
                <div style={themeService(selectedTeamStyle.userHeading)}>{languageService("Supervisor")}</div>
                <div style={this.styles.userStyle}>
                  <Gravatar
                    style={{
                      borderRadius: "30px",
                      marginRight: "5px",
                    }}
                    email={"abc@abc.com"}
                    size={20}
                  />
                  {this.props.teamLead.name}
                </div>
              </Col>
              <Col md="1">
                {showAddButton && (
                  <div id="toolTipAddTeamMembers">
                    <ButtonCirclePlus
                      iconSize={60}
                      icon={withPlus}
                      handleClick={(e) => {
                        this.props.handleAddTeamMembers();
                      }}
                      {...themeService(commonSummaryStyle.addButtonStyle(this.props))}
                    />
                    <Tooltip isOpen={this.state.tooltipOpen} target="toolTipAddTeamMembers" toggle={this.toggleTooltip}>
                      {languageService("Add Team Member")}
                    </Tooltip>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Col>
      </div>
    );
  }
}

let planStyle = {
  userHeading: {
    color: "rgba(64, 118, 179)",
    fontSize: "14px",
    paddingBottom: "1em",
  },
  userStyle: {
    width: "50%",
    border: "1px solid #f1f1f1",
    boxShadow: "rgb(238, 238, 238) 1px 1px 1px",
    padding: "10px",
    borderRadius: "5px",
  },
  dateHeading: {
    color: "rgba(64, 118, 179)",
    fontSize: "14px",
    padding: "2em 0em 1em ",
  },
  dateStyle: {
    width: "fit-content",
    border: "1px solid #f1f1f1",
    boxShadow: "rgb(238, 238, 238) 1px 1px 1px",
    padding: "10px",
    borderRadius: "5px",
    display: "inline-block",
  },
  copyButtonContainer: { display: "inline-block", marginLeft: "10px" },
  journeyPlanDateTableContainer: {
    marginTop: "30px",
  },
  JourneyPlanInfoContainer: {
    background: "#fff",
    boxShadow: "3px 3px 5px #cfcfcf",
    margin: "0px 30px  0px 30px",
    padding: "15px",
    textAlign: "left",
    color: " rgba(64, 118, 179)",
    fontSize: "12px",
  },
  fieldHeading: {
    color: "rgba(64, 118, 179)",
    fontWeight: "600",
    fontSize: "14px",
    paddingBottom: "0.5em",
  },
  fieldText: {
    color: "rgba(64, 118, 179)",
    fontSize: "14px",
    paddingBottom: "1em",
  },
};
