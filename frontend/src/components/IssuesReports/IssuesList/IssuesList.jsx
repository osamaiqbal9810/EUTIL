import React, { Component } from "react";
import ThisTable from "components/Common/ThisTable/index";
import moment from "moment";
import { ButtonActionsTable } from "components/Common/Buttons";
import "./imgstyle.css";
import "components/Common/ImageGallery/style.css";
import { ModalStyles } from "components/Common/styles.js";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { getServerEndpoint } from "utils/serverEndpoint";
import _ from "lodash";
import { ButtonMain } from "components/Common/Buttons";
import IssueFilter from "./IssueFilter.jsx";
import { getLanguageLocal, languageService } from "../../../Language/language.service";
import { Link, Route } from "react-router-dom";
import { redo } from "react-icons-kit/icomoon/redo";
import { undo } from "react-icons-kit/icomoon/undo";
import { circleLeft } from "react-icons-kit/icomoon/circleLeft";
import { circleRight } from "react-icons-kit/icomoon/circleRight";
import SvgIcon, { Icon } from "react-icons-kit";
import { Tooltip } from "reactstrap";
import "./imgstyle.css";
import { ic_gps_fixed } from "react-icons-kit/md/ic_gps_fixed";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import { commonFilterStyles } from "../../Common/Filters/styles/CommonFilterStyle";
import { statusStyle } from "../../JourneyPlan/JourneyPlanList/style";
import { CommonModalStyle } from "../../../style/basic/commonControls";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import { dateSort, generalSort } from "../../../utils/sortingMethods";
import CommonFilters from "components/Common/Filters/CommonFilters";
import DateAndLineFilter from "../../Common/Filters/DateAndLineFilter";
import permissionCheck from "utils/permissionCheck.js";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import { androidDoneAll } from "react-icons-kit/ionicons/androidDoneAll";
//import { timpsSignalApp } from "../../../config/config";
import { versionInfo } from "../../MainPage/VersionInfo";
import { LocPrefixService } from "../../LocationPrefixEditor/LocationPrefixService";

let defaultStyle = themeService({
  default: { fontSize: "14px", color: basicColors.first },
  retro: { fontSize: "14px", color: retroColors.second },
  electric: { fontSize: "14px", color: electricColors.second },
});

const ROTATION_TOOLTIP = [
  {
    title: "REDO",
    icon: redo,
    rotate: "right",
    placement: "top",
    tooltip: {
      show: false,
      text: `${languageService("Rotate clockwise")}`,
    },
  },
  {
    title: "UNDO",
    icon: undo,
    placement: "right",
    rotate: "left",
    tooltip: {
      show: false,
      text: `${languageService("Rotate anti-clockwise")}`,
    },
  },
];

