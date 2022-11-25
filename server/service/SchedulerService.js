import _ from "lodash";
import moment from "moment";
import { findInspectionStatus } from "../timps/api/findInspectionStatus";
export default class SchedulerService {
  getSchedules(
    template,
    executed_schedules,
  ) {
    let config = {
      expiryDateToStartNextScheduleAtStartOfPeriod: false,
      adjustOffDays: false,
      moveNextScheduleToTodayIfPossible: true,
      showFutureScheduleOnDueDate: true,
      minDaysGapBetweenTimePeriodsInFutureSchedules: true,
      singleUpcomingSchedule: true,
    };
    let inspections = [];
    inspections = [
      ...inspections,
      ...this.getScheduleOfFreq(
        template,
        executed_schedules,
      ),
    ];

    return inspections;
  }

  getTestSchedule(
    testObject,
    startDate,
    filledForms,
    dateRange,
    workingDays,
    locationTimezone,
    timezoneMethodService,
    ignoreExecutionsMethod,
  ) {
    let config = {
      expiryDateToStartNextScheduleAtStartOfPeriod: false,
      adjustOffDays: false,
      moveNextScheduleToTodayIfPossible: true,
      showFutureScheduleOnDueDate: true,
      minDaysGapBetweenTimePeriodsInFutureSchedules: true,
      singleUpcomingSchedule: true,
    };
    let testFormSchedules = this.getScheduleOfFreq(
      testObject,
      filledForms,
      dateRange,
      workingDays,
      testObject.inspectionFrequencies,
      config,
      startDate,
      locationTimezone,
      timezoneMethodService,
      ignoreExecutionsMethod,
      "SITE",
    );
    // for (let scheduleFreq of template.inspectionFrequencies) {
    //   if (scheduleFreq.freq > 0) {
    //     inspections = [
    //       ...inspections,
    //       ...this.getScheduleOfFreq(
    //         template,
    //         executed_schedules,
    //         dateRange,
    //         workingDays,
    //         scheduleFreq,
    //         config,
    //         startDate,
    //         locationTimezone,
    //         timezoneMethodService,
    //         ignoreExecutionsMethod,
    //         "SITE",
    //       ),
    //     ];
    //   }

    return testFormSchedules;
  }

  getScheduleOfFreq(template, executed_schedules) {
    //console.log(executed_schedules);
    let freqMap = {
      NA: 0,
      one_Year: 1,
      three_Years: 3,
      five_Years: 5
    }
      let allSchedulesToReturn = [];
    let inspection_date = template.inspection_date;
    let lastInspection = template.lastInspection;
    let exec_schedules = [...executed_schedules];
    let status = findInspectionStatus(inspection_date, freqMap[template.inspection_freq], exec_schedules);
    if (status == "Upcoming") {
      status = "Future";
    }

    let scheduleObj = foreCastedInspectionObjectGet(template, inspection_date, status)

    allSchedulesToReturn = [...allSchedulesToReturn, scheduleObj];

    return allSchedulesToReturn;
  }
}

function foreCastedInspectionObjectGet(c_plan, date, status, mode) {
  let inspection = {};

  inspection = {
    user: c_plan.user,
    tasks: c_plan.tasks,
    date: date,
    title: c_plan.title,
    workplanTemplateId: c_plan._id,
    lineId: c_plan.lineId,
    lineName: c_plan.lineName,
    status: status == "Future" ? status + " Inspection" : status,
  };
  return inspection;
}

export function getNextTimePeriod(currentDatePoint, year) {
  let nextTimePeriodStart = moment(currentDatePoint).add(year, 'Year');
  return nextTimePeriodStart;
}

export function getEndTimePeriod(datePoint, year, locationTimezone, timezoneMethodService) {
  let subtractedDate = moment(datePoint).add(year, "Year").endOf('year');
  let date = timezoneMethodService.endOfDayMethod(subtractedDate, locationTimezone);
  //console.log(date);
  return date;
}
// export function getLastPeriodStart(datePoint, freqOption) {
//   let date = moment(datePoint).subtract(freqOption.recurNumber, 'Year');
//   return date;
// }

const templateTimeFrame = {
  Week: "w",
  Month: "M",
  Year: "y",
  Day: "d",
};

function calculateExpiryDate(shedsInCurrentTimePeriod, minDaysBeforeNextSchedule, timePeriod, freqOption, config, workingDays) {

  let subtractVal = minDaysBeforeNextSchedule;
  if (config.expiryDateToStartNextScheduleAtStartOfPeriod) {
    subtractVal = minDaysBeforeNextSchedule * (freqOption - shedsInCurrentTimePeriod.length);
  } else {
    subtractVal = minDaysBeforeNextSchedule * (freqOption - shedsInCurrentTimePeriod.length - 1);
  }

  return config.adjustOffDays
    ? reverseWorkingDaysAdjust(moment(timePeriod).subtract(subtractVal, "days"), workingDays)
    : moment(timePeriod).subtract(subtractVal, "days");
}

