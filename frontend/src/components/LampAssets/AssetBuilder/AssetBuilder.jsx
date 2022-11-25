import React, { Component } from "react";
import { Badge, Collapse, CardBody, Card } from "reactstrap";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { CRUDFunction } from "reduxCURD/container";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
import { Label } from "components/Common/Forms/formsMiscItems";
import { ModalStyles } from "components/Common/styles.js";
import _ from "lodash";
import "components/Common/commonform.css";
import { ButtonActionsTable } from "components/Common/Buttons";
import { curdActions } from "reduxCURD/actions";
import { languageService } from "Language/language.service";
import { FORM_SUBMIT_TYPES } from "../../../utils/globals";
import { recursivelyFindAssetId } from "../index";
import moment from "moment-timezone";
import ImageSlider from "../../Common/ImageSlider";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "../../../theme/service/activeTheme.service";
import { formFeildStyle } from "../../../wigets/forms/style/formFields";
import { commonStyles } from "../../../theme/commonStyles";
import * as turf from "@turf/turf";
import { ToastContainer, toast } from "react-toastify";
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature } from "react-mapbox-gl";
import { ic_keyboard_arrow_down } from "react-icons-kit/md/ic_keyboard_arrow_down";
import { ic_keyboard_arrow_right } from "react-icons-kit/md/ic_keyboard_arrow_right";
import { ic_keyboard_arrow_up } from "react-icons-kit/md/ic_keyboard_arrow_up";
import { ic_arrow_upward } from "react-icons-kit/md/ic_arrow_upward";
import { ic_arrow_downward } from "react-icons-kit/md/ic_arrow_downward";
import SvgIcon from "react-icons-kit";
import ThisTable from "components/Common/ThisTable/index";
import {
  arrayToTree,
  filterTreeByProperties,
  loadTreeObjects,
  TreeNode,
  findTreeNode,
  groupTreeNodeByProperty,
  treeToArray,
} from "utils/treeData";
import GeoJsonView from "./GeoJsonView";
var Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoidXNtYW5xdXJlc2hpIiwiYSI6ImNqdzlmNG0yazBpcHA0OHBkYmgyZHdyZjAifQ.2O9HKhWB6EG-OZk3g4zdOg",
});

function format2DigitNumber(num) {
  return num && !isNaN(parseFloat(num)) ? parseFloat(num).toFixed(2) : "0.00";
}

const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);
const InfoBar = (props) => {
  const pills = props.pills.map((p, i) => (
    <Badge pill color={p.color}>
      {p.text}
    </Badge>
  ));
  return <span>{pills}</span>;
};
const TitleBar = (props) => {
  const expanded = props.expanded || false;
  return (
    <div onClick={props.onClick} style={{ backgroundColor: "lightGrey", padding: "10px" }}>
      <Label>{props.title}</Label>

      {!expanded && props.km && props.miles && (
        <InfoBar
          pills={[
            { color: "primary", text: props.km + " km" },
            { color: "info", text: props.miles + " miles" },
          ]}
        />
      )}
    </div>
  );
};
const wizFields = {
  geoJsonField: {
    label: true,
    labelText: "Geo-JsonCord",
    disabled: false,
    value: null,
  },
};
class LineSelector extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const options =
      this.props.options &&
      this.props.options.map((item) => (
        <option value={item._id} key={item._id}>
          {item.unitId}
        </option>
      ));
    return (
      <div>
        <TitleBar title={languageService("Select Plannable Location")} />
        <Card>
          <CardBody>
            <div style={themeService(formFeildStyle.feildStyle)}>
              <label style={themeService(formFeildStyle.lblStyle)}>{languageService("Location")}</label>
              <select type="select" name="selLocation" id="selLocation" value={this.props.value} onChange={this.props.onChange}>
                {options}
              </select>
            </div>
            <div style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
              <MyButton style={themeService(ButtonStyle.commonButton)} type="submit" name="cmdNext" onClick={this.props.onNextPage}>
                {languageService("Next")}{" "}
              </MyButton>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}
