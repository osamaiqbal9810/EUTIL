export const getIssueCodeDescription = (issue, nonFraCode) => {
    let codeDescription = {
        majorDefectCode: "",
        minorDefectCode: "",
        majorDescription: "",
        minorDescription: "",
    };
    if (!nonFraCode) {
        let titleIndex = issue.title.indexOf("-");
        if (titleIndex !== -1) {
            codeDescription.majorDefectCode = issue.title.slice(0, titleIndex).split(".")[0] + ".";
            codeDescription.majorDescription = issue.title.slice(titleIndex, issue.title.length);
        } else {
            codeDescription.majorDescription = issue.title;
        }
    }
    let tDescIndex = issue.description.indexOf("-");
    if (tDescIndex !== -1) {
        codeDescription.minorDefectCode = issue.description.slice(0, tDescIndex);
        codeDescription.minorDescription = issue.description.slice(tDescIndex + 1, issue.description.length);
    } else {
        codeDescription.minorDescription = issue.description;
    }
    return codeDescription;
}