// function calculateExpiryDate(shedsInCurrentTimePeriod, minDaysBeforeNextSchedule, timePeriod, freqOption, config, workingDays) {
//   let subtractVal = minDaysBeforeNextSchedule;
//   if (config.expiryDateToStartNextScheduleAtStartOfPeriod) {
//     subtractVal = minDaysBeforeNextSchedule * (freqOption - shedsInCurrentTimePeriod.length);
//   } else {
//     subtractVal = minDaysBeforeNextSchedule * (freqOption - shedsInCurrentTimePeriod.length - 1);
//   }

//   return config.adjustOffDays
//     ? reverseWorkingDaysAdj ust(moment(timePeriod).subtract(subtractVal, "days"), workingDays)
//     : moment(timePeriod).subtract(subtractVal, "days");
// }
// not tested implementation
function nextWorkingDaysAdjusted(currDate, rawNum, workingDays, reverse) {
  let adjustedNum = rawNum;

  for (let i = reverse ? adjustedNum : 0; reverse ? i >= 0 : i <= adjustedNum; reverse ? i-- : i++) {
    let newDate = reverse ? moment(currDate).subtract(i, "days") : moment(currDate).add(i, "days");
    let holiday = _.find(workingDays.holidays, item => {
      return moment(newDate).format("DDMMYYYY") == moment(item).format("DDMMYYYY");
    });
    if (holiday) {
      reverse ? adjustedNum-- : adjustedNum++;
    } else {
      let day = newDate.format("dddd");
      let offDay = _.find(workingDays.weekOffDays, item => {
        return item == day;
      });
      offDay && reverse ? adjustNum-- : adjustedNum++;
    }
  }
  return adjustedNum;
}

function reverseWorkingDaysAdjust(currDate, workingDays) {
  let foundWorkingDay = false;
  let newDate = currDate;
  while (!foundWorkingDay) {
    let holiday = _.find(workingDays.holidays, item => {
      return moment(newDate).format("DDMMYYYY") == moment(item).format("DDMMYYYY");
    });
    if (holiday) {
      newDate = moment(newDate).subtract(1, "days");
    } else {
      let day = newDate.format("dddd");
      let offDay = _.find(workingDays.weekOffDays, item => {
        return item == day;
      });
      if (offDay) {
        newDate = moment(newDate).subtract(1, "days");
      } else {
        foundWorkingDay = true;
      }
    }
  }
  return newDate;
}

function updateNextScheduleDueToToday(
  futureSchedule,
  DATE_FILTER_TODAY,
  shedsInCurrentTimePeriod,
  templateSchedules,
  currentTimePeriod,
  freqOption,
  locationTimezone,
  timezoneMethodService,
) {
  // # expiry date of current next upcoming inspection and move it to today.
  let foundToday;
  let result = getLastDateOfScheduleWithTimePeriodChange(shedsInCurrentTimePeriod, templateSchedules);
  // # to check if last inspection date is not today.
  let timeperiodChangeCheck = result.timePeriodChange ? compareTwoDates(currentTimePeriod, DATE_FILTER_TODAY, "IB") : true;
  let dateToCheckAgainst = result.dateOfLastSchedule ? result.dateOfLastSchedule : futureSchedule.dueDate;
  foundToday =
    timeperiodChangeCheck &&
    moment(moment(dateToCheckAgainst).format("YYYY-MM-DD")).isBefore(moment(DATE_FILTER_TODAY).format("YYYY-MM-DD"));
  if (foundToday) {
    if (!futureSchedule.dueDate) {
      futureSchedule.expiryDate = futureSchedule.date;
    }
    //TODO: if today is also within due date by adding min days
    let todayDueDate = DATE_FILTER_TODAY;
    let dueDateOfSchedule = futureSchedule.dueDate;
    !dueDateOfSchedule && (dueDateOfSchedule = moment(dateToCheckAgainst).add(0, "days"));
    if (compareTwoDates(todayDueDate, dueDateOfSchedule, "IA")) {
      futureSchedule.date = todayDueDate;
    }
  }
}
function calculateDueDate(
  schedule,
  currentTimePeriod,
  shedsInCurrentTimePeriod,
  templateSchedules,
  config,
  freqOption,
  timezoneMethodService,
  locationTimezone,
) {
  let minDays = 0;
  let result = getLastDateOfScheduleWithTimePeriodChange(shedsInCurrentTimePeriod, templateSchedules, {
    freqOption: freqOption,
    currentTimePeriod: currentTimePeriod,
  });
  let dateOfLastSchedule = result.dateOfLastSchedule;
  let timePeriodChange = result.timePeriodChange;
  let expiryDateReceived = result.expiryDateReceived;
  let dateToDue;
  if (dateOfLastSchedule) {
    let daysToAdd =
      !expiryDateReceived && config.minDaysGapBetweenTimePeriodsInFutureSchedules && minDays > 0 ? minDays + 1 : 1;
    // dateToDue = expiryDateReceived
    //   ? timezoneMethodService.startOfDayMethod(moment(dateOfLastSchedule).add(daysToAdd, "days"), locationTimezone)
    //   : moment(dateOfLastSchedule).add(daysToAdd, "days");
    dateToDue = timezoneMethodService.startOfDayMethod(moment(dateOfLastSchedule).add(daysToAdd, "days"), locationTimezone);

    if (timePeriodChange && compareTwoDates(dateToDue, currentTimePeriod, "IB")) {
      dateToDue = currentTimePeriod;
    }
  } else {
    dateToDue = currentTimePeriod;
  }
  if (dateToDue) {
    // # save as due date so it can be checked on later on to know if we are already on due date and not expiry date in date field
    schedule.expiryDate = schedule.date;
    schedule.dueDate = dateToDue;
    if (config.showFutureScheduleOnDueDate) {
      schedule.date = dateToDue;
    }
  }
}

