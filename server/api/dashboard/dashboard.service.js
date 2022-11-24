let ServiceLocator = require("../../framework/servicelocator");
import moment from "moment";
import _ from "lodash";
import { subdivisionChecker } from "../../apiUtils/subdivisionCheck";
class DashboardService {
  async getDashboardData(user, query) {
    let resultObj, checkSubdiv, dateRange;
    resultObj = {};

    try {
      if (query.dateRange) {
        dateRange = JSON.parse(query.dateRange);
        // console.log(dateRange);
      }

      //  checkSubdiv = await subdivisionChecker(user);
      let dataObject = {};
      let range = {
        today: moment.utc(dateRange.today.slice(0, 10)).startOf("d"),
        from: moment.utc(dateRange.from.slice(0, 10)).startOf("d"),
        to: moment.utc(dateRange.to.slice(0, 10)).endOf("d"),
      };
      let lineLists = await getLists(checkSubdiv ? user.subdivision : null, false);
      if (lineLists) {
        dataObject.lineLists = lineLists;
        let getPlans = await this.getInspectionDataBasedOnLine(dataObject, range);
        resultObj = { value: dataObject, status: 200 };
      } else {
        resultObj = { errorVal: "Lines Not Found", status: 404 };
      }
    } catch (error) {
      console.log("getDashboardData Error: " + error);
      resultObj = { errorVal: error.toString(), status: 500 };
    }
    return resultObj;
  }

  async reCalculateDashboardV1Data(dateRange) {
    let updatedData = {};
    try {
      let lines = await getLists(null, true);
      //console.log(lines);
      let range = dateRange
        ? dateRange
        : {
            today: moment().utc().startOf("day"),
            // from: moment()
            //   .utc()
            //   .subtract(30, "d")
            //   .startOf("day"),
            // to: moment()
            //   .utc()
            //   .add(30, "d")
            //   .startOf("day"),
            from: moment().utc().startOf("month"),
            to: moment().utc().endOf("month"),
          };
      //   console.log("Recalculating dashboard summary range: ", range);
      let workplanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
      let jplans = await workplanTemplateService.getAllPlansInRange(range, {}, null, { date: "asc" });
      let sortedPlans = _.sortBy(jplans, "date");
      //let linesStatusesDataListArray = {};
      // line = [
      //   //inProgress:
      //   [],
      //   //finished:
      //   [],
      //   //overdue:
      //   [],
      //   //futureInspection:
      //   [],
      //   // missed:
      //   [],
      // ];
      for (let jplan of sortedPlans) {
        let jplanLineName = lines.lines_Id_name[jplan.lineId];
        if (jplanLineName) {
          // Only add today's inspection upto 10
          // const JPLAN_DATE = moment(jplan.date).startOf("day");
          // const TODAY_DATE_START = moment()
          //   .utc()
          //   .startOf("day");
          // const TODAY_DATE_END = moment()
          //   .utc()
          //   .endOf("day");
          // if (JPLAN_DATE > TODAY_DATE_START && JPLAN_DATE < TODAY_DATE_END) {
          //   lines.lines[jplanLineName].inspections.details.length <= 10 ? lines.lines[jplanLineName].inspections.details.push(jplan) : "";
          // }

          // linesStatusesDataListArray[jplanLineName] = !linesStatusesDataListArray[jplanLineName]
          //   ? [[], [], [], [], []]
          //   : linesStatusesDataListArray[jplanLineName];
          lines.lines[jplanLineName].inspections.summary.total++;
          let planObj = {
            _id: jplan._id,
            user: jplan.user,
            status: jplan.status,
            date: jplan.date,
            title: jplan.title,
          };
          lines.lines[jplanLineName].inspections.details.push(planObj);
          if (jplan.status == "Finished") {
            lines.lines[jplanLineName].inspections.summary.completed++;
            let issues = await calculateIssueInInspection(lines.lines[jplanLineName], jplan, dateRange);
          }
          if (jplan.status == "In Progress") {
            lines.lines[jplanLineName].inspections.summary.inProgress++;
            let issues = await calculateIssueInInspection(lines.lines[jplanLineName], jplan, dateRange);
          }
          if (jplan.status == "Missed") {
            lines.lines[jplanLineName].inspections.summary.missed++;
          }
          if (jplan.status == "Overdue") {
            lines.lines[jplanLineName].inspections.summary.overdue++;
          }
          if (jplan.status == "Future Inspection") {
            lines.lines[jplanLineName].inspections.summary.upcoming++;
          }
        } else {
          console.log("Caution : Active Inspection Run Plan Template Exist But Its Line Not Found, lineId :  ", jplan.lineId);
        }
      }

      //   console.log(lines);
      let dashboardModel = ServiceLocator.resolve("ReportModel");
      let data = await dashboardModel.findOne({ tag: "dashboardV1" }).exec();
      const TODAY_CALCULATED_DATE = moment().utc().startOf("day").format("YYYY-MM-DD");

      if (data) {
        data.data.lines = lines.lines;
        data.data.lastCalculatedDate = TODAY_CALCULATED_DATE;
        data.markModified("data");
        let savedData = await data.save();
        updatedData = savedData;
      } else {
        data = { data: {} };
        data.data.lines = lines.lines;
        data.data.lastCalculatedDate = TODAY_CALCULATED_DATE;
        data.tag = "dashboardV1";
        let newData = new dashboardModel(data);
        let savedData = await newData.save();
        updatedData = savedData;
      }
    } catch (error) {
      console.log("Error in reCalculateDashboardV1Data : ", error);
    }
    return updatedData;
  }

