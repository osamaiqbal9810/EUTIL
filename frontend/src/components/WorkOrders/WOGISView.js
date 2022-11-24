import React, { Component } from "react";
import { Row, Col, Label, Button } from "reactstrap";
import DayPicker, { DateUtils } from "react-day-picker";
import moment from "moment";
import _ from "lodash";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import { Link, Route } from "react-router-dom";
import { directions } from "react-icons-kit/typicons/directions";
import { uploadImgs } from "reduxRelated/actions/imgsUpload.js";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import { CRUDFunction } from "reduxCURD/container";
import { commonReducers } from "reduxCURD/reducer";
import { curdActions } from "reduxCURD/actions";
import { ButtonMain } from "components/Common/Buttons";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip } from "reactstrap";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
import SpinnerLoader from "components/Common/SpinnerLoader";
import MapBox from "components/GISMAP";
import { languageService } from "../../Language/language.service";
import { circle } from "react-icons-kit/fa/circle";
import { ic_arrow_back } from "react-icons-kit/md/ic_arrow_back";
import { substractObjects } from "utils/utils";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import SvgIcon from "react-icons-kit";
import { getAssetLines } from "../../reduxRelated/actions/assetHelperAction";
import { Icon } from "react-icons-kit";
import { cancel } from "react-icons-kit/typicons/cancel";
import { themeService } from "../../theme/service/activeTheme.service";
import { commonStyles } from "../../theme/commonStyles";
import { retroColors } from "../../style/basic/basicColors";

