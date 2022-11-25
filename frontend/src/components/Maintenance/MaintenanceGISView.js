import React, { Component } from "react";
import _ from "lodash";
import CustomFilters from "components/Common/Filters/CustomFilters";
//import LinearDisplay from 'components/Common/LinearDisplay/LinearDisplay';
import MapBox from "components/GISMAP";
import { Link, Route } from "react-router-dom";
import { languageService } from "../../Language/language.service";
import { getAssetGeoJson, validateAssetGeoJsonStr, calculateCenter } from "../../utils/GISUtils";
import { LocPrefixService } from "../LocationPrefixEditor/LocationPrefixService";

function getMPLocation(Locs) {
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
function format2Digits(num) {
  return num && !isNaN(parseFloat(num)) ? parseFloat(num).toFixed(2) : "0.00";
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
function formatDate(d) {
  let date = new Date(d);
  let dd = date.getDate(),
    mm = date.getMonth() + 1,
    yyyy = date.getFullYear();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return mm + "/" + dd + "/" + yyyy;
}
function fallsIn(p, p1, p2) {
  return p >= p1 && p <= p2;
}
function overlaps(loc1, loc2) {
  return fallsIn(loc1.start, loc2.start, loc2.end) || fallsIn(loc1.end, loc2.start, loc2.end);
}
function locationRender(location, lineId) {
  return location.reduce((locations, l) => {
    switch (l.type) {
      case "Milepost":
      case "Marker":
        let start = l.start;
        let end = l.end;
        let startPrefix = "";
        let endPrefix = "";
        if (l.type === "Milepost") {
          startPrefix = LocPrefixService.getPrefixMp(start, lineId);
          endPrefix = LocPrefixService.getPrefixMp(end, lineId);
          start = format2Digits(start);
          end = format2Digits(end);
        }

        locations.push(
          <div>
            <strong>{languageService(l.type)}:</strong>
            {startPrefix}
            {start} to {endPrefix}
            {end}
          </div>,
        );
        break;
      case "GPS":
        break;
    }

    return locations;
  }, []);
}
function processMaintenances(maintenances, props) {
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
    color: "var(--first)",
    fontSize: "12px",
    fontFamily: "Arial",
    letterSpacing: "0.3px",
  };
  let headingStyle = {
    float: "left",
    fontFamily: "Arial",
    fontSize: "18px",
    letterSpacing: "0.95px",
    color: "var(--first)",
    borderBottom: "1px solid rgb(209, 209, 209)",
    display: "block",
    width: "100%",
  };
  let maintenanceLines = maintenances.map((val, index) => {
    let i = index % colors.length;
    color = colors[i];
    textcolor = color;
    {
      let loc = getMPLocation(val.location); //val.location[0].type==='Milepost' ? val.location[0] : val.location.length>1 && val.location[1].type==='Milepost' ? val.location[1] : null;
      //if(loc !== null)
      {
        let url = "/maintenancebacklogs/" + val._id;

        let msg = (
          <div>
            <h4 style={headingStyle}>{val.mrNumber}</h4>
            <div style={textStyle}>
              <div>
                <strong>{val.lineName ? val.lineName : ""}</strong>
              </div>
              <div>
                <strong>{languageService("created at")}:</strong> {formatDate(val.createdAt)}
              </div>
              {/*<div><strong>{languageService('Location')}:</strong> {format2Digits(loc.start)} to {format2Digits(loc.end)}</div>*/}

              {locationRender(val.location, val.lineId)}
              <div style={{ maxWidth: "200px", marginBottom: "10px", textAlign: "justify" }}>{val.description}</div>

              <Link style={{ float: "right", textDecoration: "none" }} to={url}>
                <span
                  style={{
                    color: "var(--first)",
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
          text: formatDate(val.createdAt),
          color: color,
          offset: 0,
          msg: msg,
          width: 5,
          visible: true,
          _id: val.mrNumber,
        };

        for (let m of maintenances) {
          if (m.mrNumber !== val.mrNumber && !checkedMs.includes(m.mrNumber) && overlaps(loc, getMPLocation(m.location))) {
            data.offset += 5; //30
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
// function getDefaultGISCenter(linesList) // find the first line with GIS and get the center lat,long
// {
//   let defaultCenter = [0,0];
//   if(linesList && linesList.length)
//   {
//     let lineWithGIS = linesList.find(l=>{return validateAssetGeoJsonStr(l);});
//     let geoJson = getAssetGeoJson(lineWithGIS);
//     if(geoJson !== {})
//     {
//       defaultCenter = calculateCenter(geoJson);
//     }
//   }
//   return defaultCenter;
// }

export const MaintenanceGISView = (props) => {
  //let maintenances = _.cloneDeep(props.list);
  let maintenancesByLine = _.groupBy(props.list, "lineId");
  let lines = Object.keys(maintenancesByLine);
  let lineGroups = [];
  let selectedLine = {},
    selectedMaintenance = null; //, defaultCenter=[0,0]; // this needs to be calculated only once not repeatedly

  for (let baseLineId of lines) {
    let lineMaintenances = maintenancesByLine[baseLineId];
    let baseLine = props.linesList.find((l) => {
      return l._id == baseLineId;
    });
    let lineColor = "purple"; //default
    if (baseLine.systemAttributes && baseLine.systemAttributes.stroke) {
      lineColor = baseLine.systemAttributes.stroke;
    }
    let maintLines = processMaintenances(lineMaintenances, props);

    if (!selectedMaintenance) {
      selectedLine = baseLine;
      selectedMaintenance = maintLines[0] ? maintLines[0] : {};
    }

    baseLine.color = lineColor;
    baseLine.width = 1;
    lineGroups.push({ baseLine: baseLine, lines: maintLines });
  }
  // defaultCenter = getDefaultGISCenter(props.linesList);

  if (props.list && props.list.length)
    return <MapBox assets={{}} lineAsset={selectedLine} selectedAsset={selectedMaintenance} lineGroups={lineGroups} />;
  else return null;
};