class TrackAssetList extends Component {
  constructor(props) {
    super(props);
    this.state = { pageSize: 30, page: 0 };
    //this.data=[{unitId:"track",start:0, end:13.0, length: 13.0}];
    this.columns = [
      {
        Header: () => <div>{`${languageService("Asset Name")}`}</div>,
        id: "unitId",

        accessor: (d) => {
          let expand = null;
          if (!d.expanded) {
            expand = (
              <div
                style={{
                  height: "100%",
                  display: "inline-block",
                  verticalAlign: "top",
                }}
                onClick={(e) => {
                  //this.props.handleExpandClick(d);
                }}
              >
                <SvgIcon size={20} icon={ic_keyboard_arrow_right} style={{ verticalAlign: "middle", height: "100%" }} />
              </div>
            );
          } else {
            expand = (
              <div
                style={{
                  width: "2px",
                  height: "100%",
                }}
              />
            );
          }
          if (d.expanded) {
            expand = (
              <div
                style={{
                  height: "100%",
                  display: "inline-block",
                  verticalAlign: "top",
                }}
                onClick={(e) => {
                  //this.props.handleContractClick(d);
                }}
              >
                <SvgIcon size={20} icon={ic_keyboard_arrow_down} style={{ verticalAlign: "middle", height: "100%" }} />
              </div>
            );
          }

          if (d.paddingLeft == 10) {
            expand = (
              <React.Fragment>
                <span
                  style={{
                    paddingLeft: d.paddingLeft ? d.paddingLeft - 20 : "0px",
                    height: "100%",
                    borderLeft: d.paddingLeft ? "2px solid #ccc" : "",
                    marginLeft: d.paddingLeft ? "8px" : "0px",
                    width: "2px",
                    display: "inline-block",
                  }}
                />
                {expand}
              </React.Fragment>
            );
          }
          if (d.paddingLeft > 10) {
            expand = (
              <React.Fragment>
                <span
                  style={{
                    paddingLeft: d.paddingLeft ? d.paddingLeft - 20 : "0px",
                    height: "100%",
                    borderLeft: d.paddingLeft ? "2px solid #ccc" : "",
                    marginLeft: d.paddingLeft ? "8px" : "0px",
                    width: "2px",
                    display: " inline-block",
                  }}
                />
                <span
                  style={{
                    paddingLeft: d.paddingLeft ? d.paddingLeft - 20 : "0px",
                    height: "100%",
                    borderLeft: d.paddingLeft ? "2px solid #ccc" : "",
                    marginLeft: d.paddingLeft ? "8px" : "0px",
                    display: "inline-block",
                    width: "2px",
                  }}
                />
                {expand}
              </React.Fragment>
            );
          }

          return (
            <div style={{ height: "100%" }}>
              {/*<div style={{ display: "inline-block", paddingRight: "5px", height: "100%", verticalAlign: "middle" }}>{expand}</div>*/}
              <div style={{ display: "inline-block", height: "100%", verticalAlign: "middle", lineHeight: "36px", paddingLeft: "20px" }}>
                {d.unitId}({d.assetType}){" "}
              </div>
            </div>
          );
        },
        minWidth: 150,
      },

      {
        Header: () => <div>{languageService("Asset Type")}</div>,
        id: "assetType",

        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{d.assetType} </div>;
        },
      },
      {
        Header: () => <div>{languageService("Start (milepost)")}</div>,
        id: "start",

        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{format2DigitNumber(d.start)} </div>;
        },
        minWidth: 100,
      },
      {
        Header: () => <div>{languageService("End (milepost)")}</div>,
        id: "end",

        accessor: (d) => {
          return <div style={{ textAlign: "center" }}>{format2DigitNumber(d.end)} </div>;
        },
        minWidth: 100,
      },

