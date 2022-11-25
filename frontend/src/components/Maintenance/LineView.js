import React, { Component } from "react";
import _ from "lodash";
import CustomFilters from "components/Common/Filters/CustomFilters";
import LinearDisplay from "components/Common/LinearDisplay/LinearDisplay";
import moment from "moment";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import { themeService } from "../../theme/service/activeTheme.service";
import LinearDisplayWithTitles from "components/Common/LinearDisplay/LinearDisplayWithTitles";
function getMPLocation(Locs) {
  let l =
    !Locs || Locs.length == 0
      ? { start: 0, end: 0 }
      : Locs[0].type === "Milepost"
        ? Locs[0]
        : Locs.length > 1 && Locs[1].type === "Milepost"
          ? Locs[1]
          : { start: 0, end: 0 }; //null;
  if (l.start > l.end) l = { start: l.end, end: l.start };
  //if(l.end - l.start < 0.1)  l.end = l.start + 0.01; // add minimum length, but first fix the display because display should be actual value
  return l;
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
function getLineGroupDisplay(maintenances, range, props, heading) {
  let { start, end } = range;
  let logicalWorld = { min: start, max: end + 1 },
    lwidth = logicalWorld.max - logicalWorld.min,
    factor = 50,
    width = lwidth * factor < 2000 ? 2000 : lwidth * factor,
    height = 20,
    titleWidth = 150,
    textcolor = "black",
    color = "black",
    scaleData = [],
    padding = { left: 0, right: 1, top: 0, bottom: 0 };
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

  //scale
  let inc = 0.1;
  for (let i = start; i <= end;) {
    let n = { start: i, end: precisionRound(i + inc, 2), text: " " + Math.floor(i) };
    scaleData.push(n);
    i = precisionRound(i + inc, 2);
  }
  //let maintenances = _.cloneDeep(props.list);

  // // if(props.sort==='Location')
  // // {
  // //   maintenances = _.sortBy(maintenances, [(o)=>{ return getMPLocation(o.location).start;}]);
  // // }

  let maintenanceLines = maintenances.map((val, index) => {
    let i = index % colors.length;
    color = colors[i];
    textcolor = color;
    //if(val.location && val.location.length>0)
    {
      let data = [];
      let loc = getMPLocation(val.location); //val.location[0].type==='Milepost' ? val.location[0] : val.location.length>1 && val.location[1].type==='Milepost' ? val.location[1] : null;
      //if(loc !== null)
      {
        data.push({ start: +loc.start, end: +loc.end, text: formatDate(val.createdAt), fill: true, id: val._id, tooltip: val.description }); //val.mrNumber});
        let pad1 = Object.assign({}, padding);
        return (
          <LinearDisplay
            title={val.mrNumber}
            logicalWorld={logicalWorld}
            width={width}
            height={height}
            titleWidth={titleWidth}
            textcolor={textcolor}
            color={color}
            data={data}
            padding={pad1}
            background={"white"}
            gridLines
            key={val.mrNumber}
            onClick={props.onClick}
            allowTitleClick={props.allowTitleClick}
          />
        );
      }
    }

    return null;
  });

  return (
    <div key={"linediv:" + start + "," + end}>
      <div style={{ padding: "30px 0px 30px 10px" }}>
        <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}> {heading} </h4>
      </div>
      <CustomFilters
        key={"filter:" + start + "," + end}
        handleClick={props.handleClick}
        filters={[{ text: "Location", state: props.sort === "Location" }]}
        exclusive
        displayText={"Sort:"}
      />
      <div
        style={{
          backgroundColor: "white",
          position: "relative",
          padding: "50px",
          paddingRight: "100px",
          width: "100%",
          scroll: "auto",
          overflow: "auto",
        }}
      >
        <LinearDisplay
          key={"scale:" + start + "," + end}
          title={" "}
          logicalWorld={logicalWorld}
          width={width}
          height={height}
          titleWidth={titleWidth}
          textcolor={textcolor}
          color={color}
          displayType="scale"
          data={scaleData}
          padding={padding}
        />
        {maintenanceLines}
      </div>

    </div>
  );
}
// ============================

