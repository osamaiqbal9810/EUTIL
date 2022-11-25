import React, { Component } from "react";
import _ from "lodash";
import MonthlyBridgeInspectionView from "./monthlyBridgeInspectionView";
import moment from "moment";
import { LocPrefixService } from "../../../LocationPrefixEditor/LocationPrefixService";
export default class MonthlyBridgeInspection extends Component {
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
        if (asset.assetType == "Bridge" || asset.assetType == "Culvert") {
          let bridgeAppForm = _.find(asset.appForms, { id: "etrBridgeForm" });
          if (bridgeAppForm) {
            let prefix = LocPrefixService.getPrefixMp(asset.start, basicData.lineId);
            let assetData = {
              assetName: asset.unitId,
              assetMP: (prefix ? prefix : "") + asset.start,
              assetId: asset.id,
              form: bridgeAppForm.form,
            };
            assetsData.push(assetData);
          }
        }
      });
    }
    this.setState({
      basicData: basicData,
      assetsData: assetsData,
    });
  }

  render() {
    let monthlyBridgeInspectionView = null;
    let atleastOne = this.state.assetsData.length > 0;
    if (!atleastOne) monthlyBridgeInspectionView = <MonthlyBridgeInspectionView />;
    else {
      monthlyBridgeInspectionView = this.state.assetsData.map((assetData) => {
        return (
          <MonthlyBridgeInspectionView basicData={this.state.basicData} assetData={assetData} signatureImage={this.props.signatureImage} />
        );
      });
    }
    return <React.Fragment> {monthlyBridgeInspectionView}</React.Fragment>;
  }
}
