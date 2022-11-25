/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import Gravatar from "react-gravatar";
import moment from "moment";
import SvgIcon from "react-icons-kit";
import { ic_gps_fixed } from "react-icons-kit/md/ic_gps_fixed";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import { circle } from "react-icons-kit/fa/circle";
import { ic_arrow_back } from "react-icons-kit/md/ic_arrow_back";
import { Link, Route } from "react-router-dom";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
import MapBox from "components/GISMAP";
import CommonModal from "components/Common/CommonModal";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import ImageArea from "components/Common/ImageArea";
import { languageService } from "../../../Language/language.service";
import Detail from "./IssueDetail";
import DefectCodes from "components/IssuesReports/DefectCodes/DefectCodes";
import { themeService } from "../../../theme/service/activeTheme.service";
import { commonStyles } from "../../../theme/commonStyles";
import { maintenaceDetailstyle } from "../../Maintenance/styles/maintenanceDetailstyle";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { substractObjects } from "../../../utils/utils";
import { getAssetLinesWithSelf } from "../../../reduxRelated/actions/assetHelperAction";
// import _ from "lodash";
import { LocPrefixService } from "../../LocationPrefixEditor/LocationPrefixService";

class IssueDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      issue: {},
      lineAsset: {},
      spinnerLoading: false,
      gisDisplay: true,
      maintenanceDefectCodesObj: null,
      classToShow: "d-none",
      displayTitle: languageService("Show Inactive"),
    };

    const permissionColActions = { immediate: [], editMode: [] };
    permissionColActions.editMode.push(languageService("Save"));
    permissionColActions.editMode.push(languageService("Close"));
    this.handleMaintenanceLocationClick = this.handleMaintenanceLocationClick.bind(this);
    this.handleDefectCode = this.handleDefectCode.bind(this);
    this.formatLocation = this.formatLocation.bind(this);
    this.setIssueToState = this.setIssueToState.bind(this);
    this.findAssetTypeDefectsByName = this.findAssetTypeDefectsByName.bind(this);
  }

  showToastInfo(message) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  showToastError(message, error) {
    let toastMessage = message + ": " + error;
    if (!error) {
      toastMessage = message;
    }

    toast.error(toastMessage, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  async componentDidMount() {
    await this.props.getAssetLinesWithSelf();
    this.setIssueToState();
    if (this.props.assetTypes.length === 0) {
      this.props.getAssetType();
    }
    this.props.getApplicationlookups("config/disableRule213");
  }

  setIssueToState() {
    let issue = this.props.location.state ? this.props.location.state.issue : null;

    if (issue) {
      let startMPPrefix = LocPrefixService.getPrefixMp(issue.startMp, issue.lineId);
      let endMPPrefix = LocPrefixService.getPrefixMp(issue.endMp, issue.lineId);
      if (!issue.lineName) {
        const line = this.props.lineAssets.find((l) => l._id === issue.lineId);
        if (line) issue.lineName = line.unitId;
      }

      if (typeof issue.location === "string") {
        let loc = issue.location.split(",");
        let mpVals = {
          type: "Milepost",
          start: issue.startMp,
          end: issue.endMp,
          sPrefix: startMPPrefix,
          ePrefix: endMPPrefix,
        };

        issue.location = [];
        issue.location.push({
          type: "GPS",
          start: { lat: loc[0], lon: loc[1] },
          end: { lat: loc[0], lon: loc[1] },
        });
        if (issue.startMarker) {
          issue.location.push({ start: issue.startMarker, end: issue.endMarker, type: "Marker" });
        } else {
          issue.location.push(mpVals);
        }
      }

      this.setState(
        {
          issue,
        },
        () => {
          this.handleMaintenanceLocationClick(0);
        },
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.assetHelperActionType === "GET_LINE_ASSETS_WITH_SELF_SUCCESS" &&
      prevProps.assetHelperActionType !== this.props.assetHelperActionType
    ) {
      this.setLineAssets(this.props.lineAssets);
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType === "APPLICATIONLOOKUPS_READ_SUCCESS"
    ) {
      this.setState({
        disableRule213Config: this.props.applicationlookups && this.props.applicationlookups[0] && this.props.applicationlookups[0].opt2,
      });
    }
  }

  setLineAssets(assets) {
    // this.setState({ lineAsset: asset });
    const issue = this.props.location.state ? this.props.location.state.issue : null;

    assets.forEach((element) => {
      if (issue && element._id === issue.lineId) {
        this.setState({ lineAsset: element });
        //console.log('Line asset set:',element);
      }
    });
  }

  handleMaintenanceLocationClick(index) {
    let selectedAsset = { start: 5, end: 5, icon: "circle-stroked-15" };
    let location = this.state.issue.location ? this.state.issue.location[index] : null;

    if (!location) return false;

    let line = null,
      enableDisplay = true;

    // console.log('handleMaintenanceLocationClick', {index}, this.state.issue.location[index]);
    //console.log(obj.target, obj.prop, obj.value);
    if (location.type == "GPS") {
      selectedAsset = { type: "GPS", start: location.start, end: location.end };
    } else if (location.type == "Milepost") {
      selectedAsset.start = location.start;
      selectedAsset.end = location.end;
      selectedAsset.text = location.unitId;
      selectedAsset.visible = true;
      selectedAsset._id = location._id;
      // selectedAsset. = offset,
      if (this.props.lineAssets && this.state.issue && this.state.issue.lineId) {
        line = this.props.lineAssets.find((l) => {
          return l._id == this.state.issue.lineId;
        });
      } else enableDisplay = false;
    }
    // if(selectedAsset!={}) // todo enable this

    this.setState({ gisDisplay: enableDisplay, selectedAsset: selectedAsset, lineAsset: line });
  }

  getUserDisplay(user) {
    if (!user) return false;
    return (
      <div style={themeService(maintenaceDetailstyle.fieldText)}>
        <Gravatar style={{ borderRadius: "30px", marginRight: "5px" }} email={user.email} size={20} /> {user.name}
      </div>
    );
  }

  handleDefectCode() {
    this.setState({
      classToShow: this.state.classToShow === "d-none" ? "show" : "d-none",
      displayTitle:
        this.state.displayTitle === languageService("Hide Inactive") ? languageService("Show Inactive") : languageService("Hide Inactive"),
    });
  }

  findAssetTypeDefectsByName = (maintenance) => {
    let at = null;
    let dc = null;
    const { assetTypes } = this.props;

    if (maintenance && maintenance.unit && assetTypes) at = assetTypes.find((a) => a.assetType === maintenance.unit.assetType);

    if (at && at.defectCodesObj) {
      dc = at.defectCodesObj.details;
    }

    return dc;
  };

  format2Digit(num) {
    return num && !isNaN(parseFloat(num)) ? parseFloat(num).toFixed(2) : "0.00";
  }

  formatLocation(l1, index, len) {
    let result = null;
    if (l1.type == "Marker") {
      result = (
        <div style={{ ...themeService(maintenaceDetailstyle.gpsIconTextStyle), ...{ paddingLeft: "45px" } }} key={l1.type}>
          {languageService("Marker") + ": " + l1.start + " - " + l1.end}
        </div>
      );
    } else if (l1.type != "none") {
      let formatstr = l1.type + ": ",
        diff = substractObjects(l1.start, l1.end);
      let lat = l1.start.lat ? l1.start.lat.toString() : "";
      let lon = l1.start.lon ? l1.start.lon.toString() : "";

      formatstr += l1.type === "GPS" ? lat + ", " + lon : (l1.sPrefix ? l1.sPrefix : "") + this.format2Digit(l1.start);

      if (
        (typeof l1.end == "object" && l1.end != {} && Object.keys(diff).length != 0) ||
        (typeof l1.end != "object" && l1.end != "" && l1.start != l1.end)
      ) {
        let endLat = l1.end.lat ? l1.end.lat.toString() : "";
        let endLon = l1.end.lon ? l1.end.lon.toString() : "";
        formatstr += " -> ";
        formatstr += l1.type === "GPS" ? endLat + ", " + endLon : (l1.ePrefix ? l1.ePrefix : "") + this.format2Digit(l1.end);
      }

      let style = { ...themeService(maintenaceDetailstyle.gpsIconTextStyle) };

      if (index != len - 1) {
        style.borderBottom = "0px";
      }

      let isValidLocation = true;
      if (formatstr.includes("GPS: ,  -> , ")) {
        formatstr = formatstr.replace("GPS: ,  -> , ", "GPS: Not Available");
        isValidLocation = false;
      }

      result = (
        <div style={style} key={l1.type}>
          <button
            style={themeService(maintenaceDetailstyle.gpsIconStyle)}
            onClick={() => {
              if (isValidLocation) this.handleMaintenanceLocationClick(index);
            }}
          >
            <SvgIcon icon={ic_gps_fixed} size={18} />
          </button>
          {formatstr}
        </div>
      );
    }

    return result;
  }

  render() {
    let mainTitle = languageService("Issue");
    let issue1 = this.state.issue;
    let displayGIS = true;

    let remediation = {
      title: "",
      fixedOnSite: false,
      text: "",
      items: [],
    };

    if (issue1.marked) {
      remediation.title = "Fixed on Site";
      remediation.fixedOnSite = true;
      remediation.text = issue1.fixType;
    } else {
      remediation.title = issue1.remedialAction;
      remediation.fixedOnSite = false;
      remediation.items = issue1.remedialActionItems || [];
    }

    let imageBefore = [];
    let imageAfter = [];

    if (issue1.imgList && issue1.imgList.length > 0) {
      issue1.imgList.forEach((imgObj) => {
        if (imgObj.tag === "before") {
          imageBefore.push({ ...imgObj, displayTitle: "before" });
        } else {
          imageAfter.push({ ...imgObj, displayTitle: "after" });
        }
      });
    }

    if (this.state.selectedAsset && this.state.selectedAsset.type != "GPS") {
      // if lineAsset is not there, do not display linear maintenance
      displayGIS = this.state.lineAsset && this.state.lineAsset._id;
    }

    if (!issue1.location) {
      issue1.location = [{ start: "", end: "", type: "none" }];
    }

    let LocationsComp = [];
    let len = issue1.location.length;
    issue1.location.forEach((l1, index) => {
      let r = this.formatLocation(l1, index, len);
      if (r != null) LocationsComp.push(r);
    });
    // });

    return (
      <div id="mainContent">
        <CommonModal
          headerText={languageService("Defect Codes")}
          setModalOpener={(method) => {
            this.openModelMethod = method;
          }}
          footerCancelText={languageService("Close")}
        >
          <button
            className="setPasswordButton"
            onClick={this.handleDefectCode}
            style={{ position: "absolute", top: "-45px", right: "20px", ...themeService(ButtonStyle.commonButton) }}
          >
            {this.state.displayTitle}
          </button>
          <DefectCodes
            classToShow={this.state.classToShow}
            selectedIssue={{ unit: issue1.unit, defectCodes: issue1.defectCodes }}
            assetTypes={this.props.assetTypes}
          />
        </CommonModal>
        <ConfirmationDialog
          modal={this.state.confirmationDialog}
          toggle={this.handleConfirmationToggle}
          handleResponse={this.handleConfirmation}
          confirmationMessage={`${languageService("Are you sure you want to delete")}?`}
          headerText={languageService("Confirm Deletion")}
        />

        <Row style={{ borderBottom: "2px solid #d1d1d1", margin: "0px 30px", padding: "10px 0px" }}>
          <Col md="6" style={{ paddingLeft: "0px" }}>
            <div style={themeService(commonStyles.pageTitleDetailStyle)}>
              <Link to="/issuereports" className="linkStyleTable">
                <SvgIcon
                  size={25}
                  icon={ic_arrow_back}
                  style={{ marginRight: "5px", marginLeft: "5px", verticalAlign: "middle", cursor: "pointer" }}
                />
              </Link>
              <SvgIcon size={12} icon={circle} style={{ marginRight: "10px", marginLeft: "5px" }} />
              {mainTitle}
            </div>
          </Col>
        </Row>
        <Row style={{ margin: "0px" }}>
          <Col md="12">
            <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Issue Details")}</h4>
            </div>
          </Col>
          <Col md={"3"} style={{ padding: "0px" }}>
            <div style={{ ...themeService(maintenaceDetailstyle.MaintenanceDetailsContainer), margin: "0 0 0 30px" }}>
              <Detail
                MaintenanceDetailsContainer={themeService(maintenaceDetailstyle.MaintenanceDetailsContainer)}
                fieldHeading={themeService(maintenaceDetailstyle.fieldHeading)}
                fieldText={themeService(maintenaceDetailstyle.fieldText)}
                getUserDisplay={this.getUserDisplay}
                issue1={issue1}
                updateIssuesReport={this.props.updateIssuesReport}
                location={this.props.location}
                history={this.props.history}
                findAssetTypeDefectsByName={this.findAssetTypeDefectsByName}
                handleDefectCodeOpen={() => this.openModelMethod()}
                disableRule213Config={this.state.disableRule213Config}
              />
              <Row>
                <Col md="12">
                  {/*<div style={themeService(maintenaceDetailstyle.fieldHeading)}> {languageService("Description")}: </div>*/}
                  <div style={themeService(maintenaceDetailstyle.MaintenanceDescriptionContainer)}>
                    {/*<div style={themeService(maintenaceDetailstyle.fieldText)}>{issue1.description}</div>*/}

                    {imageBefore.length > 0 && (
                      <Row>
                        <Col md="12">
                          <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Image Before")}:</div>
                          <div style={themeService(maintenaceDetailstyle.fieldText)}>
                            {" "}
                            <ImageArea path="applicationresources" imagesList={imageBefore} />
                          </div>
                        </Col>
                      </Row>
                    )}

                    <Row>
                      <Col md="12">
                        <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Remedial Action")}:</div>
                        <div style={themeService(maintenaceDetailstyle.fieldText)}> {languageService(remediation.title)} </div>
                        <br />
                        <div style={themeService(maintenaceDetailstyle.fieldText)}>
                          <div>
                            {remediation.fixedOnSite && (
                              <React.Fragment>
                                <div className="row">
                                  <div className="col-6">
                                    <div
                                      style={{
                                        display: "inline-block",
                                        fontWeight: 700,
                                      }}
                                    >
                                      {languageService("Fix Type")}:
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div
                                      style={{
                                        display: "inline-block",
                                      }}
                                    >
                                      {remediation.text}
                                    </div>
                                  </div>
                                </div>
                              </React.Fragment>
                            )}

                            {!remediation.fixedOnSite && (
                              <React.Fragment>
                                {remediation.items.map((ra) => (
                                  <React.Fragment key={ra.id}>
                                    <div className="row">
                                      <div className="col-12">
                                        <div
                                          style={{
                                            display: "inline-block",
                                            fontWeight: 700,
                                          }}
                                        >
                                          {languageService(ra.desc)}
                                          {ra.desc.includes(":") ? "" : ":"}
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <div
                                          style={{
                                            display: "inline-block",
                                          }}
                                        >
                                          {ra.value}
                                        </div>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                ))}
                              </React.Fragment>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {imageAfter.length > 0 && (
                      <Row>
                        <Col md="12">
                          <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Image After")}:</div>
                          <div style={themeService(maintenaceDetailstyle.fieldText)}>
                            {" "}
                            <ImageArea path="applicationresources" imagesList={imageAfter} />
                          </div>
                        </Col>
                      </Row>
                    )}

                    <Row>
                      {/*{issue1.voiceList && issue1.voiceList.length > 0 && (*/}
                      {/*<Col md="12">*/}
                      {/*<AudioArea audio={issue1.voiceList} />*/}
                      {/*</Col>*/}
                      {/*)}*/}
                    </Row>
                    {/*<Row>*/}
                    {/*{this.findAssetTypeDefectsByName(issue1) && this.findAssetTypeDefectsByName(issue1).length > 0 && (*/}
                    {/*<Col md="12">*/}
                    {/*<MyButton onClick={() => this.openModelMethod()}>{languageService("Defect Codes")} :</MyButton>*/}
                    {/*</Col>*/}
                    {/*)}*/}
                    {/*</Row>*/}
                  </div>
                  <Col md="12">
                    <Row>
                      {issue1.assignedTo && (
                        <div>
                          <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Assigned To")} :</div>
                          <div style={themeService(maintenaceDetailstyle.fieldText)}>
                            {issue1.assignedTo ? this.getUserDisplay(issue1.assignedTo) : languageService("No user")}
                          </div>
                        </div>
                      )}

                      {(issue1.status === languageService("Closed") ||
                        issue1.status === languageService("Completed") ||
                        issue1.status === languageService("In Progress") ||
                        issue1.status === languageService("Planned")) &&
                        issue1.dueDate && (
                          <div>
                            <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Plan Date")}: </div>
                            <div style={themeService(maintenaceDetailstyle.fieldText)}>{moment(issue1.dueDate).format("Y-MMMM-DD")}</div>
                          </div>
                        )}

                      {issue1.executionDate && (
                        <div>
                          <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Execution Date")}: </div>
                          <div style={themeService(maintenaceDetailstyle.fieldText)}>
                            {moment(issue1.executionDate).format("Y-MMMM-DD")}
                          </div>
                        </div>
                      )}

                      {issue1.closedDate && (
                        <div>
                          <div style={themeService(maintenaceDetailstyle.fieldHeading)}>{languageService("Closed date")}: </div>
                          <div style={themeService(maintenaceDetailstyle.fieldText)}>{moment(issue1.closedDate).format("Y-MMMM-DD")}</div>
                        </div>
                      )}
                    </Row>
                  </Col>
                </Col>
              </Row>
            </div>
          </Col>
          <Col md={"9"} style={{ padding: "0px" }}>
            <div style={{ ...themeService(maintenaceDetailstyle.MaintenanceDetailsContainer), minHeight: "470px", margin: "0 30px 0 5px" }}>
              <Row>
                <Col md={"12"}>
                  <div style={themeService(maintenaceDetailstyle.fieldHeading)}>
                    {languageService("Location")}: <span style={{ fontWeight: 100 }}>{issue1.lineName}</span>
                  </div>
                  {/* {issue1 && issue1.startMarker && (
                    <div style={{ ...themeService(maintenaceDetailstyle.gpsIconTextStyle), ...{ paddingLeft: "45px" } }}>
                      {languageService("Marker") + ": " + issue1.startMarker + " - " + issue1.endMarker}{" "}
                    </div>
                  )} */}

                  <div style={{ marginBottom: "15px" }}>{LocationsComp}</div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div
                    style={{
                      boxShadow: "rgb(207, 207, 207) 3px 3px 5px",
                      minHeight: "510px",
                      width: "100%",
                      border: "1px solid #ccc",
                      margin: "0 4px",
                      background: "#efefef",
                    }}
                  >
                    {this.state.gisDisplay && displayGIS && (
                      <MapBox assets={{}} lineAsset={this.state.lineAsset} selectedAsset={this.state.selectedAsset} />
                    )}
                  </div>{" "}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const getAssetType = curdActions.getAssetType;
const updateIssuesReport = curdActions.updateIssuesReport;
const getApplicationlookups = curdActions.getApplicationlookups;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    getAssetType,
    updateIssuesReport,
    getAssetLinesWithSelf,
    getApplicationlookups,
  },
};

let variableList = {
  assetReducer: { assets: "" },
  issuesReportReducer: { issuesReports: [] },
  assetHelperReducer: { lineAssets: [] },
  assetTypeReducer: {
    assetTypes: [],
  },
  applicationlookupsReducer: { applicationlookups: [] },
};

const IssueDetailContainer = CRUDFunction(IssueDetail, "issuedetail", actionOptions, variableList, [
  "assetTypeReducer",
  "issuesReportReducer",
  "assetHelperReducer",
  "applicationlookupsReducer",
]);

export default IssueDetailContainer;
