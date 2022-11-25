import React, { Fragment } from "react";
import { dataFormatters } from "../../../utils/dataFormatters";
import { LocPrefixService } from "../../LocationPrefixEditor/LocationPrefixService";
import { getArrayToDict, getDictToArray } from "./arrayToDict";
import { getAssetMilepost } from "./getAssetMileport";
import { getFormSummary } from "./getFormSummary";
import { getIssueCodeDescription } from "./getIssueCodeDescription";
import { getIssueRemedialActionComments } from "./getIssueRemedialActionComments";
import { getRepairedBySummary } from "./getRepairedBySummary";
import { SignatureImage } from "./SignatureImage";

export const ReportGeneratorUtils = {
  getInspectionAssetsWithForm: (
    inspec,
    assetFilterFunction = (assetType) => false,
    formId,
    allowMissedForms,
    includeIssues,
    usersSignatures,
  ) => {
    let assets = [];
    if (inspec.tasks && inspec.tasks.length > 0) {
      let task = inspec.tasks[0];
      if (task.units && task.units.length > 0) {
        assets = task.units
          .filter((asset) => assetFilterFunction(asset.assetType))
          .map((asset) => {
            let assetSummary = {
              switchName: asset.unitId,
              assetId: asset.id,
              milepost: getAssetMilepost(asset),
              summary: null,
              mpPrefix: LocPrefixService.getPrefixMp(asset.start, inspec.lineId),
              issues: [],
            };
            if (asset.appForms && asset.appForms.length > 0) {
              let appForm = asset.appForms.filter((form) => form).find((form) => form.id === formId);
              if (appForm) {
                assetSummary.summary = getFormSummary(appForm);
              }
            }
            return assetSummary;
          });

        if (includeIssues) {
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
                  description: issue.description,
                  remedialAction: issue.remedialAction,
                };
                issueSummary.defects_comments = `${issueSummary.detectCodes} ${
                  issueSummary.detectDescription ? "-" + issueSummary.detectDescription : ""
                }  ${issueSummary.userComments ? "/ " + issueSummary.userComments : ""}`;
                tempAssetsKeyVal[issue.unit.id].issues.push(issueSummary);
                issueSummary.repairedByAndDate = (
                  <Fragment>
                    {issueSummary.selfRepair ? (
                      <div>{inspec.user.name} </div>
                    ) : issueSummary.defectRepaired.name ? (
                      <div> {issueSummary.defectRepaired.name}</div>
                    ) : null}
                    {issueSummary.selfRepair ? (
                      <div>{dataFormatters.dateFormatter(inspec.date)}</div>
                    ) : issueSummary.defectRepaired.date ? (
                      <div> {issueSummary.defectRepaired.date} </div>
                    ) : null}
                  </Fragment>
                );

                issueSummary.repairedBySignature = (
                  <Fragment>
                    <SignatureImage
                      placement={"tableCell"}
                      signatureImage={
                        issueSummary.selfRepair
                          ? inspec.user && inspec.user.signature && inspec.user.signature.imgName
                          : issueSummary.defectRepaired.signature
                      }
                    />
                  </Fragment>
                );
              }
            });
          assets = getDictToArray(tempAssetsKeyVal);
        }
        // keep switches/assets where the form is not filled
        !allowMissedForms && (assets = assets.filter((asset) => asset.summary || (asset.issues && asset.issues.length > 0)));
      }
    }
    return assets;
  },
  getInspectionJobBriefings: (inspec) => {
    let toRet = {};
    let workers = [];
    inspec.jobBriefings = inspec.jobBriefings
      .filter((briefing) => briefing)
      .map((briefing) => {
        let formId = null;
        briefing &&
          briefing.jobBriefingForms &&
          Array.isArray(briefing.jobBriefingForms) &&
          (briefing.jobBriefingForms = briefing.jobBriefingForms
            .filter((form) => form && form.id)
            .map((form) => {
              // take the id of first form and search for all forms with same types
              if (formId === null) {
                formId = form.id;
              }
              return form.id === form.id ? form : null;
            })
            .filter((form) => form && form.id));
        briefing.formId = formId;
        briefing.workers && briefing.workers.length > 0 && (workers = [...workers, ...briefing.workers]);
        return briefing;
      })
      .filter((briefing) => briefing.formId);
    toRet.briefings = inspec.jobBriefings ? inspec.jobBriefings : null;
    toRet.workers = workers;
    return toRet;
  },
  getInspectionLocation: (inspec) => {
    let location = "";
    if (inspec.tasks && inspec.tasks.length > 0) {
      let task = inspec.tasks[0];
      if (task.units && task.units.length > 0) {
        location = task.units[0].unitId;
      }
    }
    return location;
  },
  getInspectionDate: (inspec) => {
    return inspec.date;
  },
  getInspectionUser: (inspec) => {
    return inspec.user;
  },
  getInspectionLineName: (inspec) => {
    return inspec.lineName;
  },
  getInspectionWeather: (inspec) => {
    if (inspec.tasks && inspec.tasks.length > 0) {
      let task = inspec.tasks[0];
      let tempUnit = task.tempUnit ? task.tempUnit : "";
      let temp = task.temperature || task.temperature == 0 ? task.temperature + " " + tempUnit : "";
      let weatherVal = task.weatherConditions ? task.weatherConditions : "";
      return temp ? temp + (weatherVal ? ", " + weatherVal : "") : weatherVal ? weatherVal : "";
    }
  },
};
