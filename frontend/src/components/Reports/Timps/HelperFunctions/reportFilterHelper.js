import _ from "lodash";
export const filterInspecDefectCode = (inspec, dCode) => {
  let found =
    inspec &&
    inspec.issues &&
    _.find(inspec.issues, (issue) => {
      let foundDc =
        issue &&
        _.find(issue.defectCodes, (dc) => {
          return dc == dCode;
        });
      return foundDc;
    });
  return found ? true : false;
};

export const filterInspecAssetType = (inspec, assetType) => {
  let found =
    inspec &&
    inspec.issues &&
    _.find(inspec.issues, (issue) => {
      return issue && issue.unit && issue.unit.assetType == assetType;
    });
  return found ? true : false;
};

export const filterInspeDefectType = (inspec, defectStatus) => {
  // to check if selected defectType is = All , Open , Closed
  let found =
    inspec &&
    inspec.issues &&
    _.find(inspec.issues, (issue) => {
      return defectStatus === "Open" ? issue.status !== "Resolved" : issue.status == "Resolved";
    });
  return found ? true : false;
};
