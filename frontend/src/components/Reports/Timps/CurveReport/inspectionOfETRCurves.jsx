import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { ic_done } from "react-icons-kit/md/ic_done";
import { Icon } from "react-icons-kit";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../variables";
import { trackReportStyle } from "../style/index";
import "../style/style.css";
import _ from "lodash";

class InspectionOfETRCurves extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.config = {
      minIssueRows: 8,
    };
    this.Colspan = [3, 1, 1, 2, 3, 2, 2, 3, 1, 6];
  }

  render() {
    let assetDataRender = [];
    assetDataRender =
      this.props.assetsData &&
      this.props.assetsData.map((aData) => {
        let data = {};
        aData.form.forEach((field) => {
          if (field && field.id) data[field.id] = field.value;
        });

        return (
          <tr>
            <td colSpan={this.Colspan[0]}>{this.props.basicData && this.props.basicData.lineName}</td>
            <td colSpan={this.Colspan[1]}>{aData.assetMP}</td>
            <td colSpan={this.Colspan[2]}>{aData.assetMP}</td>
            <td colSpan={this.Colspan[3]}>{this.props.basicData && this.props.basicData.date}</td>
            <td colSpan={this.Colspan[4]}>{data["tx-over"]}</td>

            <td colSpan={this.Colspan[5]}>{data["tx-side"]}</td>

            <td colSpan={this.Colspan[6]}>{data["tx-plate"]}</td>
            <td colSpan={this.Colspan[7]}>{data["tx-cgrease"] == "true" ? <Icon size={20} icon={ic_done} /> : ""}</td>
            <td colSpan={this.Colspan[8]}>{data["tx-gage"]}</td>
            <td colSpan={this.Colspan[9]}>{data["tx-rem"]}</td>
          </tr>
        );
      });

    return (
      <React.Fragment>
        <div className="table-report txn" style={{ ...themeService(trackReportStyle.mainStyle) }}>
          <Row>
            <Col md={2}>
              <img src={themeService(iconToShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} />
            </Col>
            <Col md={8}>
              <h5 style={{ ...themeService(trackReportStyle.headingStyle), transform: "none" }}>INSPECTION OF CURVES</h5>
            </Col>
            <Col md={2}></Col>
          </Row>
          <span className="spacer"></span>
          <Row>
            <Col md={12}>
              <table>
                <thead>
                  <tr>
                    <th colSpan="3" rowSpan="3">
                      LOCATION
                    </th>
                    <th colSpan="1" rowSpan="3">
                      BEG MP
                    </th>
                    <th colSpan="1" rowSpan="3">
                      END MP
                    </th>
                    <th colSpan="2" rowSpan="3">
                      DATE
                    </th>
                    <th colSpan="11" rowSpan="1">
                      INDICATE CONDITIONS FOUND AT TIME OF INSPECTION
                    </th>
                    <th colSpan="6" rowSpan="3">
                      REMARKS
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="3" rowSpan="2">
                      OVERALL TIE CONDITION
                    </th>

                    <th colSpan="2" rowSpan="2">
                      GAGE SIDE CURVE WEAR
                    </th>
                    <th colSpan="2" rowSpan="2">
                      DIFFERENTIAL PLATE CUTTING
                    </th>
                    <th colSpan="3" rowSpan="2">
                      CURVED GREASED
                    </th>
                    <th colSpan="1" rowSpan="2">
                      GAGE
                    </th>
                  </tr>
                </thead>

                <tbody key={"issueBody"}>
                  {assetDataRender}
                  {addEmptyColsIfNotEnough(assetDataRender, this.config.minIssueRows, 10)}
                </tbody>
              </table>
              <span className="spacer"></span>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default InspectionOfETRCurves;

function addEmptyColsIfNotEnough(mapArray, minRows, cols, type) {
  let emptyRows = null;
  let countToAdd = mapArray ? minRows - mapArray.length : minRows;
  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr key={i}>{getCols(cols, type)}</tr>;
      emptyRows.push(row);
    }
  }
  return emptyRows;
}
function getCols(num, type) {
  let cols = [];
  let span = [];
  if (type === "two") span = [3, 18, 7];
  else span = [3, 1, 1, 2, 3, 2, 2, 3, 1, 6];
  for (let i = 0; i < num; i++) {
    cols.push(<td key={i} colSpan={span[i]}></td>);
  }
  return cols;
}