function getMWOWiseDisplay(lineMaintenances, range, props, heading) {
  let { start, end } = range;
  let intStart = Math.floor(start), intEnd = Math.ceil(end);

  let logicalWorld = { min: intStart, max: intEnd },
    lwidth = logicalWorld.max - logicalWorld.min,
    factor = 50,
    width = lwidth * factor < 2000 ? 2000 : lwidth * factor,
    height = 20,
    textcolor = "black",
    color = "black",
    scaleData = [];

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
  //scale
  let inc = 0.1;

  for (let i = intStart; i <= intEnd;) {
    let n = { start: i, end: precisionRound(i + inc, 2), text: " " + Math.floor(i) };
    scaleData.push(n);
    i = precisionRound(i + inc, 2);
  }

  let itemCount = 0;

  let mwoMs = _.groupBy(lineMaintenances, "workOrderNumber");
  let mwoDisplay = Object.keys(mwoMs).map((mwo, mindex) => {
    let heading = "";
    if (mwo === "undefined") heading = "Unplanned";
    else heading = mwo;

    let mrs = mwoMs[mwo];
    let mtypes = _.groupBy(mrs, "maintenanceType");
    //console.log(heading, mtypes);
    let mtypeKeys = Object.keys(mtypes);
    let atDisplayData = mtypeKeys.map((at, index) => {
      let i = itemCount++ % colors.length,
        mwoTitleStyle = index === 0 ? "ULRT" : "LR"; // for first item display border(up, left, right) and text
      color = colors[i];
      textcolor = color;

      if (index + 1 == mtypeKeys.length)
        // display down border for last item
        mwoTitleStyle += "D";

      let data = mtypes[at].map((m) => {
        let loc = getMPLocation(m.location);

        let tooltip = (
          <div>
            <p>{m.maintenanceType} </p>
            <p>{m.description}</p> <div> Created: {moment(m.createdAt).format("MM/DD/YYYY")}</div>
            {m.dueDate && <div> Due Date: {moment(m.dueDate).format("MM/DD/YYYY")}</div>}
            {m.executionDate && <div> Execution Date: {moment(m.executionDate).format("MM/DD/YYYY")}</div>}
            {m.closedDate && <div> Closed Date: {moment(m.closedDate).format("MM/DD/YYYY")}</div>}
          </div>
        );

        return { start: +loc.start, end: +loc.end, text: m.mrNumber, fill: false, id: m._id, tooltip: tooltip };
      });
      return (
        <LinearDisplayWithTitles
          titles={[
            { titleWidth: 100, titleText: heading, titleStyle: mwoTitleStyle },
            { titleWidth: 150, titleText: at },
          ]}
          logicalWorld={logicalWorld}
          width={width}
          height={height}
          textcolor={textcolor}
          color={color}
          data={data}
          padding={{ left: 0.7, right: 1, top: 0, bottom: 0 }}
          background={"white"}
          gridLines
          key={at}
          onClick={props.onClick}
          allowTitleClick={props.allowTitleClick}
          minWidth={0.1}
        />
      );
    });
    //atDisplayData.push((<div>{heading}</div>));
    return atDisplayData;
  });
  return (
    <div
      style={{
        backgroundColor: "white",
        position: "relative",
        padding: "50px",
        paddingRight: "100px",
        width: "100%",
        scroll: "auto",
        overflow: "auto",
        marginBottom: "15px"
      }}
      key={"div:" + start + "," + end}
    >
      <div style={{ padding: "30px 0px 30px 10px" }}>
        <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}> {heading} </h4>
      </div>
      <LinearDisplayWithTitles
        key={"scale:" + start + "," + end}
        titles={[
          { titleWidth: 100, titleText: " " },
          { titleWidth: 150, titleText: " " },
        ]}
        logicalWorld={logicalWorld}
        width={width}
        height={height}
        textcolor={textcolor}
        color={color}
        displayType="scale"
        data={scaleData}
        padding={{ left: 0.7, right: 1, top: 0, bottom: 0 }}
      />
      {mwoDisplay}
    </div>
  );
}

// ============================
export const LineView = (props) => {
  let maintenancesByLine = _.groupBy(props.list, "lineId");
  let lines = Object.keys(maintenancesByLine);
  // debugger;
  let lineGroups = [];
  for (let baseLineId of lines) {
    let lineMaintenances = maintenancesByLine[baseLineId];
    // debugger;
    let baseLine = props.linesList.find((l) => {
      return l._id == baseLineId;
    });
    //let maintLines = getLineGroupDisplay(lineMaintenances, { start: baseLine.start, end: baseLine.end }, props, baseLine.unitId);
    //lineGroups.push(maintLines);
    if (baseLine) {
      let mwoDisplay = getMWOWiseDisplay(lineMaintenances, { start: baseLine.start, end: baseLine.end }, props, baseLine.unitId);
      lineGroups.push(mwoDisplay);
    }
  }

  return lineGroups;
};
