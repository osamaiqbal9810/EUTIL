import _ from "lodash";
import moment from "moment";
export default class SchedulerService {
  getSchedules(
    template,
    startDate,
    executed_schedules,
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
    let inspections = [];
    for (let scheduleFreq of template.inspectionFrequencies) {
      if (scheduleFreq.freq > 0) {
        inspections = [
          ...inspections,
          ...this.getScheduleOfFreq(
            template,
            executed_schedules,
            dateRange,
            workingDays,
            scheduleFreq,
            config,
            startDate,
            locationTimezone,
            timezoneMethodService,
            ignoreExecutionsMethod,
            "Default",
          ),
        ];
      }
    }
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

  getScheduleOfFreq(
    template,
    executed_schedules,
    dateRange,
    workingDays,
    InspecFreqOption,
    config,
    startDate,
    locationTimezone,
    timezoneMethodService,
    ignoreExecutionsMethod,
    mode,
  ) {
    let freqOption = {};
    freqOption.timeFrame = templateTimeFrame[InspecFreqOption.timeFrame];
    freqOption.recurTimeFrame = templateTimeFrame[InspecFreqOption.recurTimeFrame];
    freqOption.freq = parseInt(InspecFreqOption.freq);
    freqOption.timeFrameNumber = parseInt(InspecFreqOption.timeFrameNumber);
    freqOption.recurNumber = parseInt(InspecFreqOption.recurNumber);
    freqOption.maxInterval = InspecFreqOption.maxInterval && parseInt(InspecFreqOption.maxInterval);
    freqOption.minDays = InspecFreqOption.minDays && parseInt(InspecFreqOption.minDays);

    const DATE_FILTER_TO = moment
      .tz(dateRange.to.format("YYYY-MM-DD"), locationTimezone)
      .endOf("day")
      .toDate();
    const DATE_FILTER_FROM = moment
      .tz(dateRange.from.format("YYYY-MM-DD"), locationTimezone)
      .startOf("day")
      .toDate();
    const DATE_FILTER_TODAY = moment
      .tz(dateRange.today.format("YYYY-MM-DD"), locationTimezone)
      .startOf("day")
      .toDate();
    let exec_schedules = [...executed_schedules];

    // # check if minDays are 0 then make sure its set to 1
    let minDaysBeforeNextSchedule = freqOption.minDays ? freqOption.minDays + 1 : 1;

    // # all executions to return
    let allSchedulesToReturn = [];

    // # if it is starting at a date greater then our maximum desired date then it wont show
    if (startDate <= DATE_FILTER_TO) {
      let currentDatePoint = startDate;
      //   let prevDatePoint;
      // # get in the current time period of template
      let nextTimePeriodStart = currentDatePoint;

      while (nextTimePeriodStart < DATE_FILTER_FROM) {
        // console.log("while loop F1");
        nextTimePeriodStart = getNextTimePeriod(nextTimePeriodStart, freqOption);
        // prevDatePoint = new Date(currentDatePoint);
        // currentDatePoint = nextTimePeriodStart;
      }
      // # filter executed_schedules in the two time period we have (current or one before it)

      let filteredSchedules = [];
      //let prevPeriodSchedules = [];
      let lengthOfExecutedSchedules = exec_schedules.length;
      for (let es = 0; es < lengthOfExecutedSchedules; es++) {
        if (compareTwoDates(exec_schedules[es].date, currentDatePoint, "ISOA")) {
          filteredSchedules.push(exec_schedules[es]);
        } else if (
          compareTwoDates(exec_schedules[es].date, template.startDate, "ISOB") &&
          compareTwoDates(exec_schedules[es].date, DATE_FILTER_FROM, "ISOA") &&
          compareTwoDates(exec_schedules[es].date, DATE_FILTER_TO, "ISOB")
        ) {
          //  # dumb include schedules executed before start date ( in case start date can be edited) but the date should be in our range
          allSchedulesToReturn.push(exec_schedules[es]);
        }
      }
      let lengthOfFilteredSchedules = filteredSchedules.length;
      // # end of time Period to check the time period in which enough inspection are needed or executed , also to calculate expiry date
      let endOfTimePeriod = getEndTimePeriod(currentDatePoint, freqOption, locationTimezone, timezoneMethodService);
      let shedsInCurrentTimePeriod = [];
      let templateSchedules = [];

      // # this section will basically add the executed schedules along with missed ones from our date range time period.
      for (let e = 0; e < lengthOfFilteredSchedules; e++) {
        // # Check if any schedule to be calculated before moving to time period of current executed schedule

        while (filteredSchedules[e].date > endOfTimePeriod) {
          // console.log("while loop F2");
          let expiryDate = calculateExpiryDate(
            shedsInCurrentTimePeriod,
            minDaysBeforeNextSchedule,
            endOfTimePeriod,
            freqOption,
            config,
            workingDays,
          );
          if (shedsInCurrentTimePeriod.length < freqOption.freq) {
            if (compareTwoDates(DATE_FILTER_TODAY, expiryDate, "IA")) {
              let missedSchedule = foreCastedInspectionObjectGet(template, expiryDate, "Missed");
              missedSchedule.date = moment(missedSchedule.date).toDate();
              missedSchedule.expiryDate = moment(missedSchedule.date).toDate();
              shedsInCurrentTimePeriod.push(missedSchedule);
            }
          }
          if (shedsInCurrentTimePeriod.length >= freqOption.freq) {
            // # if we have enough then lets move to next period
            let nextTimePeriodStart = getNextTimePeriod(currentDatePoint, freqOption);
            endOfTimePeriod = getEndTimePeriod(nextTimePeriodStart, freqOption, locationTimezone, timezoneMethodService);
            currentDatePoint = nextTimePeriodStart;
            templateSchedules = [...templateSchedules, ...shedsInCurrentTimePeriod];
            allSchedulesToReturn = [...allSchedulesToReturn, ...shedsInCurrentTimePeriod];
            shedsInCurrentTimePeriod = [];
          }
        }
        let pushed = false;
        // # we check if we can push our executed schedule , otherwise add a missed one in current time period
        while (!pushed) {
          // console.log("while loop F3");
          let expiryDate = calculateExpiryDate(
            shedsInCurrentTimePeriod,
            minDaysBeforeNextSchedule,
            endOfTimePeriod,
            freqOption,
            config,
            workingDays,
          );

          if (compareTwoDates(filteredSchedules[e].date, expiryDate, "IA")) {
            let missedSchedule = foreCastedInspectionObjectGet(template, expiryDate, "Missed");
            missedSchedule.date = moment(missedSchedule.date).toDate();
            missedSchedule.expiryDate = moment(missedSchedule.date).toDate();
            shedsInCurrentTimePeriod.push(missedSchedule);
          } else {
            let toIgnore = ignoreExecutionsMethod && ignoreExecutionsMethod(filteredSchedules[e], template);
            if (toIgnore) {
              allSchedulesToReturn.push(filteredSchedules[e]);
            } else {
              shedsInCurrentTimePeriod.push(filteredSchedules[e]);
            }
            filteredSchedules[e].pushed = true;
            pushed = true;
          }
        }
      }
      // # all executed schedules are added now we will be adding missed if we are before today or upcoming if we are in future based on config amount of upcoming
      let afterEndOfRange = false;
      // # check if we are ready to move to next period in case we have enough inspection in current one
      if (shedsInCurrentTimePeriod.length > 0 && shedsInCurrentTimePeriod.length >= freqOption.freq) {
        let nextTimePeriodStart = getNextTimePeriod(currentDatePoint, freqOption);
        endOfTimePeriod = getEndTimePeriod(nextTimePeriodStart, freqOption, locationTimezone, timezoneMethodService);
        currentDatePoint = nextTimePeriodStart;
        //   adjustedDate = moment(shedsInCurrentTimePeriod[shedsInCurrentTimePeriod.length - 1].date).add(minDaysBeforeNextSchedule, "days");
        templateSchedules = [...templateSchedules, ...shedsInCurrentTimePeriod];
        allSchedulesToReturn = [...allSchedulesToReturn, ...shedsInCurrentTimePeriod];
        shedsInCurrentTimePeriod = [];
        // # if next period goes beyond filter range then no need to iterate
        // if (moment(moment(nextTimePeriodStart).format("YYYY-MM-DD")).isAfter(moment(moment(DATE_FILTER_TO).format("YYYY-MM-DD")))) {
        //   afterEndOfRange = true;
        // }
        nextTimePeriodStart > DATE_FILTER_TO && (afterEndOfRange = true);
      }
      let firstFutureSchedule = false;
      while (!afterEndOfRange) {
        // console.log("while loop F4");
        if (shedsInCurrentTimePeriod.length < freqOption.freq) {
          let expiryDateToCheck = calculateExpiryDate(
            shedsInCurrentTimePeriod,
            minDaysBeforeNextSchedule,
            endOfTimePeriod,
            freqOption,
            config,
            workingDays,
          );
          // if max interval is given then calculate it
          if (freqOption.maxInterval) {
            let maxIntervalExpiryDate = nextMaxIntervalExpiryDate(
              shedsInCurrentTimePeriod,
              templateSchedules,
              currentDatePoint,
              freqOption,
              timezoneMethodService,
              locationTimezone,
            );
            if (maxIntervalExpiryDate) {
              let maxExpiryDateIsBefore = compareTwoDates(maxIntervalExpiryDate, expiryDateToCheck, "IB");
              maxExpiryDateIsBefore && (expiryDateToCheck = maxIntervalExpiryDate);
            }
          }
          if (compareTwoDates(expiryDateToCheck, timezoneMethodService.startOfDayMethod(DATE_FILTER_TODAY, locationTimezone), "IB")) {
            let missedSchedule = foreCastedInspectionObjectGet(template, expiryDateToCheck, "Missed");
            missedSchedule.date = moment(missedSchedule.date).toDate();
            missedSchedule.expiryDate = moment(missedSchedule.date).toDate();
            shedsInCurrentTimePeriod.push(missedSchedule);
          } else if (
            compareTwoDates(expiryDateToCheck, DATE_FILTER_TO, "ISOB") ||
            compareTwoDates(expiryDateToCheck, endOfTimePeriod, "ISOB")
          ) {
            let futureSchedule = foreCastedInspectionObjectGet(template, expiryDateToCheck, "Future", mode);
            // # set future schedules to their due dates instead of expiry
            calculateDueDate(
              futureSchedule,
              currentDatePoint,
              shedsInCurrentTimePeriod,
              templateSchedules,
              config,
              freqOption,
              timezoneMethodService,
              locationTimezone,
            );
            let momentDate = futureSchedule.dueDate
              ? moment.utc(new Date(futureSchedule.dueDate).getTime()).format("YYYYMMDD")
              : moment.utc(new Date(futureSchedule.date).getTime()).format("YYYYMMDD");
            // # check if temporary user is assigned
            let futureChange_date = template.modifications && template.modifications[momentDate];
            if (futureChange_date && futureChange_date.user) {
              futureSchedule.temp_user = futureChange_date.user;
            }

            // # check next inspection due today
            if (config.moveNextScheduleToTodayIfPossible) {
              updateNextScheduleDueToToday(
                futureSchedule,
                DATE_FILTER_TODAY,
                shedsInCurrentTimePeriod,
                templateSchedules,
                currentDatePoint,
                freqOption,
                locationTimezone,
                timezoneMethodService,
              );
            }
            futureSchedule.expiryDate = moment(futureSchedule.expiryDate).toDate();
            futureSchedule.dueDate = moment(futureSchedule.dueDate).toDate();
            futureSchedule.date = moment(futureSchedule.date).toDate();
            shedsInCurrentTimePeriod.push(futureSchedule);

            if (!firstFutureSchedule) {
              firstFutureSchedule = true;
              template.updatedNextDates = {
                nextDueDate: futureSchedule.dueDate,
                nextExpiryDate: futureSchedule.expiryDate,
              };
              template.nextDueDate && (template.updatedNextDates.currentDueDate = template.nextDueDate);
              template.nextExpiryDate && (template.updatedNextDates.currentExpiryDate = template.nextExpiryDate);
              if (compareTwoDates(currentDatePoint, DATE_FILTER_TODAY, "ISOB")) {
                template.updatedNextDates.currentPeriodStart = currentDatePoint;
                template.updatedNextDates.currentPeriodEnd = endOfTimePeriod;
              }
            }
          } else {
            templateSchedules = [...templateSchedules, ...shedsInCurrentTimePeriod];
            allSchedulesToReturn = [...allSchedulesToReturn, ...shedsInCurrentTimePeriod];
            shedsInCurrentTimePeriod = [];
            afterEndOfRange = true;
          }
        }
        if (shedsInCurrentTimePeriod.length == freqOption.freq) {
          let nextTimePeriodStart = getNextTimePeriod(currentDatePoint, freqOption);
          endOfTimePeriod = getEndTimePeriod(nextTimePeriodStart, freqOption, locationTimezone, timezoneMethodService);
          currentDatePoint = nextTimePeriodStart;

          templateSchedules = [...templateSchedules, ...shedsInCurrentTimePeriod];
          allSchedulesToReturn = [...allSchedulesToReturn, ...shedsInCurrentTimePeriod];
          shedsInCurrentTimePeriod = [];
          // get only current time period schedules
          // firstFutureSchedule && (afterEndOfRange = true);
        } // # if next period goes beyond filter range then no need to iterate
        if (currentDatePoint > DATE_FILTER_TO || shedsInCurrentTimePeriod.length > freqOption.freq) {
          templateSchedules = [...templateSchedules, ...shedsInCurrentTimePeriod];
          allSchedulesToReturn = [...allSchedulesToReturn, ...shedsInCurrentTimePeriod];
          shedsInCurrentTimePeriod = [];
          currentDatePoint > DATE_FILTER_TO && (afterEndOfRange = true);
        }
        // limit it to only 1 schedule
        if (firstFutureSchedule && config.singleUpcomingSchedule) {
          allSchedulesToReturn = [...allSchedulesToReturn, ...shedsInCurrentTimePeriod];
          shedsInCurrentTimePeriod = [];
          afterEndOfRange = true;
        }
      }
    }

    return allSchedulesToReturn;
  }
}
function foreCastedInspectionObjectGet(c_plan, date, status, mode) {
  let inspection = {};
  if (mode == "SITE") {
    inspection = {
      date: date,
      status: status,
      title: c_plan.title,
      testCode: c_plan.testCode,
    };
  } else {
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
  }
  return inspection;
}

export function getNextTimePeriod(currentDatePoint, freqOption) {
  let nextTimePeriodStart = moment(currentDatePoint).add(freqOption.recurNumber, freqOption.recurTimeFrame);
  return nextTimePeriodStart;
}

export function getEndTimePeriod(datePoint, freqOption, locationTimezone, timezoneMethodService) {
  let subtractedDate = moment(moment(datePoint).add(freqOption.timeFrameNumber, freqOption.timeFrame)).subtract(1, "day");
  let date = timezoneMethodService.endOfDayMethod(subtractedDate, locationTimezone);
  return date;
}
export function getLastPeriodStart(datePoint, freqOption) {
  let date = moment(datePoint).subtract(freqOption.recurNumber, freqOption.recurTimeFrame);
  return date;
}

const templateTimeFrame = {
  Week: "w",
  Month: "M",
  Year: "y",
  Day: "d",
};

function calculateExpiryDate(shedsInCurrentTimePeriod, minDaysBeforeNextSchedule, timePeriod, freqOption, config, workingDays) {
  let subtractVal = minDaysBeforeNextSchedule;
  if (config.expiryDateToStartNextScheduleAtStartOfPeriod) {
    subtractVal = minDaysBeforeNextSchedule * (freqOption.freq - shedsInCurrentTimePeriod.length);
  } else {
    subtractVal = minDaysBeforeNextSchedule * (freqOption.freq - shedsInCurrentTimePeriod.length - 1);
  }

  return config.adjustOffDays
    ? reverseWorkingDaysAdjust(moment(timePeriod).subtract(subtractVal, "days"), workingDays)
    : moment(timePeriod).subtract(subtractVal, "days");
}

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
    !dueDateOfSchedule && (dueDateOfSchedule = moment(dateToCheckAgainst).add(freqOption.minDays, "days"));
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
      !expiryDateReceived && config.minDaysGapBetweenTimePeriodsInFutureSchedules && freqOption.minDays > 0 ? freqOption.minDays + 1 : 1;
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
    let ignoreCheckMaxIntervalWithinTimePeriod = timePeriodChange == true ? false : freqOption.freq == 1 || shedsLength == freqOption.freq;
    if (!ignoreCheckMaxIntervalWithinTimePeriod) {
      maxExpiryDate = timezoneMethodService.endOfDayMethod(
        moment(dateOfLastSchedule).add(freqOption.maxInterval, "days"),
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
      if (tsc && compareTwoDates(moment(tsc.date).add(freqOption.minDays ? freqOption.minDays : 0, "days"), currentTimePeriod, "ISOA")) {
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
