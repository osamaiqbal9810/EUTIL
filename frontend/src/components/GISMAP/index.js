import React from "react";
import * as turf from "@turf/turf";
import ReactMapboxGl, { Image, Popup, Marker, Layer, Feature, ZoomControl, GeoJSONLayer, ScaleControl } from "react-mapbox-gl";
import { isValidJsonString } from "../Common/helperFunctions";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
import { getServerEndpoint } from "utils/serverEndpoint";
import {
  getAssetGeoJson,
  getGeoJsonCoordinates,
  getGeoJsonStrCoordinates,
  makeTurfLineString,
  validateAssetGeoJsonStr,
  validateGeoJsonStr,
} from "../../utils/GISUtils";
let baseUrl = getServerEndpoint() + "assetImages/";

var Map = ReactMapboxGl({
  accessToken: "pk.eyJ1Ijoib3NhbWExNTciLCJhIjoiY2w3OTNsbTB4MGZ4MDNub2xteGNhanNjbSJ9.gET6tPcC1dG6MTRDqk4f8w",
});

const lineLayout = {
  "line-cap": "round",
  "line-join": "round",
};

const linePaint = {
  "line-color": "#c400c4",
  "line-width": 1,
};

const selectedlinePaint = {
  "line-color": "#4790E5",
  "line-width": 5,
};

const paralellinePaint = {
  "line-color": "#90E547",
  "line-width": 5,
};

const ImageLayer = (props) => (
  <div>
    {" "}
    <Image id={"img" + props.id} url={baseUrl + props.imgFile} onError={props.onError} />{" "}
    <Layer type="symbol" id={props.id} layout={{ "icon-image": "img" + props.id }}>
      {props.points.map((p, i) => {
        if (p === undefined || p === null) return <div key={i}></div>;

        return (
          <Feature
            coordinates={p.geoJsonData.geometry.coordinates}
            anchor="bottom"
            key={i}
            id={i}
            properties={{ _id: p._id ? p._id : "p" + i }}
            onMouseEnter={props.onMouseEnter ? props.onMouseEnter : (o) => {}}
            onMouseLeave={props.onMouseLeave ? props.onMouseLeave : (o) => {}}
            onClick={props.onClick ? props.onClick : (o) => {}}
            //draggable
          ></Feature>
        );
      })}
    </Layer>
  </div>
);

const LinearLayer = (props) => (
  <Layer type="line" layout={props.layout} paint={props.paint}>
    {props.lines.map((line, i) => {
      //console.log(line.geoJsonData);
      return (
        <Feature
          coordinates={line.geoJsonData.geometry.coordinates}
          key={"l" + i}
          id={i}
          properties={{ _id: line._id ? line._id : "line" + i }}
          onMouseEnter={props.onMouseEnter ? props.onMouseEnter : (o) => {}}
          onMouseLeave={props.onMouseLeave ? props.onMouseLeave : (o) => {}}
          onClick={props.onClick ? props.onClick : (o) => {}}
          //draggable
        ></Feature>
      );
    })}
  </Layer>
);
const StyleSwitchControl = (props) => (
  <div style={{ textAlign: "right" }}>
    <label style={{ fontSize: "14px", color: "#000" }}> Style: </label>
    <select name="styles" id="styles" style={{ fontSize: "14px", color: "#000" }} onChange={props.switcher}>
      <option value="satellite-v9">Satellite</option>
      <option value="streets-v11">Streets</option>
      <option value="light-v10">Light</option>
      <option value="dark-v10">Dark</option>
    </select>
  </div>
);

