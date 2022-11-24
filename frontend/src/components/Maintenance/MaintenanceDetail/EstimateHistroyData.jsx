import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { isJSON } from "utils/isJson";
import { isDate } from "moment";
import { languageService } from "../../../Language/language.service";
import { retroColors, basicColors } from "../../../style/basic/basicColors";
import { themeService } from "../../../theme/service/activeTheme.service";

const EstimateHistoryData = props => {
  const { estimateData } = props;
  let columns = estimateData && estimateData.oldData && estimateData.newData ? 2 : 1;
  const IS_CHANGED = estimateData && estimateData.action == "Changed";
  const IS_ADDED = estimateData && estimateData.action == "Added";
  const IS_DELETED = estimateData && estimateData.action == "Deleted";

  let ndt = `${languageService("New")} ${languageService("Data")}`;

  return (
    <React.Fragment>
      <Row>
        <Col md={9}>
          <div style={{ ...themeService(fontAndColor), marginBottom: "10px", fontWeight: 600 }}>
            {estimateData && estimateData.item ? estimateData.item : ""}
          </div>
        </Col>
        <Col md={3}>
          <div style={{ ...themeService(fontAndColor), marginBottom: "10px", fontWeight: 600 }}>
            {estimateData && estimateData.action
              ? languageService(estimateData.action) +
                ": " +
                (estimateData.userName ? estimateData.userName : "") +
                " (" +
                estimateData.user +
                ") "
              : languageService("No Data Available or Selected")}
          </div>
        </Col>
      </Row>
      {estimateData && (
        <Row>
          <Col md={12 / columns}>
            <span style={{ ...themeService(fontAndColor), fontSize: "14px" }}>
              {IS_ADDED ? ndt : IS_CHANGED ? languageService("Previous Data") : languageService("Deleted Data")}
            </span>
            {/* {!IS_CHANGED && <span style={{ ...themeService(fontAndColor), fontSize: "14px", float: "right" }}>{estimateData.action}</span>} */}
            <EstimateDataBox data={IS_CHANGED || IS_DELETED ? estimateData.oldData : estimateData.newData} />
          </Col>
          {IS_CHANGED && (
            <Col md={12 / columns}>
              <span style={{ ...themeService(fontAndColor), fontSize: "14px" }}> {languageService("Updated Data")}</span>
              {/* {columns == 2 && <span style={{ ...themeService(fontAndColor), fontSize: "14px", float: "right" }}>{estimateData.action}</span>} */}
              <EstimateDataBox data={estimateData.newData} />
            </Col>
          )}
        </Row>
      )}
    </React.Fragment>
  );
};
export default EstimateHistoryData;

const EstimateDataBox = props => {
  let fieldsData = null;

  if (props.data) {
    let fieldKeys = Object.keys(props.data);
    fieldsData = fieldKeys.map(field => {
      return <EstimateField fieldValue={props.data[field]} fieldName={field} key={field} />;
    });
  }
  return (
    <div
      style={{
        background: "#efefef",
        boxShadow: " rgb(207, 207, 207) 3px 3px 5px",
        border: "1px solid #d8d8d8",
        //    height: "67vh",
      }}
    >
      {fieldsData}
    </div>
  );
};

const EstimateField = props => {
  return (
    <Row style={{ padding: "10px 20px" }}>
      <Col
        style={{
          ...themeService(fontAndColor),
          ...themeService(fieldStyle),
          ...themeService(borderStyleLabel),
        }}
        md="3"
      >
        {keyNames[props.fieldName] ? languageService(keyNames[props.fieldName]) : ""}
      </Col>
      <Col
        style={{
          ...themeService(fontAndColor),
          ...themeService(fieldStyle),
          ...themeService(borderStyleField),
        }}
        md="9"
      >
        {props.fieldValue}
      </Col>
    </Row>
  );
};

const keyNames = {
  id: "ID",
  count: "How Many",
  resource: "Resource",
  day: "Start Day",
  time: "Start Time",
  location: "Start Location",
  endDay: "End Day",
  endTime: "End Time",
  endLocation: "End Location",
  task: "Task",
  assetId: "Asset Id ",
};

const fontAndColor = {
  default: {
    color: basicColors.first,
    fontSize: "12px",
  },
  retro: {
    color: retroColors.second,
    fontSize: "12px",
  },
};

const fieldStyle = {
  default: {
    background: basicColors.fourth,
    border: "1px solid #e3e9ef",
    padding: "3px 5px",
    boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 1px inset",
  },
  retro: {
    background: retroColors.fifth,
    border: "1px solid " + retroColors.fourth,
    padding: "3px 5px",
  },
};

const borderStyleField = {
  default: {
    borderRadius: "0px 5px 5px 0px",
    borderLeft: "0px",
  },
  retro: { borderLeft: "0px" },
};

const borderStyleLabel = {
  default: {
    borderRadius: "0px 5px 5px 0px",
  },
  retro: {},
};
