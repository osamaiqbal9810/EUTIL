/* eslint eqeqeq: 0 */
import { colors } from "utils/colors";
import { getStatusColor } from "../../../utils/statusColors";
import { inspectionTemplate } from "../../../templates/InspectionTemplate";
import { issueTemplate } from "../../../templates/IssueTemplate";

const inspectionSummaryTemplate = { ...inspectionTemplate };

const issueSummaryTemplate = { ...issueTemplate };
export function fieldTemplate(field, activeTheme) {
  let fieldTemplate = null;
  if (field === "inspections") {
    fieldTemplate = { ...inspectionSummaryTemplate };
    fillTemplateWithThemeColors(fieldTemplate, activeTheme);
  }
  if (field === "issues") {
    fieldTemplate = { ...issueSummaryTemplate };
    fillTemplateWithThemeColors(fieldTemplate, activeTheme);
  }
  return fieldTemplate;
}

export function getTotalObj(activeTheme) {
  return { label: "total", backgroundColor: colors[activeTheme].total };
}

function fillTemplateWithThemeColors(template, activeTheme) {
  let keys = Object.keys(template);
  keys.forEach(key => {
    if (activeTheme) {
      template[key].bgColor = getStatusColor(template[key].label);
    } else {
      template[key].bgColor = getRandomColor();
    }
  });
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