const SEPTAViewCenter = [-75.34693857552918, 40.10761754944623];
class GISMAP extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {};
    this.state.zoom = [10];
    this.state.assetsmarker = [];
    this.state.selectedAssetInfo = { isMarker: false };

    this.state.center = SEPTAViewCenter;
    //this.state.linesList = null;
    this.state.geoJsonCord = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              // [-75.25916398199536, 39.96268527583308, 0],
              // [-75.25969185531477, 39.962725100820826, 0],
              // [-75.25985964214016, 39.962748479197565, 0],
              // [-75.25990775426783, 39.96275795109503, 0],
              [0, 0, 0],
            ],
          },
        },
      ],
    };
    this.state.mapStyle = "mapbox://styles/mapbox/satellite-v9";

    if (this.props.lineAsset && validateAssetGeoJsonStr(this.props.lineAsset)) {
      this.state.geoJsonCord = getAssetGeoJson(this.props.lineAsset);
      this.state.center = this.getCenter(getGeoJsonCoordinates(this.state.geoJsonCord));
    }

    this.state.showPopup = false;
    this.state.lineGroups = [];
    this.popup = {};
    this.onMove = this.onMove.bind(this);
    this.onClickl1 = this.onClickl1.bind(this);
    this.switchMapStyle = this.switchMapStyle.bind(this);
  }
  getLineGroupVisibleElements(lg) {
    let visibleElements = [];
    for (let l1 of lg) {
      if (l1.lines) for (let la of l1.lines) visibleElements.push(la._id);

      if (l1.points) for (let la of l1.points) visibleElements.push(la._id);
    }
    return visibleElements;
  }
  areDifferent(
    lg1,
    lg2, // lineGroup difference
  ) {
    let a1 = this.getLineGroupVisibleElements(lg1),
      a2 = this.getLineGroupVisibleElements(lg2);

    let d = a1.filter((i) => {
      return a2.indexOf(i) < 0;
    });
    // console.log("difference : ", a1, a2, d);
    return d.length > 0;
  }
  // input: asset
  // output: {start, end} parsed and validated start & end coordinates
  getAssetStartEnd(asset) {
    let start = 0,
      end = 0;
    try {
      if (asset.start != undefined || asset.start == null) {
        if (asset.start == null) start = 0;
        else start = +asset.start;
      }

      if (asset.end != undefined || asset.end == null) {
        if (asset.end == null) end = 0;
        else end = +asset.end;
      }

      if (start > end) {
        console.log("asset: ", asset._id, asset.text, " start is greater than end, swapping");
        let temp = end;
        end = start;
        start = temp;
      }
    } catch (err) {
      //todo log
      console.log(err);
    }

    return { start: start, end: end };
  }

  applyOffset(value, offset) {
    if (value >= offset) value -= offset;
    else console.log("value is less than offset, skipping offset");

    return value;
  }

  //
  // input: jsoncoordinates[{lon, lat},{lon, lat}...]
  // output: center[lon, lat]
  //
  getCenter(geoJsonCords) {
    let newcenter = [0, 0];
    try {
      newcenter = geoJsonCords[parseInt(Math.floor(geoJsonCords.length / 2))];
    } catch (err) {
      console.log("GISMAP.index.getCenter.catch", err);
    }
    return newcenter;
  }
  //
  // input : asset {}
  // output: gis info : { start: start, end: end, geoJsonData: geoJsonData, color: color, msg: msg, width: width, _id: l1._id ? l1._id : "" };
  //
  //{point: null,isMarker: false, line: sliced, _id: asset._id, }
  convertAssetToGIS(asset, parentLine) {
    let parentStart = parseInt(parentLine.start);
    let units = this.getUnitOfMeasurements(parentLine);

    let coordsToProcess = this.state.geoJsonCord.features[0].geometry.coordinates; //todo eleminate this
    if (validateAssetGeoJsonStr(parentLine)) {
      coordsToProcess = getGeoJsonCoordinates(getAssetGeoJson(parentLine));
    }

    let assetWithGIS = false;
    let returnValue = {};
    try {
      // Look if geojson exist for the asset and use if it has its own geojson
      if (asset && asset.geoJsonCord) {
        let assetGIS = JSON.parse(asset.geoJsonCord);
        coordsToProcess = assetGIS.features[0].geometry.coordinates;
        assetWithGIS = true;
      }

      // Validate start and end coordinates
      let { start, end } = this.getAssetStartEnd(asset);

      let baseLineOffset = assetWithGIS ? start : parentStart; // use parent line's start to offset using parent's GIS

      // Apply baseline offset, make the start/end zero based if not
      start = this.applyOffset(start, baseLineOffset);
      end = this.applyOffset(end, baseLineOffset);

      // Calculate line string and length
      let geoJsonData = turf.lineString(coordsToProcess, { name: "line 1" });
      // let length1 = turf.length(geoJsonData, { units: units });

      // In case of linear asset get line slice from parent line coords
      if (start < end) {
        // its a linear asset
        if (!assetWithGIS)
          // if this asset doesn't have its geo json than use the part from parent
          geoJsonData = turf.lineSliceAlong(geoJsonData, start, end, { units: units });

        // clean coordinates to eliminat zero length lines
        geoJsonData = turf.cleanCoords(geoJsonData);

        if (asset.offset) {
          // && !assetWithGIS)
          geoJsonData = turf.lineOffset(geoJsonData, asset.offset, { units: "meters" });
          // clean coordinates to eliminat zero length lines
          geoJsonData = turf.cleanCoords(geoJsonData);
        }
      } // its a point asset
      else {
        if (asset.geoJsonObj) {
          geoJsonData = asset.geoJsonObj;
        } else {
          geoJsonData = turf.along(geoJsonData, start, { units: units });
        }
      }

      // prepare structure to return
      let color = asset.color ? asset.color : "black";
      let msg = <div>{asset.text ? asset.text : ""}</div>;
      if (asset.msg) msg = asset.msg;

      let width = 5; //default
      if (asset.width) width = asset.width;

      returnValue = { start: start, end: end, geoJsonData: geoJsonData, color: color, msg: msg, width: width, _id: asset._id };
    } catch (err) {
      console.log("GISMAP.index.convertAssetToGIS.catch", err);
    }

    return returnValue;
  }

  ConvertselectedAssetGPS(GPSasset, units) {
    let asset = GPSasset;
    let icon = "rail-15";
    if (asset.icon) icon = asset.icon;

    // // console.log("Track length Calculated:" + length1);

    if (!asset.start) {
      return;
    }

    if (!asset.end) {
      asset.end = asset.start;
    }
    //   let point = { coordinates: [+asset.start.lon, +asset.start.lat], type: "Point" };
    //   let selectedAssetInfo= {
    //     point: point,
    //     isMarker: true,
    //     line: null,
    //     icon: icon,
    //   };
    //   let center = this.calculateCenter(selectedAssetInfo);

    //   this.setState({
    //     selectedAssetInfo: selectedAssetInfo,
    //     center: center
    //   });
    // } else {
    //// // console.log("GPS Linear");
    var start = [+asset.start.lon, +asset.start.lat];
    var stop = [+asset.end.lon, +asset.end.lat];

    // if (turf.distance(start, stop, { units: units }) == 0) {
    //if its a point
    let selectedAssetInfo = {
      point: { geometry: { coordinates: start } },
      isMarker: true,
      line: null,
      icon: icon,
    };
    let center = this.calculateCenter(selectedAssetInfo);

    this.setState({
      selectedAssetInfo: selectedAssetInfo,
      center: center,
    });

    //  return;
    //}

    // var linestring1 = turf.lineString(this.state.geoJsonCord.features[0].geometry.coordinates, { name: "line 1" });
    // var length1 = turf.length(linestring1, { units: units });

    // if (turf.pointToLineDistance(start, linestring1, { units: units }) > length1) {
    //   // point is not on line
    //   let selectedAssetInfo = {
    //     point: { geometry: { coordinates: start } },
    //     isMarker: true,
    //     line: null,
    //     icon: icon,
    //   };
    //   let center = this.calculateCenter(selectedAssetInfo);
    //   this.setState({
    //     selectedAssetInfo: selectedAssetInfo,
    //     ceenter: center
    //   });

    //   return;
    // }

    // var sliced = turf.lineSlice(start, stop, linestring1); //turf.lineSliceAlong(linestring1, start, stop, {units: 'miles'});
    // //// // console.log('sliced segment at ' +asset.start+' and '+ asset.end+ ' miles : '+ JSON.stringify(sliced));
    // let selectedAssetInfo={
    //   point: null,
    //   isMarker: false,
    //   line: sliced,
    // };
    // let center=this.calculateCenter(selectedAssetInfo);

    // this.setState({
    //   selectedAssetInfo: selectedAssetInfo,
    //   center:center
    // });
    //}
  }
  ConvertselectedAsset(asset, parentLine) {
    let retVal = this.convertAssetToGIS(asset, parentLine);
    //let units = this.getUnitOfMeasurements(parentLine);

    if (retVal.start >= retVal.end) {
      // its a point asset

      let icon = "rail-15";
      if (asset.icon) {
        icon = asset.icon;
      }
      let selectedAssetInfo = {
        point: retVal.geoJsonData,
        isMarker: true,
        line: null,
        icon: icon,
        _id: asset._id,
      };
      let center = this.calculateCenter(selectedAssetInfo);
      this.setState({
        selectedAssetInfo: selectedAssetInfo,
        center: center,
      });
    } else {
      let selectedAssetInfo = {
        point: null,
        isMarker: false,
        line: retVal.geoJsonData,
        _id: asset._id,
      };
      let center = this.calculateCenter(selectedAssetInfo);
      //console.log('selected,center', selectedAssetInfo, center);
      this.setState({
        selectedAssetInfo: selectedAssetInfo,
        center: center,
      });
    }
  }
  calculateCenter(selectedAssetInfo) {
    //const { selectedAssetInfo } = this.state;
    var center = this.state.center;
    if (selectedAssetInfo.isMarker) {
      center = selectedAssetInfo.point.geometry.coordinates;
    } else if (!selectedAssetInfo.isMarker && selectedAssetInfo.line) {
      center = selectedAssetInfo.line.geometry.coordinates[Math.round(selectedAssetInfo.line.geometry.coordinates.length / 2)];
    }
    return center;
  }
  processLinesList(linesList, baseLine) {
    if (!linesList || !linesList.length) return null;

    let linesData = linesList.map((l1, index) => {
      try {
        return this.convertAssetToGIS(l1, baseLine);
      } catch (err) {
        return null; // log
      }
    });

    return linesData;
  }
  processPointsList(pointsList, lineCoords, baseLineOffset = 0, units = "miles") {
    if (!pointsList || !pointsList.length) return null;

    var linestring1 = turf.lineString(lineCoords.features[0].geometry.coordinates, { name: "line 1" });
    var length1 = turf.length(linestring1, { units: units });

    let pointsData = pointsList.map((p1, index) => {
      let start = +p1.start,
        end = p1.end ? +p1.end : +p1.start;
      if (isNaN(start) || isNaN(end) || (start === 0 && end === 0) || !p1.visible) return null;

      start -= baseLineOffset;
      end -= baseLineOffset;

      let geoJsonData = turf.along(linestring1, start, { units: units });
      if (p1.geoJsonObj) {
        geoJsonData = p1.geoJsonObj;
      }
      //let color = l1.color;

      // if (l1.offset) {
      //   geoJsonData = turf.cleanCoords(geoJsonData);
      //   geoJsonData = turf.lineOffset(geoJsonData, l1.offset, { units: "meters" });
      // }
      let msg = <div>{p1.text ? p1.text : ""} </div>;
      if (p1.msg) {
        msg = p1.msg;
      }
      let imgFile = "asset33.png";
      if (p1.imgFile) {
        imgFile = p1.imgFile;
      }

      return { start: start, end: end, geoJsonData: geoJsonData, msg: msg, _id: p1._id ? p1._id : "", imgFile: imgFile };
    });

    pointsData = _.groupBy(pointsData, "imgFile");
    //console.log('points group by layer', pointsData);
    return pointsData;
  }
  //  detects change in selected asset and converts into GIS displayable object
  //  input: selectedAsset, previousSelectedAsset, parent line asset, units of measurement
  // output: sets the state for selected asset
  //
  processSelectedAsset(currentSelected, previousSelected, parentLine, uom = "miles") {
    if (currentSelected) {
      if (currentSelected !== previousSelected) {
        if (currentSelected.type && currentSelected.type === "GPS") this.ConvertselectedAssetGPS(currentSelected, uom);
        else this.ConvertselectedAsset(currentSelected, parentLine);
      }
    }
  }
  componentDidMount() {
    let newcord = null;
    //this.mapRef.removeImage = (id)=>{};
    //Map.removeImage=(i)=>{};
    if (
      this.props.lineAsset &&
      this.props.lineAsset.attributes &&
      this.props.lineAsset.attributes.geoJsonCord &&
      isValidJsonString(this.props.lineAsset.attributes.geoJsonCord)
    ) {
      newcord = JSON.parse(this.props.lineAsset.attributes.geoJsonCord);
      let units = this.getUnitOfMeasurements(this.props.lineAsset);

      if (newcord.features) {
        var cord = newcord.features[0].geometry.coordinates;
        var newcenter = cord[Math.floor(cord.length / 2)];
        this.setState({ geoJsonCord: newcord, center: [newcenter[0], newcenter[1]] });
      }
    }

    let units = this.getUnitOfMeasurements(this.props.lineAsset);

    this.processLineGroups(this.props.lineGroups);
    this.processSelectedAsset(this.props.selectedAsset, null, this.props.lineAsset, units);

    if (this.props.assets) {
      //console.table(this.props.assets);
      this.setState({ assets: this.props.assets });
    }

    if (
      this.props.lineAsset &&
      this.props.lineAsset.attributes &&
      this.props.lineAsset.attributes.geoJsonCord &&
      isValidJsonString(this.props.lineAsset.attributes.geoJsonCord)
    ) {
      newcord = JSON.parse(this.props.lineAsset.attributes.geoJsonCord);

      if (newcord.features) {
        let cord = newcord.features[0].geometry.coordinates;
        let newcenter = cord[Math.floor(cord.length / 2)];
        this.setState({ geoJsonCord: newcord, center: [newcenter[0], newcenter[1]] });
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.processSelectedAsset(
      this.props.selectedAsset,
      prevProps.selectedAsset,
      this.props.lineAsset,
      this.getUnitOfMeasurements(this.props.lineAsset),
    );

    if (this.props.assets !== prevProps.assets && this.props.assets) {
      this.setState({ assets: this.props.assets });
    }

    if (this.props.lineGroups && this.props.lineGroups.length && this.areDifferent(this.props.lineGroups, prevProps.lineGroups)) {
      // change detected
      console.log("change detected in lineGroups");
      this.processLineGroups(this.props.lineGroups);
    }
  }
  processLineGroups(propslineGroups) {
    if (propslineGroups && propslineGroups.length) {
      let lineGroups = [],
        newcenter1 = [null, null];

      for (let i = 0; i < propslineGroups.length; i++) {
        let baseLine;
        try {
          let lg = propslineGroups[i];
          baseLine = lg.baseLine;
          let baseLineCoords = getAssetGeoJson(baseLine); //this.getGeoJson(baseLine);
          let lines = lg.lines ? lg.lines : [];
          let points = lg.points ? lg.points : [];

          newcenter1 = baseLineCoords.features ? this.getCenter(baseLineCoords.features[0].geometry.coordinates) : newcenter1;
          let units = this.getUnitOfMeasurements(baseLine);

          // console.log('baseline:', lg.baseLine);
          let geoLines = this.processLinesList(lines, baseLine);
          let geoPoints = this.processPointsList(points, baseLineCoords, baseLine.start, units);

          if (!newcenter1[0] && !newcenter1[1] && lines && lines[0] && lines[0].geoJsonCord) {
            // if the center is not calculated, set it to the first linear
            let coords = getGeoJsonStrCoordinates(lines[0].geoJsonCord);
            newcenter1 = coords !== [] ? this.getCenter(coords) : newcenter1;
          }
          lineGroups.push({
            baseLine: { coords: baseLineCoords, color: baseLine.color, width: baseLine.width },
            lines: geoLines,
            points: geoPoints,
          });
          //}
        } catch (err) {
          console.log("error processing GIS data for", baseLine.unitId, err);
        }
      }

      this.setState({ lineGroups: lineGroups, center: [newcenter1[0], newcenter1[1]] });
    }
  }

  onZoomOrDrag(map, event) {
    // console.log('mapbox zoom:', map.getZoom(), map.getCenter()); // todo: transfer map.getZoom() and map.getCenter() back to host for retention
  }
  getUnitOfMeasurements(lineAsset) {
    let uom = "miles";
    if (
      lineAsset &&
      lineAsset.systemAttributes &&
      lineAsset.systemAttributes.milepostUnit &&
      lineAsset.systemAttributes.milepostUnit.value &&
      typeof lineAsset.systemAttributes.milepostUnit.value === "string"
    ) {
      uom = lineAsset.systemAttributes.milepostUnit.value;
    }
    return uom;
  }
  switchMapStyle(style) {
    const { name, value } = style.target;
    this.setState({ mapStyle: "mapbox://styles/mapbox/" + value });
  }
  render() {
    // return (<div></div>);
    // // console.log(this.props.lineAsset)

    let linesData = []; //null;
    let lineStyle = this.props.lineColor ? { "line-color": this.props.lineColor, "line-width": 1 } : linePaint;

    if (this.props.lineWidth) {
      lineStyle["line-width"] = this.props.lineWidth;
    }

    if (this.state.lineGroups && this.state.lineGroups.length) {
      let index = 0;
      for (let lg of this.state.lineGroups) {
        if (lg && lg.baseLine) {
          // hide baseline as per JD
          // linesData.push(
          //   <GeoJSONLayer
          //     key={index++}
          //     data={lg.baseLine.coords}
          //     linePaint={{ "line-color": lg.baseLine.color, "line-width": lg.baseLine.width }}
          //   />,
          // );
          if (lg.lines)
            for (let ln of lg.lines) {
              if (ln && ln.geoJsonData && ln.color && ln.width)
                linesData.push(
                  //<GeoJSONLayer key={index++} data={ln.geoJsonData} linePaint={{ "line-color": ln.color, "line-width": ln.width }} />,
                  <LinearLayer
                    key={index++}
                    layout={lineLayout}
                    paint={{ "line-color": ln.color, "line-width": ln.width }}
                    lines={[ln]}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    onClick={this.onClickl1}
                  />,
                );
            }
          if (lg.points)
            for (let ptLayerId in lg.points) {
              let layer = lg.points[ptLayerId];

              if (ptLayerId !== "undefined" && layer && layer.length > 0 && layer[0] !== null) {
                // console.log('file', baseUrl + ptLayerId);
                // console.log('layer', layer);
                linesData.push(
                  <ImageLayer
                    id={index + ptLayerId}
                    key={index + ptLayerId}
                    points={layer}
                    onClick={this.onClickl1}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    imgFile={ptLayerId}
                    onError={(e) => {}}
                  />,
                );
              }
            }
          //linesData.push(<LinearLayer lines={lg.lines} />);
        }
      }
    }

    return (
      <div>
        <StyleSwitchControl switcher={this.switchMapStyle} />
        <Map
          style={this.state.mapStyle} //streets-v11"
          center={this.state.center}
          zoom={this.state.zoom}
          onZoom={this.onZoom}
          onDrag={this.onZoom}
          //onMouseMove={this.onMove}
          //onClick={this.onMClick}
          //renderChildrenInPortal
          containerStyle={{
            height: "80vh",
          }}
          ref={this.mapRef}
        >
          <ScaleControl />
          <ZoomControl />

          {/* {this.props.lineAsset && this.props.lineAsset.attributes && <GeoJSONLayer data={this.state.geoJsonCord} linePaint={lineStyle} />} */}

          {linesData}

          {this.state.selectedAssetInfo.isMarker && (
            <div>
              <Image
                id={"img-selection"}
                url={baseUrl + "crosshair.png"}
                onError={(e) => {
                  console.log("image load error:", e);
                }}
              />
              <Layer type="symbol" id="marker" layout={{ "icon-image": "img-selection" }}>
                <Feature
                  coordinates={this.state.selectedAssetInfo.point.geometry.coordinates}
                  anchor="bottom"
                  onClick={this.onClickl1}
                  properties={{ _id: this.state.selectedAssetInfo._id }}
                ></Feature>
              </Layer>
            </div>
          )}

          {!this.state.selectedAssetInfo.isMarker && this.state.selectedAssetInfo.line && (
            <div>
              <Layer type="line" layout={lineLayout} paint={selectedlinePaint}>
                <Feature
                  coordinates={this.state.selectedAssetInfo.line.geometry.coordinates}
                  onClick={this.onClickl1}
                  properties={{ _id: this.state.selectedAssetInfo._id }}
                  // coordinates={[0,0]}
                ></Feature>
              </Layer>
            </div>
          )}
          {this.state.showPopup && (
            <Popup
              coordinates={[this.popup.lng, this.popup.lat]}
              maxWidth={"300px"}
              onClick={() => {
                this.setState({ showPopup: false });
              }}
            >
              <div> {this.popup.msg} </div>
            </Popup>
          )}
        </Map>
      </div>
    );
  }

  onMove(all, coords) {
    // let {lat, lng}=coords.lngLat;
    // if(this.state.linesList)
    //   {
    //     let index=0;
    //     for(let ln of this.state.linesList)
    //     {
    //        if(ln)
    //        {
    //         //console.log(ln.geoJsonData.geometry.coordinates.length);
    //         //  linesData.push((<Layer key={index} type="line" layout={lineLayout} paint={selectedlinePaint}>
    //         //   <Feature coordinates={ln.geoJsonData.geometry.coordinates}> </Feature> </Layer>));
    //        // linesData.push(<GeoJSONLayer key={index} data={ln.geoJsonData} linePaint={{'line-color': ln.color, 'line-width': 5}} />);
    //         let lineTocheck=turf.lineString(ln.geoJsonData.geometry.coordinates);
    //         if(turf.booleanPointOnLine(turf.point([lng, lat]),lineTocheck))
    //         {
    //           console.log('Passed on line', index);
    //         }
    //         let f = turf.nearestPointOnLine(lineTocheck, turf.point([lng, lat]), {units: 'miles'});
    //           console.log('nearest to ', lng, lat, ' is ', f.geometry.coordinates);
    //        }
    //        index++;
    //     }
    //   }
    //console.log('onmove', coords.lngLat); coords.lngLat.lng, lat
  }
  onMouseEnter(o) {
    //console.log('onMouseEnter', o.feature ? o.feature.properties._id : 'no id');
  }
  onMouseLeave(o) {
    //console.log('onMouseLeave', o);
  }
  onClickl1(o) {
    if (o.feature && o.feature.properties && o.feature.properties._id) {
      let id = o.feature.properties._id;
      //console.log('onClickLayer1',  o.feature ? o.feature.properties._id:'no id');
      let { lat, lng } = o.lngLat ? o.lngLat : { lat: 0, lng: 0 };
      //console.log('clicked on', id, o);
      if (this.state.lineGroups) {
        for (let lg of this.state.lineGroups) {
          if (lg.lines)
            for (let ln of lg.lines) {
              if (lat && lng && ln && ln._id === id && ln.msg) {
                this.popup.lat = lat;
                this.popup.lng = lng;
                this.popup.msg = ln.msg;
                this.popup.LngLatLike = { lng: lng, lat: lat };
                this.setState({ showPopup: true });
                return;
              }
            }
          if (lg.points) {
            //console.log('points by type', lg.points);
            for (let typeKey in lg.points) {
              let ptsbyType = lg.points[typeKey];

              for (let pt of ptsbyType) {
                if (pt && lat && lng && pt._id === id && pt.msg) {
                  this.popup.lat = lat;
                  this.popup.lng = lng;
                  this.popup.msg = pt.msg;
                  this.popup.LngLatLike = { lng: lng, lat: lat };
                  this.setState({ showPopup: true });
                  return;
                }
              }
            }
          }
        }
      }
    }
  }
  // onMClick(all, coords) {
  //   //console.log('mclick', coords.lngLat);
  //    console.log('all ',all);
  //    console.log('coords', coords);
  //   let { lat, lng } = coords.lngLat;
  //   lat = lat.toFixed(4);
  //   lng = lng.toFixed(4);
  //   if (this.state.lineGroups) {
  //     for (let lg of this.state.lineGroups) {
  //       for (let ln of lg.lines) {
  //         if (ln) {
  //           let lineTocheck = turf.lineString(ln.geoJsonData.geometry.coordinates);
  //           //if(turf.booleanPointOnLine(turf.point([lng, lat]),lineTocheck))
  //           let f = turf.nearestPointOnLine(lineTocheck, turf.point([lng, lat]), { units: "meters" });
  //           if (f.properties.dist < 29) {
  //             this.popup.lat = lat;
  //             this.popup.lng = lng;
  //             this.popup.msg = ln.msg;
  //             this.popup.LngLatLike = { lng: lng, lat: lat };
  //             //console.log(this.popup);
  //             this.setState({ showPopup: true });
  //           }
  //           //console.log('distance', index, '=', f.properties.dist);
  //           //console.log('nearest to ', lng, lat, ' is ', f.properties.dist);//.geometry.coordinates);
  //         }
  //       }
  //     }
  //   }
  // }
}

export default GISMAP;