      /* {
        Header: () => (
          <div>
            {languageService("Length (milepost)")}

          </div>
        ),
        id: "length",

        accessor: d => {
          return <div style={{ textAlign: "center" }}>{format2DigitNumber(d.assetLength)} </div>;
        },
        minWidth: 100,
      }, */
      {
        Header: languageService("Actions"),
        id: "actions",
        accessor: (d) => {
          return (
            <div>
              {/*               { (
                <ButtonActionsTable
                  handleClick={() => {
                    this.props.addAssetHandler("Add", d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Add")}
                />
              )}
              {(
                <ButtonActionsTable
                  handleClick={() => {
                    this.props.editAsset("Edit", d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Edit")}
                />
              )}
 */}{" "}
              {d.assetType != "track" && (
                <ButtonActionsTable
                  handleClick={() => {
                    this.props.removeAsset(d);
                  }}
                  margin="0px 10px 0px 0px"
                  buttonText={languageService("Remove")}
                />
              )}
            </div>
          );
        },
        minWidth: 110,
      },
    ];
  }
  render() {
    let columns = [...this.columns];
    /*  return (  <div>
      <ReactTable
          data={this.props.tableData}
          columns={columns}
          defaultPageSize = {2}
          pageSizeOptions = {[2,4, 6]}
       />
   </div>        ); */
    return (
      <ThisTable
        //onColClick={this.props.onColClick}
        onClickSelect
        //sortable={this.props.sortable}
        tableColumns={columns}
        tableData={this.props.tableData}
        pageSize={this.state.pageSize}
        pagination={true}
        onClickSelect={this.props.onClickSelect}
        handleSelectedClick={this.props.handleSelectedClick}
        handlePageChange={(page) => {
          if (this.props.handlePageSave) {
            this.props.handlePageSave(page, this.state.pageSize);
          }
        }}
        page={this.props.page}
        defaultSorted={this.props.defaultSorted}
        onSortedChange={this.props.onSortedChange}
        fetchData={this.props.fetchData}
        manual={this.props.manual}
        defaultPageSize={this.props.pageSize}
        pages={this.props.pages}
        showPagination={this.props.pagination}
        showPaginationTop={this.props.showPaginationTop}
        showPaginationBottom={this.props.showPaginationBottom}
        pageSizeOptions={this.props.pageSizeOptions}
      />
    );
  }
}
class WizardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      fields: {
        primaryTrack: !props.primaryTrackExists,
        trackNumber: 1,
        trackName: "",
        description: "track",
        mpStart: 0.0,
        mpEnd: 0.0,
        electrified: false,
        electValue: "3rd Rail",
        railOrientation: "EW",
        trackOrientation: "NS",
        localTrackName: "",
        geoJsonCord: null,
        geoJsonMsg: null,
        geoJsonLenKm: null,
        geoJsonLenMiles: null,
        mapBound: null,
        geoJsonFile: null,
      },
    };
    if (props.fields && Object.keys(props.fields).length != 0) {
      this.state.fields = props.fields;
    }
    this.handleNextPage = this.handleNextPage.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.handleSumbitPage = this.handleSumbitPage.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.validateGeoJson = this.validateGeoJson.bind(this);
    this.getMinOrMax = this.getMinOrMax.bind(this);
    this.getBounds = this.getBounds.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }
  componentDidMount() {
    this.changeHandler({ target: { name: "selRailOrientation", value: "EW" } });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.lineStart != prevProps.lineStart || this.props.lineEnd != prevProps.lineEnd) {
      //  this.setState({lienStart: this.props.lineStart})
    }
    if (this.props.primaryTrackExists != prevProps.primaryTrackExists) {
      const { fields } = this.state;
      fields.primaryTrack = !this.props.primaryTrackExists;
      this.setState({ fields: fields });
    }
  }
  getMinOrMax(markersObj, minOrMax, latOrLng) {
    if (minOrMax == "max") {
      return _.maxBy(markersObj, function (value) {
        return value[latOrLng];
      })[latOrLng];
    } else {
      return _.minBy(markersObj, function (value) {
        return value[latOrLng];
      })[latOrLng];
    }
  }
  getBounds(coords) {
    var maxLat = this.getMinOrMax(coords, "max", 1);
    var minLat = this.getMinOrMax(coords, "min", 1);
    var maxLng = this.getMinOrMax(coords, "max", 0);
    var minLng = this.getMinOrMax(coords, "min", 0);

    let latPadding = Math.abs(minLat - maxLat) * 0.05;
    let lngPadding = Math.abs(minLng - maxLng) * 0.05;
    var southWest = [minLng - lngPadding, minLat - latPadding];
    var northEast = [maxLng + lngPadding, maxLat + lngPadding];
    return [southWest, northEast];
  }
  handlePrev() {
    let fields = Object.assign({}, this.state.fields);
    this.props.prevPageHandler(fields);
  }
  handleFileChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    if (!file) return;
    this.setState({ fields: { ...this.state.fields, geoJsonFile: file } });
    reader.onloadend = () => {
      try {
        //const {fields}=this.state;
        //let geoJsonData = JSON.parse(reader.result);
        //newFields={...fields,geoJsonCord:geoJsonData};

        //this.setState({ fields: newFields });
        //validate json object
        this.validateGeoJson(reader.result);
      } catch (e) {
        this.showToastError(languageService("Invalid Json file"));
      }
    };
    reader.readAsText(file);
  }
  validateGeoJson = (la) => {
    try {
      let obj = null;
      let lampAttributes = "";
      if (la) {
        lampAttributes = la;
      }

      if (lampAttributes) {
        obj = JSON.parse(lampAttributes);
        //this.geoJsonData = obj;
      } else {
        this.setState({
          fields: { ...this.state.fields, geoJsonLenMiles: "0.0", geoJsonLenKm: "0.0", geoJsonMsg: "", mapBound: null, geoJsonCord: null },
        });
        return;
      }
      //obj = this.geoJsonData;
      if (obj) {
        if (obj.features && obj.features[0]) {
          if (obj.features[0].geometry.type === "LineString") {
            let lineString = turf.lineString(obj.features[0].geometry.coordinates, { name: "l1" });
            let length = parseFloat(turf.length(lineString, { units: "miles" })).toFixed(2);
            let lengthKm = parseFloat(turf.length(lineString, { units: "kilometers" })).toFixed(2);
            let fitBound = this.getBounds(obj.features[0].geometry.coordinates);
            this.setState({
              fields: {
                ...this.state.fields,
                geoJsonLenMiles: length,
                geoJsonLenKm: lengthKm,
                geoJsonMsg: "",
                mapBound: fitBound,
                geoJsonCord: obj,
              },
            });
          } else {
            this.setState({
              fields: {
                ...this.state.fields,
                geoJsonLenMiles: "0.0",
                geoJsonLenKm: "0.0",
                geoJsonMsg: "Invalid GeoJson Line Type",
                mapBound: null,
                geoJsonCord: null,
              },
            });
          }
        } else {
          this.setState({
            fields: {
              ...this.state.fields,
              geoJsonLenMiles: "0.0",
              geoJsonLenKm: "0.0",
              geoJsonMsg: "Invalid GeoJson Data",
              mapBound: null,
              geoJsonCord: null,
            },
          });
        }
      }
    } catch (err) {
      this.setState({
        fields: {
          ...this.state.fields,
          geoJsonLenMiles: "0.0",
          geoJsonLenKm: "0.0",
          geoJsonMsg: "Error Loading GeoJson Data",
          mapBound: null,
        },
      });
    }
  };

  showToastError(message, error) {
    let toastMessage = message + ": " + error;
    if (!error) {
      toastMessage = message;
    }

    toast.error(toastMessage, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  handleSumbitPage() {
    const { fields } = this.state;
    this.props.handleFinish(fields);
  }
  handleNextPage(e) {
    e.preventDefault();
    let obj = Object.assign({}, this.state.fields);
    if (e.target.name == "cmdNext") {
      const { description, trackNumber, trackName, mpStart, mpEnd, primaryTrack } = this.state.fields;
      const { lineStart, lineEnd } = this.props;
      let mpStartFloat = mpStart ? parseFloat(mpStart) : "";
      let mpEndFloat = mpEnd ? parseFloat(mpEnd) : ""; // start end validation
      /*       let trackList = this.props.trackList.filter(item => item.attributes && item.attributes.trackNumber && item.attributes.trackNumber == trackNumber);
      if (trackList.length > 0) {
        this.showToastError("Track Number Already exists");
        return;
      }
 */ if (trackName === "") {
        this.showToastError(languageService("Please enter track name"));
        return;
      }
      let trackLength = mpEndFloat - mpStartFloat;
      if (trackLength <= 0) {
        this.showToastError(languageService("Track length is not valid, Please provide valid values for track start and end"));
        return;
      }
      if (primaryTrack) {
        if (mpStartFloat < 0 || mpEndFloat < 0) {
          this.showToastError(languageService("Values of MP Start or  MP End has negative value"));
          return;
        }
      } else {
        if (mpStartFloat > 15000 || mpEndFloat > 15000) {
          this.showToastError(languageService("Values of MP Start & MP End are out of range"));
          return;
        }
        /*         if (mpStartFloat < lineStart || mpStartFloat >= lineEnd || mpEndFloat <= mpStartFloat || mpEndFloat >= lineEnd) {
          this.showToastError("Values of MP Start & MP End are out of range");
          return;
        }
 */
      }
      this.props.updateAssetList({ ...obj });
      this.setState({ page: 2 });
    } else if (e.target.name === "cmdPrev") {
      this.setState({ page: 1 });
    } else if (e.target.name === "cmdFinish") {
    }
  }
  render() {
    const { lineStart, lineEnd, primaryTrackExists } = this.props;
    const { fields } = this.state;
    let lineRangeText = primaryTrackExists ? "[" + lineStart + "-" + lineEnd + "]" : "";
    const page1 = (
      <Card>
        <CardBody>
          <Row>
            <Col>
              <div style={themeService(formFeildStyle.feildStyle)}>
                <label style={themeService(formFeildStyle.lblStyle)}>{languageService("Primary Track")}</label>
                <input
                  name="primaryTrack"
                  type="checkbox"
                  value={"primaryTrack"}
                  checked={fields.primaryTrack}
                  disabled
                  onChange={this.changeHandler}
                />
              </div>
              {/*           <div style={themeService(formFeildStyle.feildStyle)}>
            <label style={themeService(formFeildStyle.lblStyle)}>Track Number</label>
            <input name="trackNumber" type="number" value={fields.trackNumber} onChange={this.changeHandler} />
          </div> */}
              <div style={themeService(formFeildStyle.feildStyle)}>
                <label style={themeService(formFeildStyle.lblStyle)}>{languageService("Name")}</label>
                <input name="trackName" type="text" value={fields.trackName} onChange={this.changeHandler} />
              </div>

              <div style={themeService(formFeildStyle.feildStyle)}>
                <label style={themeService(formFeildStyle.lblStyle)}>{languageService("Description")}</label>
                <input name="description" type="text" value={fields.description} onChange={this.changeHandler} />
              </div>
              <div style={themeService(formFeildStyle.feildStyle)}>
                <label style={themeService(formFeildStyle.lblStyle)}>
                  {languageService("MP Start")} {lineRangeText}
                </label>
                <input name="mpStart" type="number" value={fields.mpStart} onChange={this.changeHandler} />
              </div>
              <div style={themeService(formFeildStyle.feildStyle)}>
                <label style={themeService(formFeildStyle.lblStyle)}>
                  {languageService("MP End")} {lineRangeText}
                </label>
                <input name="mpEnd" type="number" value={fields.mpEnd} onChange={this.changeHandler} />
              </div>
              <div style={themeService(formFeildStyle.feildStyle)}>
                <label style={themeService(formFeildStyle.lblStyle)}>{languageService("Electrified Territory")}</label>
                <input name="chkElectrified" type="checkbox" checked={fields.electrified} onChange={this.changeHandler} />{" "}
                {fields.electrified === true ? (
                  <select name="selPower" value={fields.electValue} onChange={this.changeHandler}>
                    <option value="3rd Rail">{languageService("3rd Rail Power")}</option>
                    <option value="Catenary">{languageService("Catenary Power")}</option>
                  </select>
                ) : null}{" "}
              </div>
              <div style={themeService(formFeildStyle.feildStyle)}>
                <label style={themeService(formFeildStyle.lblStyle)}>{languageService("Track Orientation")}</label>
                <select
                  type="select"
                  name="selRailOrientation"
                  id="railOrientation"
                  value={fields.railOrientation}
                  onChange={this.changeHandler}
                >
                  <option value="EW">{languageService("North/South")}</option>
                  <option value="NS">{languageService("East/West")}</option>
                </select>
              </div>
              <div style={themeService(formFeildStyle.feildStyle)}>
                <label style={themeService(formFeildStyle.lblStyle)}>{languageService("Local Track Name")}</label>
                <input name="localTrackName" type="text" value={fields.localTrackName} onChange={this.changeHandler} />
              </div>
            </Col>
            <Col>
              <Label>{languageService("Track GeoJson")}</Label>
              <GeoJsonView
                geoJsonCord={fields.geoJsonCord}
                geoJsonLenMiles={fields.geoJsonLenMiles}
                geoJsonLenKm={fields.geoJsonLenKm}
                geoJsonMsg={fields.geoJsonMsg}
                mapBound={fields.mapBound}
                handleFileChange={this.handleFileChange}
                file={fields.geoJsonFile}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="modal-track-setup" style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
                <MyButton style={themeService(ButtonStyle.commonButton)} type="submit" name="cmdPrev" onClick={this.handlePrev}>
                  {languageService("Prev")}{" "}
                </MyButton>

                <MyButton style={themeService(ButtonStyle.commonButton)} type="submit" name="cmdNext" onClick={this.handleNextPage}>
                  {languageService("Next")}{" "}
                </MyButton>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
    const page2 = (
      <div>
        <TitleBar title={languageService("Track > Assets")} />
        <Card>
          <CardBody>
            <TrackAssetList tableData={this.props.tableData} removeAsset={this.props.removeAsset} />
            <div style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
              <MyButton style={themeService(ButtonStyle.commonButton)} type="submit" name="cmdPrev" onClick={this.handleNextPage}>
                {languageService("Prev")}{" "}
              </MyButton>
              <MyButton style={themeService(ButtonStyle.commonButton)} type="submit" name="cmdFinsh" onClick={this.handleSumbitPage}>
                {languageService("Finish")}{" "}
              </MyButton>
            </div>
          </CardBody>
        </Card>
      </div>
    );

    return (
      <div>
        {this.state.page == 1 && page1}
        {this.state.page == 2 && page2}
      </div>
    );
  }
  changeHandler = (e, blur) => {
    let fields = this.state.fields;
    switch (e.target.name) {
      case "primaryTrack":
        if (e.target.checked) {
          //fields={primaryTrack: true, mpStart: this.props.lineStart, mpEnd: this.props.lineEnd}
          this.setState({ fields: { ...fields, primaryTrack: true, mpStart: this.props.lineStart, mpEnd: this.props.lineEnd } });
        } else {
          //fields={...fields,primaryTrack: e.target.checked};
          this.setState({ fields: { ...fields, primaryTrack: e.target.checked } });
        }
        break;
      case "trackNumber":
        this.setState({ fields: { ...fields, trackNumber: parseInt(e.target.value) } });
        break;
      case "trackName":
        this.setState({ fields: { ...fields, trackName: e.target.value } });
        break;
      case "description":
        this.setState({ fields: { ...fields, description: e.target.value } });
        break;
      case "mpStart":
        this.setState({ fields: { ...fields, mpStart: e.target.value } });
        break;
      case "mpEnd":
        this.setState({ fields: { ...fields, mpEnd: e.target.value } });
        break;
      case "chkElectrified":
        this.setState({ fields: { ...fields, electrified: e.target.checked } });
        break;
      case "selPower":
        this.setState({ fields: { ...fields, electValue: e.target.value } });
        break;
      case "selRailOrientation":
        //let trackOrientation = e.target.value === "EW" ? "NS" : "EW";
        this.setState({ fields: { ...fields, railOrientation: e.target.value } });
        break;
      case "localTrackName":
        this.setState({ fields: { ...fields, localTrackName: e.target.value } });
        break;
    }
    //console.log(e);
  };
}
class AssetBuilder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: wizFields,
      parentAsset: null,
      geoJsonCord: null,
      isGeoCollapseOpen: true,

      tableData: [],
      geoJsonLenMiles: null,
      geoJsonLenKm: null,
      geoJsonMsg: "",
      mapCenter: null,
      mapBound: null,
      page: 0,
      plannableLocations: null,
      selLoaction: "",
      lineStart: 0,
      lineEnd: 0,
      primaryTrackExists: false,
    };
    this.geoJsonData = null;
    this.assetList = null;
    this.trackList = [];
    this.fieldBackup = {};
    props.parentAsset &&
      props.parentAsset.attributes &&
      props.parentAsset.attributes.geoJsonCord &&
      (this.geoJsonData = JSON.parse(props.parentAsset.attributes.geoJsonCord));

    //console.log(props.parentAsset);
    /*     this.updateFrom = this.updateFrom.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  */ this.validateGeoJson = this.validateGeoJson.bind(this);
    this.showToastError = this.showToastError.bind(this);

    this.getMinOrMax = this.getMinOrMax.bind(this);
    this.getBounds = this.getBounds.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this.onMapZoom = this.onMapZoom.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.loadLineData = this.loadLineData.bind(this);
    this.fillAssetsArray = this.fillAssetsArray.bind(this);
    this.removeAsset = this.removeAsset.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.findPlannableAssets = this.findPlannableAssets.bind(this);
    this.findAssetsWithAssetList = this.findAssetsWithAssetList.bind(this);
    this.loadLocations = this.loadLocations.bind(this);
    this.nextPageHandler = this.nextPageHandler.bind(this);
    this.prevPageHandler = this.prevPageHandler.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.selectLine = this.selectLine.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose = () => {
    this.setState({});
    this.props.toggle("None", null);
  };

  handleFinish(fields) {
    let asset = {};
    const { parentAsset, geoJsonCord, tableData } = this.state;
    asset.wizard = true;
    asset.parentAssetObj = {};
    asset.parentAssetObj._id = parentAsset._id;
    asset.trackAssets = tableData;
    if (parentAsset && parentAsset.attributes && parentAsset.attributes.geoJsonCord) {
      //Geo JSON Cord if changed
      if (parentAsset.attributes.geoJsonCord != geoJsonCord) {
        asset.geoJsonCord = geoJsonCord;
      }
    } else if (geoJsonCord && geoJsonCord != "") {
      asset.geoJsonCord = geoJsonCord;
    }
    asset.trackData = fields;
    //console.log(asset);

    //this.tableData
    this.props.handleSubmitForm(asset, FORM_SUBMIT_TYPES.ADD);
  }
  nextPageHandler() {
    let page = this.state.page;
    if (page == 0) {
      if (this.state.parentAsset) {
        this.selectLine(this.state.parentAsset);
      }
    }
    //console.log("Page: "+page);
    page++;
    this.setState({ page: page });
  }
  prevPageHandler(fields) {
    let page = this.state.page;
    page--;
    this.setState({ page: page });
    this.fieldBackup = fields;
  }
  loadLocations(props) {
    props = props ? props : this.props;
    this.trackList = [];
    if (this.props.assets && this.props.assets.assetTree) {
      const locations = this.findAssetsWithAssetList(this.props.assets.assetsList, this.findPlannableAssets(this.props.assets.assetTree));
      if (locations && locations.length > 0) {
        let parentAsset = locations[0];
        this.setState({ selLoaction: locations[0]._id, parentAsset: parentAsset });
      }
      this.setState({ plannableLocations: locations });
      this.selectLine(locations[0]);
      /*       let treeNode=findTreeNode(this.props.assets.assetTree,locations[0]._id);
      let mainNode={};
      mainNode[locations[0]._id]=treeNode;
      let trackList=[];
      filterTreeByProperties(mainNode,{assetType:'track'},trackList);
      let tracks=this.findAssetsWithAssetList(this.props.assets.assetsList,trackList);
      this.trackList=tracks;
      let primaryTrack = tracks.filter((t)=>(t.attributes.primaryTrack==true));
      console.log(primaryTrack);
      console.log(tracks);
 */
    }
  }
  findPlannableAssets(assetTree) {
    let plannableLocations = [];
    if (filterTreeByProperties(assetTree, { location: true, plannable: true }, plannableLocations)) {
      if (this.loggedInUser.assignedLocation) plannableLocations.push(this.loggedInUser.assignedLocation);
    }
    return plannableLocations;
  }
  findAssetsWithAssetList(assetList, codeList) {
    return assetList.filter((item) => codeList.indexOf(item._id) >= 0);
  }
  changeHandler = (e, blur) => {
    if (e.target.name === "selLocation") {
      let assetList = this.props.assets.assetsList.filter((item) => item._id === e.target.value);
      let parentAsset = assetList.length > 0 ? assetList[0] : null;
      this.selectLine(parentAsset);
      //this.setState({selLoaction: e.target.value,parentAsset:parentAsset});
    }
  };
  selectLine(lineAsset) {
    //let assetList = this.props.assets.assetsList.filter((item)=>(item._id===lineAsset));
    if (lineAsset) {
      let parentAsset = lineAsset;

      const assets = _.filter(this.props.assets.assetsList, { parentAsset: lineAsset._id, assetType: "track" });
      this.assetList = assets;
      if (parentAsset) {
        let strGeoJSON = "";
        if (parentAsset.attributes && parentAsset.attributes.geoJsonCord) {
          strGeoJSON = parentAsset.attributes.geoJsonCord;
        }
        this.geoJsonData = null;
        this.validateGeoJson(strGeoJSON);

        let treeNode = findTreeNode(this.props.assets.assetTree, lineAsset._id);

        let mainNode = {};
        mainNode[lineAsset.id] = treeNode;
        let trackList = [];
        filterTreeByProperties(mainNode, { assetType: "track" }, trackList);
        let tracks = this.findAssetsWithAssetList(this.props.assets.assetsList, trackList);
        this.trackList = tracks;
        let primaryTrack = tracks.filter((t) => t.attributes && t.attributes.primaryTrack == true);
        //console.log(primaryTrack);
        //console.log(tracks);
        this.setState({ selLoaction: parentAsset._id, parentAsset: parentAsset, primaryTrackExists: primaryTrack.length > 0 });
      }
    }

    //this.setState({selLoaction: lineAsset,parentAsset:parentAsset});
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

  getMinOrMax(markersObj, minOrMax, latOrLng) {
    if (minOrMax == "max") {
      return _.maxBy(markersObj, function (value) {
        return value[latOrLng];
      })[latOrLng];
    } else {
      return _.minBy(markersObj, function (value) {
        return value[latOrLng];
      })[latOrLng];
    }
  }
  getBounds(coords) {
    var maxLat = this.getMinOrMax(coords, "max", 1);
    var minLat = this.getMinOrMax(coords, "min", 1);
    var maxLng = this.getMinOrMax(coords, "max", 0);
    var minLng = this.getMinOrMax(coords, "min", 0);

    let latPadding = Math.abs(minLat - maxLat) * 0.05;
    let lngPadding = Math.abs(minLng - maxLng) * 0.05;
    var southWest = [minLng - lngPadding, minLat - latPadding];
    var northEast = [maxLng + lngPadding, maxLat + lngPadding];
    return [southWest, northEast];
  }
  onMapZoom = () => {
    this.setState({ mapBound: null });
  };
  onMapClick = () => {
    this.setState({ mapBound: null });
  };
  loadLineData() {
    const { parentAsset } = this.state;
    const assets = _.filter(this.props.assets.assetsList, { parentAsset: parentAsset._id, assetType: "track" });
    this.assetList = assets;
    if (parentAsset) {
      let geoJsonCord = parentAsset.attributes ? parentAsset.attributes.geoJsonCord : "";
      this.validateGeoJson(geoJsonCord);
    }
    //console.log(assets);
  }
  removeAsset(obj) {
    if (obj) {
      let newObj = _.reject(this.state.tableData, { unitId: obj.unitId });
      this.setState({ tableData: newObj });
    }
    //console.log(obj);
  }
  fillAssetsArray(obj) {
    let assetList = [];
    let asset = {};

    asset.unitId = obj.trackName; //+ " " + obj.trackNumber;
    asset.assetType = "track";
    asset.start = obj.mpStart;
    asset.end = obj.mpEnd;
    assetList.push(asset);

    // if (obj.railOrientation == "EW") {
    //   // assetList.push({
    //   //   unitId: "East Rail." + asset.unitId,
    //   //   assetType: "rail",
    //   //   start: obj.mpStart,
    //   //   end: obj.mpEnd,
    //   //   length: obj.mpEnd - obj.mpStart,
    //   // });
    //   // assetList.push({
    //   //   unitId: "West Rail." + asset.unitId,
    //   //   assetType: "rail",
    //   //   start: obj.mpStart,
    //   //   end: obj.mpEnd,
    //   //   length: obj.mpEnd - obj.mpStart,
    //   // });
    // } else {
    //   // assetList.push({
    //   //   unitId: "North Rail." + asset.unitId,
    //   //   assetType: "rail",
    //   //   start: obj.mpStart,
    //   //   end: obj.mpEnd,
    //   //   length: obj.mpEnd - obj.mpStart,
    //   // });
    //   // assetList.push({
    //   //   unitId: "South Rail." + asset.unitId,
    //   //   assetType: "rail",
    //   //   start: obj.mpStart,
    //   //   end: obj.mpEnd,
    //   //   length: obj.mpEnd - obj.mpStart,
    //   // });
    // }
    // if (obj.electrified && obj.electrified == true) {
    //   if (obj.electValue == "3rd Rail") {
    //     assetList.push({
    //       unitId: "3rd Rail." + asset.unitId,
    //       assetType: "3rd Rail",
    //       start: obj.mpStart,
    //       end: obj.mpEnd,
    //       length: obj.mpEnd - obj.mpStart,
    //     });
    //   } else {
    //     assetList.push({
    //       unitId: "Catenary Power ." + asset.unitId,
    //       assetType: "Catenary Power",
    //       start: obj.mpStart,
    //       end: obj.mpEnd,
    //       length: obj.mpEnd - obj.mpStart,
    //     });
    //   }
    // }
    this.setState({ tableData: assetList });
  }

  handleFileChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    if (!file) return;
    reader.onloadend = () => {
      try {
        this.geoJsonData = JSON.parse(reader.result);
        this.setState({ geoJsonCord: reader.result });
        //validate json object
        this.validateGeoJson(reader.result);
      } catch (e) {
        this.showToastError(languageService("Invalid Json file"));
      }
    };
    reader.readAsText(file);
  }
  validateGeoJson = (la) => {
    try {
      let obj = null;
      let lampAttributes = "";
      if (la) {
        lampAttributes = la;
      }

      if (lampAttributes) {
        obj = JSON.parse(lampAttributes);
        this.geoJsonData = obj;
      } else if (this.geoJsonData) {
        obj = this.geoJsonData;
      } else {
        this.setState({ geoJsonLenMiles: "0.0", geoJsonLenKm: "0.0", geoJsonMsg: "", mapBound: null, geoJsonCord: null });
        this.geoJsonData = null;
        return;
      }
      //obj = this.geoJsonData;
      if (obj) {
        if (obj.features && obj.features[0]) {
          if (obj.features[0].geometry.type === "LineString") {
            let lineString = turf.lineString(obj.features[0].geometry.coordinates, { name: "l1" });
            let length = parseFloat(turf.length(lineString, { units: "miles" })).toFixed(2);
            let lengthKm = parseFloat(turf.length(lineString, { units: "kilometers" })).toFixed(2);
            let fitBound = this.getBounds(obj.features[0].geometry.coordinates);
            this.setState({
              geoJsonLenMiles: length,
              geoJsonLenKm: lengthKm,
              geoJsonMsg: "",
              mapBound: fitBound,
              geoJsonCord: lampAttributes,
            });
          } else {
            this.setState({
              geoJsonLenMiles: "0.0",
              geoJsonLenKm: "0.0",
              geoJsonMsg: "Invalid GeoJson Line Type",
              mapBound: null,
              geoJsonCord: null,
            });
          }
        } else {
          this.setState({
            geoJsonLenMiles: "0.0",
            geoJsonLenKm: "0.0",
            geoJsonMsg: "Invalid GeoJson Data",
            mapBound: null,
            geoJsonCord: null,
          });
        }
      }
    } catch (err) {
      this.setState({ geoJsonLenMiles: "0.0", geoJsonLenKm: "0.0", geoJsonMsg: "Error Loading GeoJson Data", mapBound: null });
    }
  };
  componentDidMount() {}
  componentWillMount() {}
  componentDidUpdate(prevProps, prevState) {
    if (this.props.modal != prevProps.modal && this.props.modal == true) {
      this.setState({ page: 0 });
    }
    if (!this.state.parentAsset) {
      if (this.props.parentAsset && prevProps.parentAsset && this.props.parentAsset._id != prevProps.parentAsset._id) {
        this.loadLineData();
      } else if (this.props.parentAsset && this.props.parentAsset.attributes.geoJsonCord) {
        if (!prevProps.parentAsset || prevProps.parentAsset._id != this.props.parentAsset._id) this.loadLineData();
      }
    } else if (this.state.parentAsset) {
      if (this.state.parentAsset && !prevState.parentAsset) {
        this.loadLineData();
      } else if (this.parentAsset && prevState.parentAsset && this.parentAsset._id != prevState.parentAsset._id) {
        this.loadLineData();
      }
    }
    if (
      !this.state.plannableLocations ||
      (this.props.assets && prevProps.assets.assetsList.length !== this.props.assets.assetsList.length)
    ) {
      this.loadLocations();
    }
  }
  render() {
    let parentAssetDescription = this.state.parentAsset ? this.state.parentAsset.description : "";
    let parentAssetName = this.state.parentAsset ? this.state.parentAsset.unitId : "";

    let lineStart = 0,
      lineEnd = 0,
      lineName = "";
    if (this.state.parentAsset) {
      lineStart = this.state.parentAsset.start;
      lineEnd = this.state.parentAsset.end;
      lineName = this.state.parentAsset.unitId;
    }
    const {
      primaryTrackExists,
      plannableLocations,
      selLoaction,
      page,
      isGeoCollapseOpen,
      geoJsonLenMiles,
      geoJsonLenKm,
      fields,
      tableData,
      mapBound,
    } = this.state;
    let geoJsonDetails = this.state.lampAttributes && this.state.lampAttributes.geoJsonCord && (
      <div style={{ marginTop: "5px", fontSize: "12px", backgroundColor: "white", padding: "10px" }}>
        <div>
          {languageService("Total Length Miles")}: {this.state.geoJsonLenMiles}{" "}
        </div>
        <div>
          {languageService("Total Length Km")} : {this.state.geoJsonLenKm}
        </div>
        <div style={{ paddingTop: "5px", color: "red" }}> {this.state.geoJsonMsg}</div>
      </div>
    );

    if (this.state.geoJsonCord && this.state.geoJsonLenMiles && this.geoJsonData && page == 1) {
      let objData = this.geoJsonData;
      let objFeature = objData.features && objData.features[0] ? objData.features[0] : null;
      let fitBound = mapBound; //? mapBound : this.getBounds(objFeature.geometry.coordinates);

      //let aryBounds = this.getBounds(objFeature.geometry.coordinates);
      geoJsonDetails = (
        <div style={{ marginTop: "5px", fontSize: "12px", backgroundColor: "white", padding: "10px" }}>
          <div style={{ paddingTop: "5px", color: "red" }}> {this.state.geoJsonMsg}</div>
          <React.Fragment>
            {objFeature && objFeature.geometry.coordinates[0] && (
              <div style={{ display: "inline-block" }}>
                <Map
                  style="mapbox://styles/mapbox/streets-v9"
                  onZoom={this.onMapZoom}
                  onClick={this.onMapClick}
                  /* center={objFeature.geometry.coordinates[0]} */
                  containerStyle={{
                    height: "150px",
                    width: "250px",
                  }}
                  fitBounds={fitBound}
                >
                  <GeoJSONLayer key="key1" data={objData} linePaint={{ "line-color": "#888", "line-width": 8 }} />
                </Map>
              </div>
            )}
          </React.Fragment>
        </div>
      );
    }

    return (
      <Modal
        contentClassName={themeService({ default: this.props.className, retro: "retroModal", electric: "electricModal" })}
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        style={{ maxWidth: "98vw" }}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {languageService("Track Setup")}
        </ModalHeader>

        <ModalBody style={themeService(CommonModalStyle.body)}>
          <div>
            <Label>{languageService(parentAssetName)}</Label>
          </div>

          <div>
            {page == 0 && (
              <LineSelector
                options={plannableLocations}
                value={selLoaction}
                onChange={this.changeHandler}
                onNextPage={this.nextPageHandler}
              />
            )}
            {page == 1 && (
              <div>
                {" "}
                <TitleBar
                  onClick={() => {
                    this.setState({ isGeoCollapseOpen: !this.state.isGeoCollapseOpen });
                  }}
                  title={languageService("GeoJson Data")}
                  km={geoJsonLenKm}
                  miles={geoJsonLenMiles}
                  expanded={isGeoCollapseOpen}
                />
                <Collapse isOpen={isGeoCollapseOpen}>
                  <Card>
                    <CardBody>
                      <Row>
                        <Col>
                          <div style={themeService(formFeildStyle.feildStyle)}>
                            <Label>{languageService("Location")}</Label>
                            <Label>{parentAssetName}</Label>
                          </div>
                          <div style={themeService(formFeildStyle.feildStyle)}>
                            <Label>{languageService("Description")}</Label>
                            <Label>{parentAssetDescription}</Label>
                          </div>
                          <div style={themeService(formFeildStyle.feildStyle)}>
                            {fields["geoJsonField"].label && <Label>{languageService(fields["geoJsonField"].labelText)}</Label>}
                            <input
                              type="file"
                              accept={".json, .geoJSON"}
                              style={themeService(formFeildStyle.inputStyle)}
                              name={"GeoJson"}
                              onChange={this.handleFileChange}
                              disabled={fields["geoJsonField"].disabled}
                              value={fields["geoJsonField"].value}
                            />
                          </div>
                          <div style={themeService(formFeildStyle.feildStyle)}>
                            <Label>{languageService("Length (miles)")}</Label>
                            <Label>{geoJsonLenMiles}</Label>
                          </div>
                          <div style={themeService(formFeildStyle.feildStyle)}>
                            <Label>{languageService(languageService("Length (km)"))}</Label>
                            <Label>{geoJsonLenKm}</Label>
                          </div>
                        </Col>
                        <Col>{geoJsonDetails}</Col>
                      </Row>
                      <Row>
                        <Col>
                          <div
                            className="modal-track-setup"
                            style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}
                          >
                            <MyButton
                              style={themeService(ButtonStyle.commonButton)}
                              type="submit"
                              name="cmdPrev"
                              onClick={this.prevPageHandler}
                            >
                              {languageService("Prev")}{" "}
                            </MyButton>

                            <MyButton
                              style={themeService(ButtonStyle.commonButton)}
                              type="submit"
                              name="cmdNext"
                              onClick={this.nextPageHandler}
                            >
                              {languageService("Next")}{" "}
                            </MyButton>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Collapse>
              </div>
            )}
            {page == 2 && this.state.parentAsset && (
              <div style={{ marginTop: "10px" }}>
                <TitleBar title={languageService("New Track")}></TitleBar>
                <WizardPage
                  lineStart={lineStart}
                  lineEnd={lineEnd}
                  lineDescription={this.state.parentAsset.description}
                  tableData={tableData}
                  updateAssetList={this.fillAssetsArray}
                  removeAsset={this.removeAsset}
                  prevPageHandler={this.prevPageHandler}
                  handleFinish={this.handleFinish}
                  trackList={this.trackList}
                  primaryTrackExists={primaryTrackExists}
                  fields={this.fieldBackup}
                />
              </div>
            )}
          </div>
        </ModalBody>
        {
          <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
            <MyButton style={themeService(ButtonStyle.commonButton)} type="button" onClick={this.handleClose}>
              {languageService("Close")}
            </MyButton>
          </ModalFooter>
        }
      </Modal>
    );
  }
}

//let AssetBuilderContainer = CRUDFunction(AddAssets, "AddAsset", actionOptions, variables, ["assetTypeReducer"]);
export default AssetBuilder;