function format2Digits(num) {
  return num && !isNaN(parseFloat(num)) ? parseFloat(num).toFixed(2) : "0.00";
}
class WOGISView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lineGroups: [],
      spinnerLoading: false,
      selectedMaintenance: null,
      selectedLine: {},
    };

    this.styles = planStyle;
  }
  componentDidMount() {
    this.props.getWorkorder(this.props.match.params.id);
    this.props.getAssetLines();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.workorderActionType !== prevProps.workorderActionType && this.props.workorderActionType === "WORKORDER_READ_SUCCESS") {
      //console.log('workorder received', this.props.workorder);
      this.setWorkorder(this.props.workorder);
    }
  }
  getMPLocation(Locs) {
    let l =
      !Locs || Locs.length == 0
        ? { start: 0, end: 0 }
        : Locs[0].type === "Milepost"
          ? Locs[0]
          : Locs.length > 1 && Locs[1].type === "Milepost"
            ? Locs[1]
            : { start: 0, end: 0 }; //null;
    return l;
  }
  setWorkorder(workorder) {
    let lineGroups = [];
    let baseLineId = workorder.locationId;

    let baseLine = this.props.lineAssets.find(l => {
      return l._id == baseLineId;
    });

    if (baseLine) {
      let lineColor = "purple"; //default
      if (baseLine.systemAttributes && baseLine.systemAttributes.stroke) {
        lineColor = baseLine.systemAttributes.stroke;
      }

      let maintLines = this.processMaintenances(workorder.maintenanceRequests);

      let selectedMaintenance = maintLines[0] ? maintLines[0] : {};

      baseLine.color = lineColor;
      baseLine.width = 1;
      lineGroups.push({ baseLine: baseLine, lines: maintLines });
      this.setState({ lineGroups: lineGroups, selectedLine: baseLine, selectedMaintenance: selectedMaintenance });
    }
  }
  setLineAssets(asset) {
    this.setState({ lineAsset: asset });
  }

  formatDate(d) {
    let date = new Date(d);
    let dd = date.getDate(),
      mm = date.getMonth() + 1,
      yyyy = date.getFullYear();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return mm + "/" + dd + "/" + yyyy;
  }
  fallsIn(p, p1, p2) {
    return p >= p1 && p <= p2;
  }
  overlaps(loc1, loc2) {
    return this.fallsIn(loc1.start, loc2.start, loc2.end) || this.fallsIn(loc1.end, loc2.start, loc2.end);
  }
  locationRender(location) {
    return location.reduce((locations, l) => {
      switch (l.type) {
        case "Milepost":
        case "Marker":
          let start = l.start;
          let end = l.end;
          if (l.type === "Milepost") {
            start = format2Digits(start);
            end = format2Digits(end);
          }

          locations.push(
            <div>
              <strong>{languageService(l.type)}:</strong> {start} to {end}
            </div>,
          );
          break;
        case "GPS":
          break;
      }

      return locations;
    }, []);
  }
  processMaintenances(maintenances) {
    let textcolor = "black",
      color = "black";
    let checkedMs = [];
    let colors = [
      "#E53935",
      "#D81B60",
      "#8E24AA",
      "#5E35B1",
      "#3949AB",
      "#1E88E5",
      "#039BE5",
      "#00ACC1",
      "#00897B",
      "#43A047",
      "#7CB342",
      "#C0CA33",
      "#FDD835",
      "#FFB300",
      "#FB8C00",
      "#F4511E",
      "#6D4C41",
      "#757575",
      "#546E7A",
    ]; //['black', 'green', 'red', 'blue','cyan', 'magenta'];
    let textStyle = {
      color: "rgb(64, 118, 179)",
      fontSize: "12px",
      fontFamily: "Arial",
      letterSpacing: "0.3px",
    };
    let headingStyle = {
      float: "left",
      fontFamily: "Arial",
      fontSize: "18px",
      letterSpacing: "0.95px",
      color: "rgb(64, 118, 179)",
      borderBottom: "1px solid rgb(209, 209, 209)",
      display: "block",
      width: "100%",
    };
    let maintenanceLines = maintenances.map((val, index) => {
      let i = index % colors.length;
      color = colors[i];
      textcolor = color;
      {
        let loc = this.getMPLocation(val.location); //val.location[0].type==='Milepost' ? val.location[0] : val.location.length>1 && val.location[1].type==='Milepost' ? val.location[1] : null;
        //if(loc !== null)
        {
          let url = "/maintenancebacklogs/" + val._id;

          let msg = (
            <div>
              <h4 style={headingStyle}>{val.mrNumber}</h4>
              <div style={textStyle}>
                <div>
                  <strong>{languageService("created at")}:</strong> {this.formatDate(val.createdAt)}
                </div>
                {this.locationRender(val.location)}
                <div style={{ maxWidth: "200px", marginBottom: "10px", textAlign: "justify" }}>{val.description}</div>

                <Link style={{ float: "right", textDecoration: "none" }} to={url}>
                  <span
                    style={{
                      color: "rgb(64, 118, 179)",
                      fontSize: "12px",
                      fontFamily: "Arial",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {languageService("View")}
                  </span>
                </Link>
              </div>
            </div>
          );

          let data = {
            start: +loc.start,
            end: +loc.end,
            text: this.formatDate(val.createdAt),
            color: color,
            offset: 0,
            msg: msg,
            width: 5,
            visible: true,
            _id: val.mrNumber,
          };

          for (let m of maintenances) {
            if (m.mrNumber !== val.mrNumber && !checkedMs.includes(m.mrNumber) && this.overlaps(loc, this.getMPLocation(m.location))) {
              data.offset += 30;
              checkedMs.push(val.mrNumber);
            }
          }
          return data;
        }
      }

      return null;
    });

    return maintenanceLines;
  }

  render() {
    let wo = this.props.workorder;
    return (
      <React.Fragment>
        <Row style={themeService(commonStyles.pageBorderRowStyle)}>
          <Col md={12} style={{ paddingLeft: "0px", position: "unset" }}>
            <div style={themeService(commonStyles.pageTitleDetailStyle)}>
              {wo && (
                <React.Fragment>
                  <Link to="/workorders" className="linkStyleTable">
                    <SvgIcon
                      size={25}
                      icon={ic_arrow_back}
                      style={{
                        marginRight: "5px",
                        marginLeft: "5px",
                        verticalAlign: "middle",
                        cursor: "pointer",
                      }}
                    />
                  </Link>
                  <SvgIcon size={12} icon={circle} style={{ marginRight: "10px", marginLeft: "5px" }} />
                </React.Fragment>
              )}
              {languageService("Capital Plans")}
            </div>
            {wo && (
              <div style={{ margin: "7px 0 0 10px", float: "left" }}>
                <div style={themeService(this.styles.fieldHeading)}>{languageService("Location")}:</div>
                <div style={themeService(this.styles.fieldText)}>{wo.locationName}</div>
              </div>
            )}

            {wo && (
              <div style={{ float: "right", width: "285px" }}>
                <div style={themeService(this.styles.fieldHeading)}>{languageService("MWO Number")} :</div>
                <div style={themeService(this.styles.fieldText)}>{wo.mwoNumber}</div>

                <div style={themeService(this.styles.fieldHeading)}>{languageService("Created")}:</div>
                <div style={themeService(this.styles.fieldText)}>{wo.createdAt}</div>
              </div>
            )}
          </Col>
        </Row>

        <div
          id="mainContent"
          style={{
            margin: "0px 15px",
            padding: "10px 0px",
          }}
        >
          {this.state.lineGroups && this.state.lineGroups.length && (
            <MapBox
              assets={{}}
              lineAsset={this.state.selectedLine}
              selectedAsset={this.state.selectedMaintenance}
              lineGroups={this.state.lineGroups}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}
const getWorkorder = curdActions.getWorkorder;

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: { getWorkorder, getAssetLines },
};

let variableList = {
  workorderReducer: { workorder: {} },
  assetHelperReducer: { lineAssets: [] },
};
const WOGISViewContainer = CRUDFunction(WOGISView, "WOGISView", actionOptions, variableList, ["workorderReducer", "assetHelperReducer"]);

export default WOGISViewContainer;

let planStyle = {
  // userHeading: {
  //   color: 'rgba(64, 118, 179)',
  //   fontSize: '14px',
  //   paddingBottom: '1em'
  // },
  // userStyle: {
  //   width: '50%',
  //   border: '1px solid #f1f1f1',
  //   boxShadow: 'rgb(238, 238, 238) 1px 1px 1px',
  //   padding: '10px',
  //   borderRadius: '5px'
  // },
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

  MaintenanceDetailsContainer: {
    background: "#fff",
    boxShadow: "3px 3px 5px #cfcfcf",
    margin: "0px 30px  0px 30px",
    padding: "15px",
    textAlign: "left",
    color: " rgba(64, 118, 179)",
    fontSize: "12px",
  },
  MaintenanceDescriptionContainer: {
    background: "#fff",
    boxShadow: "1px 1px 2px #cfcfcf",
    padding: "15px",
    textAlign: "left",
    color: " rgba(64, 118, 179)",
    fontSize: "12px",
    marginBottom: "20px",
  },
  fieldHeading: {
    default: {
      display: "inline-block",
      color: "rgba(64, 118, 179)",
      fontWeight: "600",
      fontSize: "14px",
      paddingBottom: "0.5em",
      marginRight: "10px",
    },
    retro: {
      display: "inline-block",
      color: retroColors.second,
      fontWeight: "600",
      fontSize: "14px",
      paddingBottom: "0.5em",
      marginRight: "10px",
    },
  },
  fieldText: {
    default: {
      display: "inline-block",
      color: "rgba(64, 118, 179)",
      fontSize: "14px",
      paddingBottom: "1em",
    },
    retro: {
      display: "inline-block",
      color: retroColors.second,
      fontSize: "12px",
      paddingBottom: "1em",
    },
  },
  subfieldText: {
    color: "rgba(64, 118, 179)",
    fontSize: "11px",
    paddingBottom: "0em",
  },
  fieldGroup: {
    marginBottom: "2em",
  },
};
