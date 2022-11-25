/* eslint eqeqeq: 0 */

import React from "react";
import { Row, Col, Button } from "reactstrap";
import { languageService } from "../../../Language/language.service";
import moment from "moment";
import { themeService } from "../../../theme/service/activeTheme.service";
import { ButtonStyle } from "../../../style/basic/commonControls";
import _ from "lodash";
import SvgIcon from "react-icons-kit";
import { pencil2 as pencil } from "react-icons-kit/icomoon/pencil2";
import { cross } from "react-icons-kit/icomoon/cross";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import { folderOpen } from "react-icons-kit/icomoon/folderOpen";
import AudioArea from "./AudioComponent/AudioArea";
// import { themeService } from "../../../theme/service/activeTheme.service";
//import { timpsSignalApp } from "../../../config/config";
import { versionInfo } from "../../MainPage/VersionInfo";
import permissionCheck from "../../../utils/permissionCheck";
import { maintenanceOptions, getMaintenanceOptionsValueToText } from "../IssuesList/IssuesList";

class Detail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      issue: _.cloneDeep(this.props.location.state.issue),
      isUpdatableIssue: false,
      commentsEditMode: false,
    };

    this.renderTrackManagerComments = this.renderTrackManagerComments.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.state.issue.title && this.props.location.state.issue.title !== prevProps.location.state.issue.title)
      this.setState({ issue: _.cloneDeep(this.props.location.state.issue) });
  }

  handleUpdateFields = (e) => {
    const { name, value } = e.target;
    let { issue } = _.cloneDeep(this.state);
    if ("serverObject" in issue && issue.serverObject) issue.serverObject[name] = value;
    else issue.serverObject = { [name]: value };
    let maintenanceAssign = name == "maintenanceRole" ? true : false;
    this.setState({ issue, isUpdatableIssue: true, maintenanceAssign: maintenanceAssign });
  };

  handleCancel = () => {
    this.setState({
      issue: _.cloneDeep(this.props.location.state.issue),
      isUpdatableIssue: false,
      commentsEditMode: false,
      maintenanceAssign: false,
    });
  };

  handleSubmit = async () => {
    let issueObj = {
      _id: this.state.issue.uniqueGuid,
      issuesReport: {
        action: "serverChanges",
        issue: _.cloneDeep(this.state.issue),
        maintenanceAssign: this.state.maintenanceAssign,
      },
    };

    if (this.state.isUpdatableIssue) {
      let response = await this.props.updateIssuesReport(issueObj);
      if (response.type === "ISSUESREPORT_UPDATE_SUCCESS") {
        // let resolved = this.state.maintenanceAssign && "Resolved";
        // let upIssue = this.state.issue;
        // if (resolved) {
        //   upIssue.status = "Resolved";
        // }
        this.setState(
          {
            isUpdatableIssue: false,
            commentsEditMode: false,
            maintenanceAssign: false,
          },
          () => {
            this.props.history.push({
              ...this.props.location,
              state: { issue: this.state.issue },
            });
          },
        );
      }
    }
  };

  renderTrackManagerComments() {
    const { issue } = this.state;
    const serverObject = issue.serverObject || {};

    if (this.state.commentsEditMode) {
      return (
        <React.Fragment>
          <Col md={"12"}>
            <div style={this.props.fieldHeading}>
              {languageService("Track Manager Comments")}:
              <SvgIcon
                size={15}
                icon={cross}
                onClick={this.handleCancel}
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
          </Col>
          <Col md={"12"}>
            <textarea
              style={{ width: "100%" }}
              value={serverObject.managerComments}
              name={"managerComments"}
              onChange={this.handleUpdateFields}
            />
          </Col>
        </React.Fragment>
      );
    }

    if (serverObject.managerComments) {
      return (
        <Col md={"12"}>
          <div style={this.props.fieldHeading}>
            {languageService("Track Manager Comments")}:
            <SvgIcon
              size={15}
              icon={pencil}
              onClick={(e) => this.setState({ commentsEditMode: true })}
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
          <div style={this.props.fieldText}>{serverObject.managerComments}</div>
        </Col>
      );
    }

    return (
      <React.Fragment>
        <Col md={"12"}>
          <div style={this.props.fieldHeading}>
            {languageService("Track Manager Comments")}: &nbsp;
            {permissionCheck("ISSUE CLOSE", "update") && (
              <button style={{ marginBottom: "10px" }} onClick={() => this.setState({ commentsEditMode: true })}>
                {languageService("Add Comment")}
              </button>
            )}
          </div>
        </Col>
      </React.Fragment>
    );
  }

  render() {
    const { issue } = this.state;
    const serverObject = issue.serverObject || {};
    let timpsSignalApp = versionInfo.isSITE();
    let elecUtilityApp = versionInfo.isEUtility();
    return (
      <div
        style={{
          margin: "0 0 10px 0",
          boxShadow: "rgb(207, 207, 207) 1px 1px 2px",
          padding: "15px",
          textAlign: "left",
          marginBottom: "20px",
        }}
      >
        <Row>
          <Col md={"12"}>
            <div style={this.props.fieldHeading}>{languageService("Asset Name")} :</div>
            <div style={this.props.fieldText}>
              {/* <Gravatar style={{ borderRadius: '30px', marginRight: '5px' }} email={'abc@abc.com'} size={20} /> */}
              {issue.trackId}
            </div>
          </Col>

          {issue.timestamp && (
            <Col md={"12"}>
              <div style={this.props.fieldHeading}>{languageService("Date")}:</div>
              <div style={this.props.fieldText}>{moment(moment.utc(issue.timestamp).toDate()).format("llll")}</div>
            </Col>
          )}

          <Col md={"12"}>
            <div style={this.props.fieldHeading}>{languageService("Title")} :</div>
            <div style={this.props.fieldText}>
              {/* <Gravatar style={{ borderRadius: '30px', marginRight: '5px' }} email={'abc@abc.com'} size={20} /> */}
              {issue.title}
            </div>
          </Col>

          <Col md={"12"}>
            <div style={this.props.fieldHeading}>
              {languageService("Description")} :
              {issue.issueType !== "Deficiency" &&
                this.props.findAssetTypeDefectsByName(issue) &&
                this.props.findAssetTypeDefectsByName(issue).length > 0 && (
                  <SvgIcon
                    size={20}
                    icon={folderOpen}
                    onClick={this.props.handleDefectCodeOpen}
                    style={{
                      marginRight: "5px",
                      marginLeft: "5px",
                      verticalAlign: "middle",
                      color: "var(--first)",
                      cursor: "pointer",
                      zIndex: "10",
                      position: "relative",
                    }}
                  />
                )}
            </div>
            <div style={this.props.fieldText}>
              {/* <Gravatar style={{ borderRadius: '30px', marginRight: '5px' }} email={'abc@abc.com'} size={20} /> */}
              {issue.description}
            </div>
          </Col>

          {moment(issue.timeStamp).isValid() && (
            <Col md={"12"}>
              <div style={this.props.fieldHeading}>{languageService("Created at")}:</div>
              <div style={this.props.fieldText}>{moment.utc(issue.timeStamp).local().format("ddd, MMM D, YYYY hh:mm a")}</div>
            </Col>
          )}

          {issue.voiceList && issue.voiceList.length > 0 && (
            <Col md="12">
              <div style={this.props.fieldHeading}>{languageService("Notes")}:</div>
              <div style={this.props.fieldText}>
                <AudioArea audio={issue.voiceList} />
              </div>
            </Col>
          )}

          <Col md={"12"}>
            <div style={this.props.fieldHeading}>{languageService("Information")}:</div>
            <div style={this.props.fieldText}>{issue.voiceNotes ? issue.voiceNotes : ""}</div>
          </Col>
          {!timpsSignalApp && !elecUtilityApp && (
            <Col md={"12"}>
              <div style={this.props.fieldHeading}>{languageService("Rail Direction")}:</div>
              <div style={this.props.fieldText}>{issue.railDirection ? issue.railDirection : ""}</div>
            </Col>
          )}
          {!timpsSignalApp && !this.props.disableRule213Config && (
            <Col md={"12"}>
              <div style={this.props.fieldHeading}>{languageService("Rule 213.9(b) Applied")}:</div>
              <div style={this.props.fieldText}>{issue.ruleApplied ? languageService("Yes") : "No"}</div>
            </Col>
          )}
          {!elecUtilityApp && (
            <Col md={"12"}>
              <div style={this.props.fieldHeading}>{languageService("Weather Conditions")}:</div>
              <div style={this.props.fieldText}>{issue.weatherConditions}</div>
            </Col>
          )}
          {!elecUtilityApp && (
            <Col md={"12"}>
              <div style={this.props.fieldHeading}>{languageService("Temperature")}:</div>
              <div style={this.props.fieldText}>
                {issue.temperature} {issue.tempUnit === "F" ? `℉` : `℃`}
              </div>
            </Col>
          )}
          <Col md={"12"}>
            <div style={this.props.fieldHeading}>{languageService("Inspector")}:</div>
            {this.props.getUserDisplay(issue.user)}
          </Col>

          <Col md={"12"}>
            <div style={this.props.fieldHeading}>{languageService("Status")}:</div>
            <div style={this.props.fieldText}>{issue.status || languageService("open")}</div>
          </Col>

          <Col md={"12"}>
            <div style={this.props.fieldHeading}>{languageService("Issue Type")}:</div>
            <div style={this.props.fieldText}>{issue.issueType ? issue.issueType : ""}</div>
          </Col>

          {issue.issueType === "Deficiency" && !timpsSignalApp && (
            <Col md={"12"}>
              <div style={this.props.fieldHeading}>{languageService("Add Deficiency to FRA Report")}:</div>
              <div style={this.props.fieldText}>
                <div style={{ marginLeft: "20px" }}>
                  <input
                    type="checkbox"
                    checked={!!serverObject.includeFRAReport}
                    onChange={() =>
                      this.handleUpdateFields({ target: { name: "includeFRAReport", value: !serverObject.includeFRAReport } })
                    }
                    name="includeFRAReport"
                  />
                </div>
              </div>
            </Col>
          )}

          {/* <Col md={"12"}>
            <div style={this.props.fieldHeading}>{languageService("Issue Priority")}:</div>
            <div style={this.props.fieldText}>
              {permissionCheck("ISSUE CLOSE", "update") && (
                <React.Fragment>
                  <select
                    disabled={issue.status || issue.status === "Open"}
                    onChange={this.handleUpdateFields}
                    name="issuePriority"
                    value={serverObject.issuePriority || ""}
                  >
                    <option value={""}>{languageService("Select Priority")}</option>
                    <option value={"low"}>{languageService("Low")}</option>
                    <option value={"medium"}>{languageService("Medium")}</option>
                    <option value={"high"}>{languageService("High")}</option>
                    <option value={"info"}>{languageService("Info")}</option>
                  </select>
                </React.Fragment>
              )}
            </div>
          </Col> */}
          {/* <Col md={"12"}>
            <div style={this.props.fieldHeading}>{languageService("Assign Maintenance")}:</div>
            <div style={this.props.fieldText}>
              {issue.status !== "Resolved" && permissionCheck("ISSUE CLOSE", "update") && (
                <React.Fragment>
                  <select onChange={this.handleUpdateFields} name="maintenanceRole" value={serverObject.maintenanceRole || ""}>
                    {maintenanceOptions()}
                  </select>
                </React.Fragment>
              )}
              {issue.status == "Resolved" && (
                <React.Fragment>
                  {serverObject.maintenanceRole ? getMaintenanceOptionsValueToText(serverObject.maintenanceRole) : "N/A"}
                </React.Fragment>
              )}
            </div>
          </Col> */}

          {this.renderTrackManagerComments()}

          {this.state.isUpdatableIssue && (
            <React.Fragment>
              <Col md={6}>
                <Button
                  onClick={this.handleSubmit}
                  type="submit"
                  style={{
                    height: "30px",
                    minWidth: "100%",
                    marginBottom: "20px",
                    backgroundColor: "rgb(255, 255, 255)",
                    color: "var(--second)",
                    fontSize: "12px",
                    cursor: "pointer",
                    borderRadius: "0px",
                    transitionDuration: "0.4s",
                    fontWeight: "bold",
                  }}
                >
                  {languageService("Save")}{" "}
                </Button>
              </Col>
              <Col md="6">
                <Button
                  onClick={this.handleCancel}
                  type="button"
                  style={{
                    height: "30px",
                    minWidth: "100%",
                    marginBottom: "20px",
                    backgroundColor: "rgb(255, 255, 255)",
                    color: "var(--second)",
                    fontSize: "12px",
                    cursor: "pointer",
                    borderRadius: "0px",
                    transitionDuration: "0.4s",
                    fontWeight: "bold",
                  }}
                >
                  {languageService("Cancel")}{" "}
                </Button>
              </Col>
            </React.Fragment>
          )}
        </Row>
      </div>
    );
  }
}

export default Detail;
