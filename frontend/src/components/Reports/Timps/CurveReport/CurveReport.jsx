import React, { Component } from "react";
import InspectionOfCurves from "./inspectionOfCurves";
import InspectionOfETRCurves from "./inspectionOfETRCurves";
import FooterView from "./footerView";
import _ from "lodash";
import moment from "moment";
import { Row, Col } from "reactstrap";
import { checkYardTrackMethod, checkIfParentTrack } from "../../../../AssetTypeConfig/Reports/CurveReportConfig";
import { LocPrefixService } from "../../../LocationPrefixEditor/LocationPrefixService";
class CurveReport extends Component {
  constructor(props) {
    super(props);
    this.state = { basicData: {}, assetsData: [] };
  }

  componentDidMount() {
    this.calculateTableData(this.props.inspec);
  }
  calculateTableData(inspection) {
    if (inspection !== "undefined") {
      let basicData = {};
      let assetsData = [];
      let etrCurve = false;
      let task = inspection && inspection.tasks && inspection.tasks[0];
      basicData.lineId = inspection && inspection.lineId && inspection.lineId;
      basicData.date =
        inspection && typeof inspection.date != "undefined" && inspection.date != "null" && inspection.date
          ? moment(inspection.date).format("MM/DD/YYYY")
          : "";
      basicData.userName = inspection ? inspection.user.name : "";
      if (task && task.units) {
        basicData.lineName = task.units[0] ? task.units[0].unitId : "";
        task.units.forEach((asset) => {
          if (asset.assetType == "Curve") {
            let curveForm = _.find(asset.appForms, (form) => form && (form.id === "curveTestForm" || form.id === "curveTestFormETR"));
            if (curveForm) {
              curveForm.id === "curveTestFormETR" && (etrCurve = true);
              let parent = _.find(task.units, { id: asset.parent_id });
              let prefix = LocPrefixService.getPrefixMp(asset.start, inspection.lineId);
              let assetData = {
                assetName: asset.unitId,
                assetMP: (prefix ? prefix : "") + asset.start,
                assetId: asset.id,
                form: curveForm.form,
                mainLineName: parent && checkIfParentTrack(parent.assetType) ? parent.unitId : "",
                yardTrackName: parent && checkYardTrackMethod(parent.assetType) ? parent.unitId : "",
              };
              assetsData.push(assetData);
            }
          }
        });
      }

      this.setState({
        basicData: basicData,
        assetsData: assetsData,
        etrCurve: etrCurve,
        user: inspection && inspection.user && inspection.user.name,
      });
    }
  }
  render() {
    return (
      <div
        style={{
          pageBreakAfter: "always",
        }}
      >
        {this.state.etrCurve ? (
          <React.Fragment>
            <InspectionOfETRCurves basicData={this.state.basicData} assetsData={this.state.assetsData} />
            <FooterView reportType={"ETR"} signatureImage={this.props.signatureImage} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <InspectionOfCurves basicData={this.state.basicData} assetsData={this.state.assetsData} />
            <FooterView signatureImage={this.props.signatureImage} />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default CurveReport;