class IssuesList extends Component {
  constructor(props) {
    super(props);
    let timpsSignalApp = versionInfo.isSITE();
    let elecUtilApp = versionInfo.isEUtility();
    this.state = {
      selectedImg: "",
      selectedImageIndex: 0,
      images: [],
      imgModal: false,
      filteredData: [],
      filterTodayOrAll: "all",
      filterStatus: this.props.statusFilter,
      imgsList: [],
      showMultipleImgs: false,
      imgDescription: "",
      pivot: "category",
      showBackButton: false,
      showAllDefects: false,
      showAllDefectsIssueGuid: null,
      showIframeIssue: null,
      showIframeModalState: false,
      tooltipOpen: false,
      tooltip: null,
      indexAudioFileMap: {},
      rotateIndex: 0,
      pageSize: this.props.pageSize,
      page: 0,
      dropdownOpen: false,
      priorityChanges: {},
    };

    this.columns = [
      {
        Header: languageService("Asset Name"),
        title: "trackId",
        accessor: "trackId",
        id: "trackId",
        show: this.props.forDashboard ? true : false,
        minWidth: this.props.forDashboard ? 100 : 120,
      },
      {
        Header: languageService("Inspector"),
        id: "user",
        show: this.props.forDashboard ? true : false,
        accessor: (d) => {
          let user = "";
          if (d.user) {
            user = d.user.name;
          }
          return <div>{user} </div>;
        },
        minWidth: this.props.forDashboard ? 65 : 100,
      },
      {
        Header: languageService("Date"),
        id: "dateIssue",
        sortMethod: dateSort,
        accessor: (d) => {
          let date = "";
          if (d.timeStamp) {
            date = this.props.forDashboard
              ? moment.utc(d.timeStamp).local().format("ddd, MMM D YYYY")
              : moment.utc(d.timeStamp).local().format("ddd, MMM D, YYYY hh:mm:ss A");
          }
          return date;
        },

        minWidth: this.props.forDashboard ? 100 : 125,
      },
      {
        Header: languageService("Location"),
        id: "location",
        show: this.props.forDashboard ? false : true,
        //    Aggregated: row => <span />,
        accessor: (d) => {
          let str = d.location;
          let locationSrc = "https://www.google.com/maps/place/" + str;
          return (
            <div>
              <a href={locationSrc} style={{ color: "inherit", textAlign: "center", display: "block" }} target="_blank">
                <Icon icon={ic_gps_fixed} style={{ marginRight: "5px" }} />
                {d.lineName}
              </a>
            </div>
          );
        },
        minWidth: 150, //150,
      },
      {
        Header: languageService("Milepost "),
        id: "mp",
        show: this.props.forDashboard ? false : true,
        accessor: (d) => {
          let startPrefix = LocPrefixService.getPrefixMp(d.startMp, d.lineId);
          let endPrefix = LocPrefixService.getPrefixMp(d.endMp, d.lineId);
          if (d.startMarker || d.endMarker) {
            return (
              <div>
                {d.startMarker},{d.endMarker}
              </div>
            );
          } else if (d.startMp || d.endMp)
            return (
              <div>
                {startPrefix}
                {d.startMp},{endPrefix}
                {d.endMp}
              </div>
            );
          return <div>N/A</div>;
        },
        minWidth: 120, //150,
      },
      {
        Header: languageService("Defect Codes"),
        id: "defect",
        show: this.props.forDashboard || timpsSignalApp ? false : true,
        width: 250,
        accessor: (d) => {
          let defectCount = 0;
          let defectCodes = d.defectCodes;
          let defectDescription = d.description;
          if (d && d.defectCodes && d.defectCodes.length) {
            defectCodes = defectCodes.filter((dc) => dc !== "");
            defectCount = defectCodes.length;
            return (
              <React.Fragment>
                <div id={"defect-" + defectCodes} className="defect-code-button" style={{ textAlign: "center" }}>
                  <ButtonActionsTable
                    handleClick={() => {
                      this.props.showDefectModal(d);
                    }}
                    buttonText={<span>{defectDescription}</span>}
                  />
                </div>
                {/* <Tooltip isOpen={this.state.tooltipOpen} target={"defect-" + defectCodes} toggle={this.toggleTooltip}>
                  <span>{defectDescription}</span>
                </Tooltip>  */}
              </React.Fragment>
            );
          } else {
            return <div style={{ textAlign: "center" }}>N/A</div>;
          }
        },
        style: { whiteSpace: "unset" },
      },
      // {
      //   Header: languageService("Defect Description"),
      //   id: "defectDescription",
      //   show: this.props.forDashboard || timpsSignalApp ? false : true,
      //   width: 200,
      //   accessor: (d) => {
      //     let dDecsription = d.description;
      //     return <div style={{ textAlign: "center" }}>{dDecsription}</div>;
      //   },
      // },
      {
        Header: languageService("Rule 213.9(b)"),
        id: "rule_applied",
        width: 158,

        show: this.props.forDashboard || timpsSignalApp || elecUtilApp ? false : true,
        accessor: (d) => {
          return (
            <div style={{ textAlign: "center" }}>
              <input type="checkbox" readOnly checked={!!d.ruleApplied} />
            </div>
          );
        },
      },
      {
        Header: "Repair in (Days)",
        width: 100,
        id: "repairBy",
        accessor: (d) => {
          let value = "";
          let color = "inherit";
          if (d.closeReason) {
            value = "Closed";
          } else if (d.serverObject && d.remedialAction == "No Repair Required or N/A" && d.serverObject.repairDate) {
            value = "N/A";
          } else if (d.serverObject && d.serverObject.repairDate) {
            value = "Repaired";
          } else if (d && d.remedialAction == "Not Repaired") {
            let repairField = _.find(d.remedialActionItems, { id: "repairBy" });
            let nowDate = moment();
            if (repairField) {
              value = moment(repairField.value).endOf("day").diff(nowDate, "days");
              if (value === 0) {
                value = (moment(repairField.value).endOf("day").diff(nowDate, "hours") / 24).toFixed(2);
                color = "rgb(224, 44, 73)";
              } else {
                let originalGap = moment(repairField.value).endOf("day").diff(moment(d.timeStamp), "days");
                value / originalGap <= 0.25 && (color = "rgb(224, 44, 73)");
              }
              if (value <= 0) value = "Overdue";
            }
          }
          return <span style={{ color: color }}>{value}</span>;
        },
        show: this.props.forDashboard || timpsSignalApp || elecUtilApp ? false : true,
      },
      {
        Header: () => {
          return (
            <div>
              <div style={{ display: "inline-block" }}>
                {languageService("Assign Maintenance")}
                {this.props.multiIssueToMaintenance && this.props.multiIssueToMaintenance.length > 0 && (
                  <div style={{ display: "inline-block", position: "relative" }} id="select-all">
                    <div
                      style={themeService({
                        default: { color: basicColors },
                        retro: { color: retroColors.second },
                        electric: { color: electricColors.second },
                      })}
                    >
                      <SvgIcon
                        size={23}
                        icon={androidDoneAll}
                        onClick={(e) => this.props.updateMultiAssignMaintenance()}
                        style={{
                          marginRight: "5px",
                          marginLeft: "5px",
                          verticalAlign: "middle",
                          cursor: "pointer",
                          zIndex: "10",
                          position: "relative",
                          color: "rgb(224, 44, 73)",
                        }}
                      />
                    </div>{" "}
                    {/* <Tooltip
                      placement="right"
                      isOpen={this.state.tooltipOpen}
                      target={"select-all"}
                      toggle={() => this.toggle("select-all")}
                    >
                      Assign All
                    </Tooltip> */}
                  </div>
                )}
              </div>
            </div>
          );
        },
        id: "issueMaintenance",
        width: 200,
        show: this.props.forDashboard
          ? false
          : (versionInfo.isTIMPS() || versionInfo.isEUtility()) && permissionCheck("MAINTENANCE", "create")
          ? true
          : false,
        accessor: (d) => {
          let maintenanceRole = d.serverObject ? d.serverObject.maintenanceRole : "";
          let editMaintenance = d.maintenanceAction === "maintenanceMode";

          return (
            <div>
              {d.status !== "Resolved" && (
                <React.Fragment>
                  <div style={{ display: "inline-block", width: "80%" }}>
                    <select
                      disabled={false}
                      onChange={(e) => {
                        props.handleUpdateIssue(d.uniqueGuid, e.target, "updateMaintenanceRole");
                      }}
                      name="maintenanceRole"
                      value={maintenanceRole || ""}
                    >
                      {maintenanceOptions(maintenanceRole)}
                    </select>
                    <React.Fragment>
                      {editMaintenance && (
                        <div style={{ display: "inline-block" }}>
                          <div
                            style={themeService({
                              default: { color: basicColors },
                              retro: { color: retroColors.second },
                              electric: { color: electricColors.second },
                            })}
                          >
                            <SvgIcon
                              size={15}
                              icon={checkmark}
                              onClick={(e) => props.handleUpdateIssue(d.uniqueGuid, e.target, "saveMaintenanceRole")}
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
                        </div>
                      )}
                    </React.Fragment>
                  </div>
                </React.Fragment>
              )}
              {d.status == "Resolved" && (
                <div
                  onClick={(e) => {
                    this.props.history.push("maintenancebacklogs/" + d.maintenanceId);
                  }}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {d.mrNumber}
                </div>
              )}
            </div>
          );
        },
      },
      // {
      //   Header: languageService("Priority"),
      //   id: "issuePriority",
      //   show: this.props.forDashboard ? false : true,
      //   accessor: d => {
      //     let priority = d.serverObject ? d.serverObject.issuePriority : "N/A";
      //     let editMode = d.action === "serverChanges";

      //     if (d.status || d.status === "open") return <div>{priority}</div>;

      //     return (
      //       <div>
      //         {permissionCheck("ISSUE CLOSE", "update") && (
      //           <React.Fragment>
      //             <div style={{ display: "inline-block", width: "80%" }}>
      //               <select
      //                 disabled={false}
      //                 onChange={e => props.handleUpdateIssue(d.uniqueGuid, e.target, "updatePriority")}
      //                 name="issuePriority"
      //                 value={priority || ""}
      //               >
      //                 <option value={""}>{languageService("Select Priority")}</option>
      //                 <option value={"low"}>{languageService("Low")}</option>
      //                 <option value={"medium"}>{languageService("Medium")}</option>
      //                 <option value={"high"}>{languageService("High")}</option>
      //                 <option value={"info"}>{languageService("Info")}</option>
      //               </select>
      //             </div>
      //             <React.Fragment>
      //               {editMode && (
      //                 <div style={{ display: "inline-block" }}>
      //                   <div style={themeService({ default: { color: basicColors }, retro: { color: retroColors.second } })}>
      //                     <SvgIcon
      //                       size={15}
      //                       icon={checkmark}
      //                       onClick={e => props.handleUpdateIssue(d.uniqueGuid, e.target, "savePriority")}
      //                       style={{
      //                         marginRight: "5px",
      //                         marginLeft: "5px",
      //                         verticalAlign: "middle",
      //                         cursor: "pointer",
      //                         zIndex: "10",
      //                         position: "relative",
      //                       }}
      //                     />
      //                   </div>
      //                 </div>
      //               )}
      //             </React.Fragment>
      //           </React.Fragment>
      //         )}
      //       </div>
      //     );
      //   },
      //   minWidth: 90, //150,
      // },
      {
        Header: languageService("Remedial Action"),
        id: "fixedOnSite",
        accessor: (issue) => {
          let remediation = {
            title: "",
            fixedOnSite: false,
            text: "",
            items: [],
          };

          if (!issue.remedialAction) return <div>N/A</div>;

          if (issue.marked) {
            remediation.title = "Fixed on Site";
            remediation.fixedOnSite = true;
            remediation.text = issue.fixType;
          } else {
            remediation.title = issue.remedialAction;
            remediation.fixedOnSite = false;
            remediation.items = issue.remedialActionItems || [];
          }

          return (
            <div
              onClick={() => {
                this.props.openFixedOnSiteModal(issue);
              }}
              style={{ overflowX: "hidden" }}
            >
              {remediation.fixedOnSite && (
                <React.Fragment>
                  <div className="row">
                    <div className="col-12">
                      <div style={{ display: "inline-block" }}>{languageService(remediation.title)}</div>
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
                        {languageService("Fix Type")}:{" "}
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
                        {remediation.text}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}

              {!remediation.fixedOnSite && (
                <React.Fragment>
                  <div className="row">
                    <div className="col-12">
                      <div style={{ display: "inline-block" }}>{languageService(remediation.title)}</div>
                    </div>
                  </div>
                  {remediation.items.map((ra) => (
                    <React.Fragment key={ra.id}>
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
                            {languageService(ra.desc)}:{" "}
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
                            {ra.value}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              )}
            </div>
          );
        },

        //     Aggregated: row => <span />,

        minWidth: 150,
      },
      {
        Header: languageService("Priority"),

        id: "priority",
        minWidth: 100, //150,
        sortMethod: generalSort,
        show: this.props.forDashboard ? true : false,
        //    Aggregated: row => <span />,
        width: 100, //150,
        accessor: (d) => {
          String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
          };
          let priority = "Pending";

          if (d.serverObject && d.serverObject.issuePriority) priority = d.serverObject.issuePriority.capitalize();

          return <div style={themeService(statusStyle.statusColorStyle(priority, this.props))}>{languageService(priority)}</div>;
        },
      },
      {
        Header: languageService("Actions"),
        show: this.props.forDashboard ? false : true,
        id: "actions",
        //    Aggregated: row => <span />,
        accessor: (d) => {
          const issueId = d.issueId ? d.issueId : "detail";
          return (
            <div>
              <Link
                to={{
                  pathname: "/issuereports/" + issueId,
                  state: {
                    issue: d,
                  },
                }}
                className="linkStyleTable"
              >
                <ButtonActionsTable
                  handleClick={(e) => {
                    //this.props.handleViewClick(d, this.state.filterTodayOrAll, this.props.pageSize);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={`${languageService("View")}`}
                />
              </Link>
              {/* {d.status !== "Resolved" && permissionCheck("ISSUE MR", "create") && !timpsSignalApp && (
                <ButtonActionsTable
                  handleClick={() => {
                    this.props.handleWorkorderModel(true, d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={`${languageService("Create")}  WO`}
                />
              )} */}
              {/* {d.status !== "Resolved" && permissionCheck("ISSUE MR", "create") && !timpsSignalApp && (
                <ButtonActionsTable
                  handleClick={(e) => {
                    this.props.handleMRClick(d, "createMR");
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={`${languageService("Create")}  MR`}
                />
              )} */}
              {d.status !== "Resolved" && permissionCheck("ISSUE CLOSE", "update") && (
                <ButtonActionsTable
                  handleClick={(e) => {
                    this.props.handleMRClick(d, "close");
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Close")}
                />
              )}
              {d.status === "Resolved" && d.closeReason && permissionCheck("ISSUE REASON", "view") && (
                <ButtonActionsTable
                  handleClick={(e) => {
                    this.props.handleMRClick(d, "reason");
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Reason")}
                />
              )}
              {/* {d.status === "Resolved" && d.maintenanceId && permissionCheck("ISSUE MR", "view") && (
                <Link to={"/maintenancebacklogs/" + d.maintenanceId} className="linkStyleTable">
                  <ButtonActionsTable
                    handleClick={e => {
                      //this.props.handleViewClick(d, this.state.filterTodayOrAll, this.props.pageSize);
                    }}
                    margin="0px 10px 0px 0px"
                    buttonText={`${languageService("View")} MR`}
                  />
                </Link>
              )} */}
            </div>
          );
        },
        minWidth: 150,
      },
    ];

    this.handleImgShow = this.handleImgShow.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleImgMultiples = this.handleImgMultiples.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleSingleImgFromMultiple = this.handleSingleImgFromMultiple.bind(this);
    this.checkTodayAllFilter = this.checkTodayAllFilter.bind(this);
    this.handleFilterPivotBy = this.handleFilterPivotBy.bind(this);
    this.showAllDefects = this.showAllDefects.bind(this);
    this.showIframeLocation = this.showIframeLocation.bind(this);
    this.handleIframeToggle = this.handleIframeToggle.bind(this);
    this.handlePrevNext = this.handlePrevNext.bind(this);
    this.updateIndexAudioFileMap = this.updateIndexAudioFileMap.bind(this);
    this.toggle = this.toggle.bind(this);
    this.pageSizeDropdownToggle = this.pageSizeDropdownToggle.bind(this);
    this.handelRotate = this.handelRotate.bind(this);
    this.handleImageTransition = this.handleImageTransition.bind(this);
    // this.filterIssueState = this.filterIssueState.bind(this);
  }

  updateIndexAudioFileMap(tableData) {
    const { indexAudioFileMap } = this.state;
    let copyIndexAudioMap = _.cloneDeep(indexAudioFileMap);
    tableData.forEach((issue) => {
      if (!copyIndexAudioMap[issue.timeStamp]) {
        copyIndexAudioMap[issue.timeStamp] = 0;
      }
    });

    this.setState({
      indexAudioFileMap: copyIndexAudioMap,
    });
  }
  handelRotate(direction) {
    // console.log("::", direction);
    if (direction == "right") {
      this.setState({ rotateIndex: this.state.rotateIndex + 90 });
    } else {
      this.setState({ rotateIndex: this.state.rotateIndex - 90 });
    }
  }
  handlePrevNext(action, voiceList, timeStamp) {
    const { indexAudioFileMap } = this.state;
    let copyIndexAudioMap = _.cloneDeep(indexAudioFileMap);
    if (action == "Prev") {
      if (this.state.indexAudioFileMap[timeStamp] !== 0) {
        copyIndexAudioMap[timeStamp] = copyIndexAudioMap[timeStamp] - 1;
        this.setState({
          indexAudioFileMap: copyIndexAudioMap,
        });
      }
    } else {
      if (this.state.indexAudioFileMap[timeStamp] + 1 !== voiceList.length && voiceList.length > 0) {
        copyIndexAudioMap[timeStamp] = copyIndexAudioMap[timeStamp] + 1;
        this.setState({
          indexAudioFileMap: copyIndexAudioMap,
        });
      }
    }
  }
  toggle(tooltip) {
    if (this.state.tooltip) {
      this.setState({ tooltip: null });
    } else {
      this.setState({ tooltip });
    }
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }
  handleIframeToggle() {
    this.setState({
      showIframeModalState: !this.state.showIframeModalState,
      showIframeIssue: null,
    });
  }

  showIframeLocation(issue) {
    this.setState({
      showIframeModalState: !this.state.showIframeModalState,
      showIframeIssue: issue,
    });
  }

  showAllDefects(issue) {
    let issueVal = issue.uniqueGuid;
    if (this.state.showAllDefects && this.state.showAllDefectsIssueGuid == issueVal) {
      issueVal = null;
    }
    this.setState({
      showAllDefects: !this.state.showAllDefects,
      showAllDefectsIssueGuid: issueVal,
    });
  }

  handleImgShow(img, data, index) {
    let imgDescription = "";
    let images = [];
    if (data) {
      imgDescription = data.description;
      images = data.imgList;
    }
    this.setState({
      imgModal: !this.state.imgModal,
      selectedImg: img,
      selectedImageIndex: index,
      images,
      showMultipleImgs: false,
      imgDescription: imgDescription,
      showBackButton: false,
    });
  }

  handleImageTransition(selectedImageIndex, images) {
    if (this.checkImageIndexExistence(images, selectedImageIndex)) this.setState({ selectedImageIndex });
  }

  handleImgMultiples(data) {
    let imgDescription = "";
    let imgList = [];
    if (data) {
      imgList = data.imgList;
      imgDescription = data.description;
    }

    this.setState({
      imgModal: !this.state.imgModal,
      imgsList: imgList,
      showMultipleImgs: true,
      imgDescription: imgDescription,
    });
  }

  handleSingleImgFromMultiple(img) {
    this.setState({
      selectedImg: img,
      showMultipleImgs: false,
      showBackButton: true,
    });
  }

  handleToggle() {
    this.setState({
      imgModal: !this.state.imgModal,
      showMultipleImgs: false,
      showBackButton: false,
    });
  }

  handleBackButton() {
    this.setState({
      showMultipleImgs: true,
      showBackButton: false,
    });
  }

  componentDidMount() {
    this.checkTodayAllFilter(this.state.filterTodayOrAll);
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.tableData.length !== this.props.tableData.length ||
      prevProps.tableData.filter((v) => {
        return v.status === "Resolved";
      }).length !=
        this.props.tableData.filter((v) => {
          return v.status === "Resolved";
        }).length
    ) {
      this.checkTodayAllFilter(this.state.filterTodayOrAll);
      this.updateIndexAudioFileMap(this.props.tableData);
    }
  }

  checkTodayAllFilter(filterName) {
    let filteredData = [];

    filteredData = this.applyFilters(this.props.tableData, filterName, this.state.filterStatus);
    // console.log(this.props.tableData, filterName, this.state.filterStatus);
    this.setState({
      filteredData: filteredData,
      filterTodayOrAll: filterName,
    });

    if (this.props.recalculateSummary && typeof this.props.recalculateSummary === "function")
      this.props.recalculateSummary(filteredData, filterName);
  }
  filterIssueState(filter) {
    let filteredData = [];
    filteredData = this.applyFilters(this.props.tableData, this.state.filterTodayOrAll, filter);
    this.setState({ filteredData: filteredData, filterStatus: filter });
    if (this.props.recalculateSummary && typeof this.props.recalculateSummary === "function") this.props.recalculateSummary(filteredData);
  }
  applyFilters(data, todayFilter, statusFilter) {
    let filteredData = [];

    // apply status filter
    if (statusFilter === "Open")
      filteredData = data.filter((issueObj) => {
        return issueObj.status !== "Resolved";
      });
    else if (statusFilter === "Resolved")
      filteredData = data.filter((issueObj) => {
        return issueObj.status === "Resolved";
      });
    else if (statusFilter === "All") filteredData = this.props.tableData;

    let filterFurther = [];

    // apply today or all filter
    if (todayFilter == "today") {
      moment.locale("en");
      filteredData.forEach((issueObj) => {
        let issueDate = moment(issueObj.timeStamp).format("ll");
        let today = moment().format("ll");
        let todayCheck = moment(issueDate).isSame(moment(today));
        if (todayCheck) {
          filterFurther.push(issueObj);
        }
      });
      moment.locale(getLanguageLocal());
    } else if (todayFilter == "all") {
      filterFurther = filteredData;
    }

    return filterFurther;
  }

  handleFilterPivotBy(filterName) {
    this.setState({
      pivot: filterName,
    });
  }

  pageSizeDropdownToggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  handlePageSizeChange(pageSize) {
    this.setState({
      pageSize: pageSize,
    });
  }

  checkImageIndexExistence(images, index) {
    return typeof images[index] !== "undefined";
  }

  renderImgModal = () => {
    let { selectedImageIndex, images } = this.state;

    let imgSelect = (
      <div
        style={{
          padding: "10px",
          transitionDuration: " 0.4s",
          background: "#f7f7f7",
          border: " 1px solid #e0e0e0",
          display: "inline-block",
          transform: "rotate(" + this.state.rotateIndex + "deg)",
        }}
      >
        <img
          src={`${getServerEndpoint()}applicationresources/${images.length > 0 ? images[this.state.selectedImageIndex].imgName : ""}`}
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            border: "1px solid #e3e9ef",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>
    );

    return (
      <Modal
        isOpen={this.state.imgModal}
        toggle={this.handleToggle}
        style={{ height: "auto" }}
        contentClassName={themeService({ default: this.props.className, retro: "retroModal", retro: "electricModal" })}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>{this.state.imgDescription}</ModalHeader>
        <div style={themeService({ default: { position: "absolute", top: "17px", right: "10px" } })}>
          {ROTATION_TOOLTIP.map((rt, index) => (
            <React.Fragment key={index}>
              <button
                style={themeService({
                  default: {
                    marginRight: "10px",
                    background: basicColors.first,
                    color: "var(--fifth)",
                    padding: "5px 5px",
                    borderRadius: "5px",
                    height: "28px",
                    border: "none",
                    cursor: "pointer",
                  },
                  retro: {
                    marginRight: "10px",
                    background: retroColors.first,
                    color: retroColors.fifth,
                    padding: "5px 5px",
                    borderRadius: "5px",
                    height: "28px",
                    border: "none",
                    cursor: "pointer",
                  },
                  electric: {
                    marginRight: "10px",
                    background: electricColors.first,
                    color: electricColors.fifth,
                    padding: "5px 5px",
                    borderRadius: "5px",
                    height: "28px",
                    border: "none",
                    cursor: "pointer",
                  },
                })}
                onClick={() => this.handelRotate(rt.rotate)}
                id={rt.title}
              >
                <Icon icon={rt.icon} className="media-icon" />
              </button>
              <Tooltip
                placement={rt.placement}
                isOpen={this.state.tooltip && this.state.tooltip.title === rt.title}
                target={rt.title}
                toggle={() => this.toggle(rt)}
              >
                {languageService(rt.tooltip.text)}
              </Tooltip>
            </React.Fragment>
          ))}
        </div>
        <ModalBody
          style={{
            ...ModalStyles.footerButtonsContainer,
            ...themeService(CommonModalStyle.body),
            ...{ textAlign: "center", overflow: "hidden" },
          }}
        >
          {imgSelect}

          <br />

          <Icon
            size={30}
            icon={circleLeft}
            className="circle-left"
            onClick={() => this.handleImageTransition(selectedImageIndex - 1, images)}
            style={{
              cursor: "pointer",
              color: this.checkImageIndexExistence(images, selectedImageIndex - 1)
                ? themeService({ default: basicColors.first, retro: retroColors.first, electric: electricColors.first })
                : "grey",
            }}
          />

          <Icon
            size={30}
            icon={circleRight}
            className="circle-right"
            onClick={() => this.handleImageTransition(selectedImageIndex + 1, images)}
            style={{
              cursor: "pointer",
              color: this.checkImageIndexExistence(images, selectedImageIndex + 1)
                ? themeService({ default: basicColors.first, retro: retroColors.first, electric: electricColors.first })
                : "grey",
            }}
          />
        </ModalBody>
        <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
          {this.state.showBackButton && (
            <MyButton
              onClick={(e) => {
                this.handleBackButton();
              }}
            >
              {languageService("Back")}{" "}
            </MyButton>
          )}
          <MyButton
            onClick={(e) => {
              this.handleImgShow("");
            }}
          >
            {languageService("Close")}{" "}
          </MyButton>
        </ModalFooter>
      </Modal>
    );
  };

  render() {
    let columns = [...this.columns];
    if (this.props.forDashboard) {
      _.remove(columns, { id: "actions" });
      _.remove(columns, { id: "description" });
      _.remove(columns, { id: "fixedOnSite" });
      _.remove(columns, { id: "imgList" });
      _.remove(columns, { id: "locationLat" });
      _.remove(columns, { id: "locationLon" });
    }
    if (this.props.disableRule213Config) {
      _.remove(columns, { id: "rule_applied" });
    }

    let imgComp = null;
    if (this.state.imgsList && this.state.showMultipleImgs) {
      imgComp = this.state.imgsList.map((img, index) => {
        let imgName = "";
        if (img) {
          imgName = img.imgName;
        }
        let paths = getServerEndpoint() + "thumbnails/" + imgName;
        //  console.log(paths)
        return (
          <div className="colsImgs" key={index}>
            <img
              src={paths}
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              alt={imgName}
              onClick={(e) => {
                this.handleSingleImgFromMultiple(imgName);
              }}
            />
          </div>
        );
      });
    }
    let imgSelect = (
      <div
        style={{
          padding: "10px",
          transitionDuration: " 0.4s",
          background: "#f7f7f7",
          border: " 1px solid #e0e0e0",
          display: "inline-block",
          transform: "rotate(" + this.state.rotateIndex + "deg)",
        }}
      >
        <img
          src={`${getServerEndpoint()}applicationresources/${
            this.state.images.length > 0 ? this.state.images[this.state.selectedImageIndex].imgName : ""
          }`}
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            border: "1px solid #e3e9ef",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>
    );

    if (this.state.showMultipleImgs) {
      imgSelect = (
        <div>
          <div className="rowsOfImgs">{imgComp}</div>
        </div>
      );
    }

    let locationSrc = this.state.showIframeIssue ? "https://www.google.com/maps/place/" + this.state.showIframeIssue.location : "#";

    return (
      <div style={{ width: "-webkit-fill-available", width: "100%" }}>
        <Modal isOpen={this.state.showIframeModalState} toggle={this.handleIframeToggle}>
          <ModalHeader style={ModalStyles.modalTitleStyle}>
            {this.state.showIframeIssue ? this.state.showIframeIssue.description : ""}
          </ModalHeader>
          <ModalFooter style={ModalStyles.footerButtonsContainer}>
            <ButtonMain
              buttonText={languageService("Close")}
              handleClick={(e) => {
                this.handleIframeToggle();
              }}
            />
          </ModalFooter>
        </Modal>
        {this.renderImgModal()}
        {!this.props.noFilter && !this.props.forDashboard && (
          <div style={{ margin: "0" }}>
            <CommonFilters
              tableInFilter
              showCustomFilter
              handlePageSize={this.props.handlePageSize}
              customFilterComp={
                <React.Fragment>
                  <div style={{ display: "inline-block" }}>
                    <DateAndLineFilter
                      calculateSummaryData={this.props.calculateSummaryData}
                      data={this.props.data}
                      setDefaultObjects={this.props.setDefaultObjects}
                      apiCall={this.props.apiCall}
                      multiData={this.props.multiData}
                      dateFilters={this.props.dateFilters}
                      getRangeFromServer={this.props.getRangeFromServer}
                      clickedFilter={this.props.clickedFilter}
                      dateFilterName={this.props.dateFilterName}
                      fixedDateRanges={this.props.fixedDateRanges}
                      filterDateText={this.props.filterDateText}
                    />
                  </div>
                  <div style={{ display: "inline-block" }}>
                    <IssueFilter
                      checkTodayAllFilter={this.checkTodayAllFilter}
                      handleFilterPivotBy={this.handleFilterPivotBy}
                      filterTodayOrAll={this.state.filterTodayOrAll}
                      filterIssuesState={this.props.filterIssueState}
                      issueStateFilter={this.props.statusFilter}
                    />
                  </div>
                </React.Fragment>
              }
              checkTodayAllFilter={this.checkTodayAllFilter}
              filterTodayOrAll={this.state.filterTodayOrAll}
              firstFilterName={languageService("In Progress")}
              noFilters
              tableColumns={columns}
              tableData={this.props.tableData}
              pageSize={this.state.pageSize}
              pagination={true}
              handlePageSave={(page) => this.props.handlePageSave(page)}
              page={this.props.page}
              rowStyleMap={this.props.rowStyleMap ? this.props.rowStyleMap : null}
            />
          </div>
        )}
        {this.props.forDashboard && (
          <div style={{ boxShadow: "3px 3px 5px #cfcfcf" }}>
            <ThisTable
              // defaultSorted={[{ id: "dateIssue", desc: false }]}
              tableColumns={columns}
              tableData={this.props.forDashboard ? this.props.tableData : this.props.tableData}
              pageSize={this.props.forDashboard ? this.props.pageSize : this.state.pageSize}
              minRows={8}
              pagination={true}
              forDashboard={this.props.forDashboard ? this.props.forDashboard : false}
              handlePageChange={(page) => this.props.handlePageSave(page)}
              page={this.props.page}
              height={"auto"}
              classNameCustom={this.props.classNameCustom}
              fromDashboardToLink={this.props.fromDashboardToLink}
              rowStyleMap={this.props.rowStyleMap ? this.props.rowStyleMap : null}
            />
          </div>
        )}
      </div>
    );
  }
}

export default IssuesList;

export function maintenanceOptions(noEmpty) {
  let ops = (
    <React.Fragment>
      {!noEmpty && <option value="">{languageService("Assign to...")}</option>}
      <option value="InspectorWork"> {languageService("Inspector Work")} </option>
      <option value="Maintainer"> {languageService("Maintainer")} </option>
      <option value="WorkOrder"> {languageService("Work Order")} </option>
      <option value="CapitalPlan"> {languageService("Capital Plan")} </option>
    </React.Fragment>
  );
  return ops;
}

export function getMaintenanceOptionsValueToText(name) {
  let mOp = {
    InspectorWork: "Inspector Work",
    Maintainer: "Maintainer",
    WorkOrder: "Work Order",
    CapitalPlan: "Capital Plan",
  };
  return mOp[name];
}
