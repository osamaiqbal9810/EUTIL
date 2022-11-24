import { colors } from "./colors";
export function getStatusColor(status) {
  let color = "#fff";
  let activeTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default";
  if (activeTheme == "default") {
    color = getDefaultStatusColors(status, activeTheme);
  }
  if (activeTheme == "retro") {
    color = getRetroStatusColors(status, activeTheme);
  }

  return color;
}

function getDefaultStatusColors(status, activeTheme) {
  let color = "#fff";

  switch (status) {
    case "Total Issues":
    case "Total":
      color = colors[activeTheme].total;
      break;
    case "Not Started":
    case "Info":
    case "New":
    case "Template":
    case "Future Inspection":
    case "Future":
    case "Upcoming":
      //color = "#A6A8AB";
      color = colors[activeTheme].first;
      break;
    case "In Progress":
    case "Low":
    case "Today":
    case "Inprogress":
    case "low":
      color = colors[activeTheme].second;
      break;
    case "Finished":
    //case "Medium":
    case "Completed":
    case "Complete":
    case "Closed":
    case "normal":
    case "Normal":
    case "Marked":
    case "Pending":
      color = colors[activeTheme].third;
      break;
    case "On Hold":
    case "High":
    case "Overdue":
    case "high":
      color = colors[activeTheme].fourth;
      break;
    case "In Review":
    case "Planned":
    case "Medium":
    case "Missed":
    case "medium":
      color = colors[activeTheme].fifth;
      break;
    case "Planning":
      color = colors[activeTheme].seventh;
      break;
    default:
      break;
  }
  return color;
}

function getRetroStatusColors(status, activeTheme) {
  let color = "#fff";
  switch (status) {
    case "Total":
      color = colors[activeTheme].total;
      break;
    case "Not Started":
    case "Info":
    case "New":
    case "Template":
    case "Completed":
    case "Finished":
    case "Complete":
      color = colors[activeTheme].sixth;
      break;

    case "High":
    case "Today":
    case "Inprogress":
    case "Overdue":
    case "high":
      color = colors[activeTheme].second;
      break;
    case "Medium":
    case "medium":
    case "Closed":
    case "normal":
    case "Normal":
    case "Missed":
      color = colors[activeTheme].third;
      break;
    case "On Hold":
    case "Low":
    case "low":
    case "Future Inspection":
    case "Future":
    case "Upcoming":
    case "Planned":
      color = colors[activeTheme].fourth;
      break;
    case "In Review":

    case "Marked":
    case "Pending":
    case "In Progress":
      color = colors[activeTheme].fifth;
      break;
    case "Planning":
      color = colors[activeTheme].seventh;
      break;
    default:
      break;
  }
  return color;
}