  async getInspectionDataBasedOnLine(dataObject, dateRange) {
    try {
      let linesNames, dashboardModel, data, checkTrigger, re_calLogic, filledData;
      linesNames = Object.keys(dataObject.lineLists);
      dashboardModel = ServiceLocator.resolve("ReportModel");
      data = await dashboardModel.findOne({ tag: "dashboardV1" }).exec();
      checkTrigger = true; //await checkTriggersFunction(data, linesNames, dataObject);
      if (checkTrigger) {
        re_calLogic = await this.reCalculateDashboardV1Data(dateRange);
        filledData = await this.fillLinesData(re_calLogic, linesNames, dataObject);
      } else {
        filledData = await this.fillLinesData(data, linesNames, dataObject);
      }
    } catch (error) {
      console.log("getInspectionDataBasedOnLine Error: " + error);
    }
  }

  async fillLinesData(data, linesNames, dataObject) {
    try {
      for (let line_name of linesNames) {
        dataObject.lineLists[line_name] = data.data.lines[line_name];
        if (!dataObject.lineLists[line_name]) {
          console.log("TO Call Recall Logic");
          let re_calLogic = await this.reCalculateDashboardV1Data();
          let filledData = await this.fillLinesData(re_calLogic, linesNames, dataObject);
        } else {
          //send today Inspection Data to frontend:
          let todayStartDate = moment().utc().startOf("day");
          let todayEndDate = moment().utc().endOf("day");
          let JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
          let jPLans = await JourneyPlanModel.find({
            $or: [
              // {
              //   $and: [
              //     {
              //       date: {
              //         $gte: new Date(todayStartDate.toISOString()),
              //         $lte: new Date(todayEndDate.toISOString()),
              //       },
              //     },
              //     {
              //       lineId: dataObject.lineLists[line_name].line.id,
              //     },
              //   ],
              // },
              {
                $and: [
                  {
                    status: "In Progress",
                  },
                  {
                    lineId: dataObject.lineLists[line_name].line.id,
                  },
                ],
              },
            ],
          }).exec();
          // console.log("today plans", jPLans);
          let todayInspectionData = jPLans;
          if (!dataObject.todayLineList) {
            dataObject.todayLineList = {};
          }
          dataObject.todayLineList[line_name] = dataObject.todayLineList[line_name]
            ? dataObject.todayLineList[line_name]
            : (dataObject.todayLineList[line_name] = {});
          dataObject.todayLineList[line_name].inspections = todayInspectionData;
        }
      }
    } catch (error) {
      console.log("Error in fillLinesData : ", error);
    }
  }
}

async function getLists(subdiv, internal) {
  let lines = { lines_Id_name: {}, lines: {} };
  try {
    // let criteria = { assetType: "line" };
    // if (subdiv) criteria.subdivision = subdiv;
    // let AssetsModel = ServiceLocator.resolve("AssetsModel");
    // let assets = await AssetsModel.find(criteria).exec();
    let assetsModel = ServiceLocator.resolve("AssetsModel");
    let assetTreeService = ServiceLocator.resolve("AssetsTreeService");
    let result = await assetTreeService.getAllPlannableLocations();
    let plannableLocations = result.value ? result.value : [];
    let assets = await assetsModel.find({ _id: { $in: plannableLocations } });

    if (assets.length > 0) {
      for (let line of assets) {
        if (internal) {
          lines.lines_Id_name[line._id] = line.unitId;
        }
        lines.lines[line.unitId] = {
          inspections: {
            summary: {
              total: 0,
              completed: 0,
              inProgress: 0,
              missed: 0,
              overdue: 0,
              upcoming: 0,
            },
            details: [
              // {
              //   runName: "Inspection 1",
              //   inspector: {
              //     name: "Joe",
              //     email: "abc@def.com",
              //     avatar: "",
              //   },
              //   status: "inProgress",
              // },
            ],
          },
          issues: {
            summary: {
              total: 0,
              info: 0,
              high: 0,
              medium: 0,
              low: 0,
              pending: 0,
              marked: 0,
            },
            details: [
              // {
              //   unitid: "track 1",
              //   inspector: {
              //     name: "Joe",
              //     email: "abc@def.com",
              //     avatar: "",
              //   },
              //   status: "in-progress",
              // },
            ],
          },
          line: {
            id: line._id,
            subdivision: line.subdivision,
          },
        };
      }
    } else {
      lines = null;
    }
  } catch (error) {
    lines = null;
    console.log("getLists: " + error);
  }
  return internal ? lines : lines.lines;
}

