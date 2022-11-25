import React, { Fragment } from "react";
import { getAllowedSwitches } from "../../../../../AssetTypeConfig/Reports/SwitchinspectionReport";
import { getArrayToDict, getDictToArray } from "../../../utils/arrayToDict";
import { getAssetMilepost } from "../../../utils/getAssetMileport";
import { getFormSummary } from "../../../utils/getFormSummary";
import { getIssueCodeDescription } from "../../../utils/getIssueCodeDescription";
import { getIssueRemedialActionComments } from "../../../utils/getIssueRemedialActionComments";
import { getRepairedBySummary } from "../../../utils/getRepairedBySummary";
import MonthlyTurnoutInspectionForm from "./monthlyTurnoutInspectionForm";

export default class MonthlyTurnoutInspectionReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      user: {},
      date: "",
      assets: [],
    };
    this.calculateTableData = this.calculateTableData.bind(this);
  }
  componentDidMount() {
    this.props.inspec && this.calculateTableData(this.props.inspec);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.usersSignatures !== prevProps.usersSignatures) {
      this.calculateTableData(this.props.inspec);
    }
  }

  calculateTableData(inspec) {
    let { usersSignatures } = this.props;
    let location = "";
    let assets = [];
    if (inspec.tasks && inspec.tasks.length > 0) {
      let task = inspec.tasks[0];
      if (task.units && task.units.length > 0) {
        location = task.units[0].unitId;
      }
      assets = task.units
        .filter((asset) => getAllowedSwitches(asset.assetType))
        .map((asset) => {
          let assetSummary = {
            turnutName: asset.unitId,
            assetId: asset.id,
            milepost: getAssetMilepost(asset),
            summary: null,
            issues: [],
          };
          if (asset.appForms && asset.appForms.length > 0) {
            let appForm = asset.appForms.filter((form) => form).find((form) => form.id === "monthlydetailedformONR");
            if (appForm) {
              assetSummary.summary = getFormSummary(appForm);
            }
          }
          return assetSummary;
        });
      let tempAssetsKeyVal = getArrayToDict(assets, "assetId");
      task.issues &&
        task.issues.forEach((issue) => {
          if (tempAssetsKeyVal[issue.unit.id]) {
            let codeDescription = getIssueCodeDescription(issue, true);
            let issueSummary = {
              detectCodes: codeDescription.majorDefectCode + codeDescription.minorDefectCode,
              detectDescription: codeDescription.minorDescription,
              userComments: getIssueRemedialActionComments(issue),
              defectRepaired: getRepairedBySummary(issue, usersSignatures),
              selfRepair: issue.remedialAction === "Repaired",
            };

            tempAssetsKeyVal[issue.unit.id].issues.push(issueSummary);
          }
        });
      assets = getDictToArray(tempAssetsKeyVal);
      assets = assets.filter((asset) => asset.summary || asset.issues.length > 0);
      this.setState({
        location: location,
        assets: assets,
      });
    }
    this.setState({
      date: inspec.date,
      user: inspec.user,
    });
  }

  render() {
    return (
      <Fragment>
        <MonthlyTurnoutInspectionForm {...this.props} reportData={this.state} />
        {/* <div>Hello World</div> */}
      </Fragment>
    );
  }
}
