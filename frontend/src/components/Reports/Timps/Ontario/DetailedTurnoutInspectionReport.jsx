import React, { Component } from "react";
import _ from "lodash";
import DetailedTurnoutInspectionForm from "./DetailedTurnoutInspectionForm";
import moment from "moment";
import { switchTurnoutsIncluded, switchFormCodeAllowed } from "../../../../AssetTypeConfig/Reports/ONRDetailedTurnoutInspectionReport";
import { LocPrefixService } from "../../../LocationPrefixEditor/LocationPrefixService";
export default class DetailedTurnoutInspectionReport extends Component {
  constructor(props) {
    super(props);
    this.state = { basicData: {}, assetsData: [] };
  }

  componentDidMount() {
    this.calculateTableData(this.props.inspec);
  }
  calculateTableData(inspection) {
    let basicData = {};
    let assetsData = [];
    let task = inspection && inspection.tasks && inspection.tasks[0];
    basicData.lineId = inspection.lineId;
    basicData.date =
      inspection && typeof inspection.date != "undefined" && inspection.date != "null" && inspection.date
        ? moment(inspection.date).format("MM/DD/YYYY")
        : "";
    basicData.userEmail = inspection ? inspection.user.email : "";
    basicData.userName = inspection ? inspection.user.name : "";

    if (task && task.units) {
      basicData.lineName = task.units[0] ? task.units[0].unitId : "";
      task.units.forEach((asset) => {
        if (_.find(switchTurnoutsIncluded, (item) => item == asset.assetType)) {
          let onrSwitchForm = _.find(asset.appForms, (form) => form && switchFormCodeAllowed(form.id));
          let assetIssues = _.filter(task.issues, (issue) => issue.unit.unitId === asset.unitId);
          let locName = task.units[0].unitId;
          let prefix = LocPrefixService.getPrefixMp(asset.start, inspection.lineId);
          if (onrSwitchForm || assetIssues.length > 0) {
            let assetData = {
              assetType: asset.assetType,
              assetName: asset.unitId,
              assetMP: (prefix ? prefix : "") + asset.start,
              assetId: asset.id,
              issues: assetIssues,
              location: locName,
              form: onrSwitchForm ? onrSwitchForm.form : null,
            };
            assetsData.push(assetData);
          }
        }
      });
    }
    this.setState({
      basicData: basicData,
      assetsData: assetsData,
      user: inspection.user && inspection.user.name,
    });
  }

  render() {
    let detailedTurnoutView = null;
    let atleastOne = this.state.assetsData.length > 0;
    if (!atleastOne) detailedTurnoutView = <DetailedTurnoutInspectionForm />;
    else {
      detailedTurnoutView = this.state.assetsData.map((assetData) => {

        return (
          <DetailedTurnoutInspectionForm
            key={assetData.assetId}
            basicData={this.state.basicData}
            assetData={assetData}
            signatureImage={this.props.signatureImage}
          />
        );
      });
    }
    return <React.Fragment> {detailedTurnoutView}</React.Fragment>;
  }
}