async function checkTriggersFunction(data) {
  let trigger = false;
  try {
    if (!data) {
      console.log("Case 1 trigger: No data length or data is undefined || null ");
      trigger = true;
      return trigger;
    }
    // to do : check if last recalculated date has changed , trigger logic to recalculate if it did.
    let LAST_CALCULATION_DATE = data.lastCalculatedDate;
    if (
      LAST_CALCULATION_DATE &&
      moment(LAST_CALCULATION_DATE).utc().format("YYYY-MM-DD") < moment().utc().startOf("day").format("YYYY-MM-DD")
    ) {
      console.log("Case 2 : Date has changed");
      trigger = true;
    }
  } catch (error) {
    console.log("error in checkTriggersFunction : ", error);
  }
  return trigger;
}

async function calculateIssueInInspection(line, jplan, dateRange) {
  let tasks = jplan.tasks;
  if (tasks && tasks.length > 0) {
    for (let task of tasks) {
      let issues = task.issues;
      if (issues && issues.length > 0) {
        for (let issue of issues) {
          let issuePush = false;
          dateRange &&
            (issuePush = new Date(issue.timeStamp) > new Date(dateRange.from) && new Date(issue.timeStamp) < new Date(dateRange.to));

          if (issuePush) {
            if (issue.status !== "Resolved") {
              line.issues.summary.total++;

              if (!issue.serverObject || !issue.serverObject.issuePriority) {
                line.issues.summary.pending++;
                // continue;
              } else {
                if (issue.serverObject.issuePriority == "info") {
                  line.issues.summary.info++;
                }
                if (issue.serverObject.issuePriority == "high") {
                  line.issues.summary.high++;
                }
                if (issue.serverObject.issuePriority == "medium") {
                  line.issues.summary.medium++;
                }
                if (issue.serverObject.issuePriority == "low") {
                  line.issues.summary.low++;
                }
              }

              //comment because fixed on site implementaion changed
              // if (issue.marked) {
              //   line.issues.summary.marked++;
              // }
              let issueObj = {
                planId: jplan._id,
                priority: issue.priority,
                user: jplan.user,
                trackId: issue.trackId,
                timeStamp: issue.timeStamp,
                marked: issue.marked,
                serverObject: issue.serverObject,
              };
              line.issues.details.push(issueObj);
            }
          }
        }
      }
    }
  }
}

async function fillDetailArray(lineListStatusData) {
  //let lineListStatusData = [["A1"], ["B1", "B2"], ["C1,C2,C3"], [], ["E1", "E2", "E3", "E4", "E5"]];
  let finalArray = [];
  let count = 10;
  let eachArrayCount = count / lineListStatusData.length;
  let arrayFilled = await fillArrayCount(lineListStatusData, eachArrayCount, finalArray, count);

  // console.log(finalArray);
  return finalArray;
}

async function fillArrayCount(lineListStatusData, eachArrayCount, finalArray, count, recur_index) {
  let allArrayLength = lineListStatusData.length;
  for (let arr_index = recur_index ? recur_index : 0; arr_index < allArrayLength - 1; arr_index++) {
    let arr = lineListStatusData[arr_index];
    let index = 0;
    let arrLengthBeforeDown = arr.length;
    if (recur_index != arr_index) {
      if (finalArray.length == 10) {
      }
      if (arr.length >= eachArrayCount) {
        while (index < eachArrayCount && finalArray.length < count) {
          finalArray.push(arr[0]);

          arr.splice(0, 1);
          index++;
        }
      } else {
        if (arr.length > 0) {
          while (index < arr.length && finalArray.length < count) {
            finalArray.push(arr[0]);
            arr.splice(0, 1);
            index++;
          }
        } else {
          let filledArray = await fillArrayCount(lineListStatusData, arrLengthBeforeDown, finalArray, count, arr_index);
        }
      }
    }
  }
  return finalArray;
}
async function addAndPopDataInArray(arrayData, data, unshift) {
  // const JPLAN_DATE = moment(data.date).startOf("day");
  // const TODAY_DATE_START = moment()
  //   .utc()
  //   .startOf("day");
  // if (JPLAN_DATE >= TODAY_DATE_START) {
  if (unshift) {
    arrayData.unshift(data);
  } else {
    arrayData.push(data);
  }
  //   if (arrayData.length > 10) {
  //     arrayData.pop();
  //   }
  // }
}
export default DashboardService;
