let JourneyPlanModel = require("./../api/journeyPlan/journeyPlan.model");
import moment from "moment";
import { guid } from "./UUID";
import _ from "lodash";

export function jPlanSeedHelper(numberOf) {
  if (!numberOf) {
    numberOf = 1;
  }
  JourneyPlanModel.find({}, function(err, data) {
    if (err || !data || data.length == 0) {
      let jPlans = getJplans(numberOf);
      jPlans.forEach(plan => {
        JourneyPlanModel.create(plan);
      });
    }
  });
}

function getJplans(count) {
  let jPlans = [];
  for (let j = 0; j < count; j++) {
    let newjPlan = { ...jPlanObj };
    let oldjPlan = { ...jPlanObj };
    newjPlan.date = new Date(moment().add(j, "d"));
    oldjPlan.date = new Date(moment().subtract(j + 1, "d"));
    oldjPlan.title = newjPlan.title + "-" + j;
    newjPlan.title = newjPlan.title + "-" + (count + j);
    let randomNum = Math.floor(Math.random() * (count - 1) + 1);
    let tasksNew = [];
    let tasksOld = [];
    for (let t = 0; t < randomNum; t++) {
      let newTask = { ...task };
      let oldTask = { ...task };
      newTask.title = newTask.title + "-" + t;
      oldTask.title = oldTask.title + "-" + (t + randomNum);
      let randomUnits = Math.floor(Math.random() * (6 - 1) + 1);
      let newTaskUnits = [];
      let oldTaskUnits = [];
      for (let u = 1; u <= randomUnits; u++) {
        let newUnit = { ...units["unit" + u] };
        let oldUnit = { ...units["unit" + (6 - u)] };
        newTaskUnits.push(newUnit);
        oldTaskUnits.push(oldUnit);
      }
      newTask.units = newTaskUnits;
      oldTask.units = oldTaskUnits;
      let oldIssues = [];
      // To check wether to add Issues in task or not
      let addIssues = _.sample([true, false]);
      if (addIssues) {
        let randomIssues = Math.floor(Math.random() * (4 - 1) + 1);
        for (let i = 0; i < randomIssues; i++) {
          let oldIssue = { ...issue };
          oldIssue.description = oldIssue.description + i;
          let maxVal = oldTask.units.length - 1;
          let issueTrackIdIndex = Math.floor(Math.random() * (maxVal - 0) + 0);
          oldIssue.trackId = oldTask.units[issueTrackIdIndex].unitId;
          let priority = ["High", "Medium", "Low", "Info"];
          let category = ["Tiles", "Rails", "Joint Bar", "Switch", "Spikes"];
          let selectCategory = Math.floor(Math.random() * (5 - 0) + 0);
          oldIssue.category = category[selectCategory];
          let selectPriority = Math.floor(Math.random() * (3 - 0) + 0);
          oldIssue.priority = priority[selectPriority];
          oldIssues.push(oldIssue);
        }
        oldTask.issues = oldIssues;
      }

      tasksNew.push(newTask);
      tasksOld.push(oldTask);
    }
    newjPlan.tasks = tasksNew;
    oldjPlan.tasks = tasksOld;
    jPlans.push(newjPlan);
    jPlans.push(oldjPlan);
  }
  return jPlans;
}

let jPlanObj = {
  supevisor: "",
  user: { id: "5b8950f78aae6dadfc2721c5", name: "admin" },
  date: "",
  title: "Plan",
  tasks: [],
};

let task = {
  taskId: guid(),
  taskDate: "",
  startLocation: "",
  endLocation: "",
  startTime: "",
  endTime: "",
  status: "",
  title: "Task",
  desc: "Not Available",
  notes: "Not Available",
  imgs: "defaultTask.jpg",
  units: [],
  issues: [],
};

let units = {
  unit1: { id: "29143a56-27fb-1132-9aa9-51d784dedd10", unitId: "T001-U001", track_id: "5bf7eb2c5a6dd143e4dd0101" },
  unit2: { id: "29143a56-27fb-1132-9aa9-51d784dedd11", unitId: "T001-U002", track_id: "5bf7eb2c5a6dd143e4dd0101" },
  unit3: { id: "29143a56-27fb-1132-9aa9-51d784dedd12", unitId: "T001-U003", track_id: "5bf7eb2c5a6dd143e4dd0101" },
  unit4: { id: "29143a56-27fb-1132-9aa9-51d784dedd13", unitId: "T002-U001", track_id: "5bf7eb2c5a6dd143e4dd0102" },
  unit5: { id: "29143a56-27fb-1132-9aa9-51d784dedd14", unitId: "T003-U001", track_id: "5bf7eb2c5a6dd143e4dd0103" },
  unit6: { id: "29143a56-27fb-1132-9aa9-51d784dedd15", unitId: "T004-U001", track_id: "5bf7eb2c5a6dd143e4dd0104" },
};

let issue = {
  description: "issue",
  location: "31.578934, 74.308607",
  category: "Rails",
  trackId: "T001-U001",
  description: "Issue Because of This",
  imgList: [
    {
      imgName: "defaultIssue1.jpg",
      status: 1,
    },
    {
      imgName: "defaultIssue2.jpg",
      status: 0,
    },
  ],
  marked: true,
  priority: "Info",
  status: "",
  timeStamp: "",
};