function getLastElementOfArray(arr) {
  return arr[arr.length - 1];
}

function nextMaxIntervalExpiryDate(
  shedsInCurrentTimePeriod,
  templateSchedules,
  currentTimePeriod,
  freqOption,
  timezoneMethodService,
  locationTimezone,
) {
  let maxExpiryDate = null;
  let result = getLastDateOfScheduleWithTimePeriodChange(shedsInCurrentTimePeriod, templateSchedules);
  let dateOfLastSchedule = result.dateOfLastSchedule;
  let timePeriodChange = result.timePeriodChange;
  // # if time period change it means we calculate expiry date of next schedule based on max interval
  if (dateOfLastSchedule) {
    // # ignore if we are on latest schedule in frequency or if we frequency is only 1
    let shedsLength = shedsInCurrentTimePeriod.length;
    let ignoreCheckMaxIntervalWithinTimePeriod = timePeriodChange == true ? false : freqOption == 1 || shedsLength == freqOption;
    if (!ignoreCheckMaxIntervalWithinTimePeriod) {
      maxExpiryDate = timezoneMethodService.endOfDayMethod(
        moment(dateOfLastSchedule).add(5, "days"),
        locationTimezone,
      );
      //moment(dateOfLastSchedule).add(freqOption.maxInterval, "days");
      let checkIfStillInLastPeriod = compareTwoDates(maxExpiryDate, currentTimePeriod, "IB");
      checkIfStillInLastPeriod && (maxExpiryDate = null);
    }
  }
  return maxExpiryDate;
}

function getLastDateOfScheduleWithTimePeriodChange(shedsInCurrentTimePeriod, templateSchedules, lastTimePeriodScheduleCondition) {
  let minDays = 0;
  let result, timePeriodChange, dateOfLastSchedule, expiryDateReceived;
  if (shedsInCurrentTimePeriod.length > 0) {
    let sc = getLastElementOfArray(shedsInCurrentTimePeriod);
    dateOfLastSchedule = sc.expiryDate ? sc.expiryDate : sc.date;
    expiryDateReceived = sc.expiryDate ? true : false;
  } else if (templateSchedules.length > 0) {
    let tsc = getLastElementOfArray(templateSchedules);
    // only check if we have lastTimePeriodScheduleCondition object that has template and currentTimePeriod ( we do this one only for min days time period change check)
    if (lastTimePeriodScheduleCondition) {
      let freqOption = lastTimePeriodScheduleCondition.freqOption;
      let currentTimePeriod = lastTimePeriodScheduleCondition.currentTimePeriod;
      if (tsc && compareTwoDates(moment(tsc.date).add(minDays ? minDays : 0, "days"), currentTimePeriod, "ISOA")) {
        dateOfLastSchedule = tsc.expiryDate ? tsc.expiryDate : tsc.date;
        expiryDateReceived = tsc.expiryDate ? true : false;
        timePeriodChange = true;
      }
    } else {
      // else if we are testing max interval then we need last schedule anyhow
      dateOfLastSchedule = tsc.expiryDate ? tsc.expiryDate : tsc.date;
      timePeriodChange = true;
    }
  }
  result = {
    timePeriodChange: timePeriodChange,
    dateOfLastSchedule: dateOfLastSchedule,
    expiryDateReceived: expiryDateReceived,
  };
  return result;
}

function compareTwoDates(d1, d2, method) {
  let result;
  switch (method) {
    case "ISOB":
      result = moment(moment(d1).format("YYYY-MM-DD")).isSameOrBefore(moment(moment(d2).format("YYYY-MM-DD")));
      break;
    case "IB":
      result = moment(moment(d1).format("YYYY-MM-DD")).isBefore(moment(moment(d2).format("YYYY-MM-DD")));
      break;
    case "ISOA":
      result = moment(moment(d1).format("YYYY-MM-DD")).isSameOrAfter(moment(moment(d2).format("YYYY-MM-DD")));
      break;
    case "IA":
      result = moment(moment(d1).format("YYYY-MM-DD")).isAfter(moment(moment(d2).format("YYYY-MM-DD")));
      break;
    default:
      break;
  }
  return result;
}
