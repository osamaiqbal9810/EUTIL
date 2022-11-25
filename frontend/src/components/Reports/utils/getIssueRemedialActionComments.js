export const getIssueRemedialActionComments = (issue) => {
    let com = "";
    com = issue.remedialAction && issue.remedialActionItems.length > 0 ? issue.remedialActionItems[0].value : "";
    let slowOrderRestrict =
        issue.remedialActionItems &&
        issue.remedialActionItems.length > 0 &&
        issue.remedialActionItems.find((item) => item.id === "slowOrderSpeedRestict");

    if (issue.remedialAction === "Slow Order Applied" && slowOrderRestrict) {
        let slowOrderComment =
            issue.remedialActionItems && issue.remedialActionItems.length > 0 && issue.remedialActionItems.find((item) => item.id === "describe");
        com += " Reduced to " + slowOrderRestrict.value;
        com += slowOrderComment && slowOrderComment.value ? " - " + slowOrderComment.value : "";
    }
    return com;
}