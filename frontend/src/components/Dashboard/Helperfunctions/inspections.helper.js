/* eslint eqeqeq: 0 */
import _ from "lodash";
import moment from "moment";
import { fieldTemplate } from "./summaryTemplates";
export function adjustTodayInspectionsFromData(data) {
  let linesData, todaysData, todaysDatafromHistory;
  linesData = data.lineLists;
  todaysData = data.todayLineList;
  todaysDatafromHistory = _.cloneDeep(linesData);

  filterTodaysDatafromHistory(linesData, todaysData);
  return data;
}

function filterTodaysDatafromHistory(allData, todaysData) {
  todaysData ? todaysData : {};
  let todayRange, lineKeys;
  todayRange = {
    from: moment()
      .utc()
      .startOf("day"),
    to: moment()
      .utc()
      .endOf("day"),
  };

  lineKeys = Object.keys(allData);
  lineKeys.forEach(line => {
    if (todaysData[line] && todaysData[line].inspections && todaysData[line].inspections.length > 0) {
      let startTodayInspectionIndex = -1; // not in use
      let startTodayIssueIndex = -1; // not in use
      let todaysIssues = [];
      const INS_SUMMARY_TEMPLATE = fieldTemplate("inspections");
      let inspectionTemplateKeys = Object.keys(INS_SUMMARY_TEMPLATE);
      const ISSUE_SUMMARY_TEMPLATE = fieldTemplate("issues");
      let issueTemplateKeys = Object.keys(ISSUE_SUMMARY_TEMPLATE);
      allData[line].inspections.details.forEach((history_plan, planIndex) => {
        adjustHistoryPlanAndMainSummary(
          allData,
          line,
          history_plan,
          todayRange,
          startTodayInspectionIndex,
          planIndex,
          INS_SUMMARY_TEMPLATE,
          inspectionTemplateKeys,
        );
      });

      // Now Calculate From Today's data

      todaysData[line].inspections.forEach(inspection => {
        adjustSummaryWithTodayData(inspection, allData, line, INS_SUMMARY_TEMPLATE, inspectionTemplateKeys);
        let plan_issues = calculateIssuesInPlan(inspection, allData, line, startTodayIssueIndex, ISSUE_SUMMARY_TEMPLATE, issueTemplateKeys);
        if (plan_issues.length > 0) todaysIssues = [...todaysIssues, ...plan_issues];
        removeExistingIssues(inspection, allData, line, ISSUE_SUMMARY_TEMPLATE, issueTemplateKeys);
      });
      allData[line].issues.details = [...allData[line].issues.details, ...todaysIssues];
      allData[line].inspections.details = [...allData[line].inspections.details, ...todaysData[line].inspections];
      allData[line].issues.summary.total = allData[line].issues.details.length;
      allData[line].inspections.summary.total = allData[line].inspections.details.length;
      console.log("STOP");
    }
  });
}

function adjustHistoryPlanAndMainSummary(
  allData,
  line,
  history_plan,
  todayRange,
  starttodayIndex,
  planIndex,
  INS_SUMMARY_TEMPLATE,
  inspectionTemplateKeys,
) {
  const PLAN_DATE = new Date(history_plan.date);
  const FROMTODAY = new Date(todayRange.from);
  const ENDTODAY = new Date(todayRange.to);
  if (starttodayIndex < 0 && PLAN_DATE > FROMTODAY) {
    starttodayIndex = planIndex;
  }
  if (PLAN_DATE > FROMTODAY && PLAN_DATE < ENDTODAY) {
    let summ = getSumKeyName(history_plan, "status", INS_SUMMARY_TEMPLATE, inspectionTemplateKeys);
    if (summ) {
      allData[line].inspections.summary[summ]--;
    }
    _.remove(allData[line].inspections.details, { _id: history_plan._id });
  }
  return starttodayIndex;
}

function calculateIssuesInPlan(inspection, allData, line, startTodayIssueIndex, ISSUE_SUMMARY_TEMPLATE, issueTemplateKeys) {
  let issuesInPlan = [];
  if (inspection.tasks && inspection.tasks.length > 0) {
    let tasks = inspection.tasks;
    tasks.forEach(task => {
      if (task.issues && task.issues.length > 0) {
        let taskIssues = task.issues;
        taskIssues.forEach(issue => {
          let summ = getSumKeyName(issue, "priority", ISSUE_SUMMARY_TEMPLATE, issueTemplateKeys);
          if (summ) {
            allData[line].issues.summary[summ]++;
          }
          let issueObj = {
            planId: inspection._id,
            priority: issue.priority,
            user: inspection.user,
            trackId: issue.trackId,
            timeStamp: issue.timeStamp,
          };
          issuesInPlan.push(issueObj);
        });
      }
    });
  }
  return issuesInPlan;
}

function removeExistingIssues(inspection, allData, line, ISSUE_SUMMARY_TEMPLATE, issueTemplateKeys) {
  _.remove(allData[line].issues.details, issue => {
    let check = issue.planId == inspection._id ? true : false;
    if (check) {
      let summ = getSumKeyName(issue, "priority", ISSUE_SUMMARY_TEMPLATE, issueTemplateKeys);

      if (summ) {
        allData[line].issues.summary[summ]--;
      }
    }
    return check;
  });
}

function adjustSummaryWithTodayData(inspection, allData, line, INS_SUMMARY_TEMPLATE, inspectionTemplateKeys) {
  let summ = getSumKeyName(inspection, "status", INS_SUMMARY_TEMPLATE, inspectionTemplateKeys);
  if (summ) {
    allData[line].inspections.summary[summ]++;
  }
}

function getSumKeyName(item, property, template, templateKeys) {
  let summ = null;
  templateKeys.forEach(key => {
    if (template[key].label == item[property] || template[key].secondVal == item[property]) {
      summ = key;
    }
  });
  return summ;
}
