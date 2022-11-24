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
import { languageService } from "../../../Language/language.service";
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

var Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoidXNtYW5xdXJlc2hpIiwiYSI6ImNqdzlmNG0yazBpcHA0OHBkYmgyZHdyZjAifQ.2O9HKhWB6EG-OZk3g4zdOg",
});
const fields = {
  geoJsonField: { label: true, lableText: "GeoJson", disabled: false },
};
class GeoJsonView extends Component {
  constructor(props) {
    super(props);
    /* this.state={
      geoJsonLenKm : null,
      geoJsonLenMiles : null,
      mapBound: null,
      geoJsonMsg:"",
    };
    this.geoJsonData=null;
 */ this.getBounds = this.getBounds.bind(
      this,
    );
    this.getMinOrMax = this.getMinOrMax.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this.onMapZoom = this.onMapZoom.bind(this);
    this.validateGeoJson = this.validateGeoJson.bind(this);
    this.reset = this.reset.bind(this);
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
  componentDidUpdate(prevProps, prevState) {
    /* if(this.props.trackId != prevProps.trackId){
      //Track Id changed
      this.reset();
    } */
  }
  reset() {
    this.validateGeoJson(this.props.geoJsonData);
  }
  render() {
    const { geoJsonCord, geoJsonLenKm, geoJsonLenMiles, geoJsonMsg, mapBound, file } = this.props;
    //const {geoJsonLenKm,geoJsonLenMiles, geoJsonMsg}=this.state;
    let geoJsonDetails = geoJsonLenMiles && (
      <div style={{ marginTop: "5px", fontSize: "12px", backgroundColor: "white", padding: "10px" }}>
        <div>
          {languageService("Total Length Miles")}: {geoJsonLenMiles}{" "}
        </div>
        <div>
          {languageService("Total Length Km")} : {geoJsonLenKm}
        </div>
        <div style={{ paddingTop: "5px", color: "red" }}> {geoJsonMsg}</div>
      </div>
    );

    if (geoJsonLenMiles && geoJsonCord) {
      let objData = geoJsonCord;
      let objFeature = objData.features && objData.features[0] ? objData.features[0] : null;
      let fitBound = mapBound; // ? mapBound : this.getBounds(objFeature.geometry.coordinates);

      //let aryBounds = this.getBounds(objFeature.geometry.coordinates);
      geoJsonDetails = (
        <div style={{ marginTop: "5px", fontSize: "12px", backgroundColor: "white", padding: "10px" }}>
          <div style={{ paddingTop: "5px", color: "red" }}> {geoJsonMsg}</div>
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
      <div>
        <Card>
          <CardBody>
            <Row>
              <Col md="12">
                <div style={themeService(formFeildStyle.feildStyle)}>
                  {<Label>GeoJson File:</Label>}
                  <input
                    type="file"
                    accept={".json, .geoJSON"}
                    style={themeService(formFeildStyle.inputStyle)}
                    name={"GeoJson"}
                    onChange={this.props.handleFileChange}
                  />
                </div>
                <div style={themeService(formFeildStyle.feildStyle)}>
                  <Label>{"Length (miles)"}</Label>
                  <Label>{geoJsonLenMiles}</Label>
                </div>
                <div style={themeService(formFeildStyle.feildStyle)}>
                  <Label>{"Length (km)"}</Label>
                  <Label>{geoJsonLenKm}</Label>
                </div>
              </Col>
              <Col Col md="12">
                {geoJsonDetails}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default GeoJsonView;
