import { last } from "lodash";
import moment from "moment";

export const findInspectionStatus = (nextInspDate, freq, lastInspection = null, exec_schedules = []) => {
    let status = "Finished";
    const format = "YYYY-MM-DD";
    //check if inspection is due in that year

    let frequency = freq;
    if (frequency > 0) {
        frequency = frequency - 1;
    }

    var currentDate = moment().format(format);
    let inspectionYearStart = moment(nextInspDate, format).startOf('year');
    // let inspectionPeriodEnd = moment(nextInspDate, format).add(frequency, 'year').endOf('year');
    nextInspDate = moment(nextInspDate).format(format);
    let inspectionPeriodEnd = moment(nextInspDate, format).add(frequency, 'year').endOf('year');

    /* if lastInspection is not null and then it means that reschular service is called from GetAssetInspectionStatus.js, 
    */
    if (lastInspection != null) {
        nextInspDate = moment(nextInspDate).add(freq, 'year').format(format);
        inspectionYearStart = moment(nextInspDate, format).startOf('year');
        inspectionPeriodEnd = moment(nextInspDate, format).add(frequency,'year').endOf('year');
    }
    const nextInspection = moment(nextInspDate, format);
    let currentDateIsBetween = moment(currentDate, format);
    let isBetween = nextInspection.isBetween(inspectionYearStart, inspectionPeriodEnd, undefined, '[]');
    currentDateIsBetween = currentDateIsBetween.isBetween(inspectionYearStart, inspectionPeriodEnd, undefined, '[]');
    if (exec_schedules.length <= 0) {
        if (isBetween) {
            if (moment(currentDate).isBefore(nextInspDate) && currentDateIsBetween) {
                status = "Upcoming";
            }
            else if (moment(currentDate).isSameOrAfter(nextInspDate) && currentDateIsBetween) {
                status = "Overdue";
            } else if (moment(currentDate).isAfter(inspectionPeriodEnd) && !currentDateIsBetween) {
                status = "Missed";
            }
        }
    }
    else if (exec_schedules.length > 0) {
        for (let i = 0; i < exec_schedules.length; i++) {
            if (moment(exec_schedules[i].date).isAfter(inspectionPeriodEnd) && exec_schedules[i].status !== "Finished") {
                status = "Missed";
            }
            else {
                status = exec_schedules[i].status;
            }
        }

    }
    return status;
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


// export const currentDateIsBetweenInsectionDates = (lastInspDate, nextInspDate, freq) => {
//     let status = "Finished";
//     //check if inspection is due in that year
//     var currentDate = moment().format('MM/DD/YYYY');
//     let inspectionYearStart = moment(nextInspDate).startOf('year');
//     let inspectionPeriodEnd = moment(lastInspDate).add(freq, 'year').endOf('year');
//     const nextInspection = moment(nextInspDate, "MM/DD/YYYY");

//     let currentDateIsBetween = moment(currentDate, "MM/DD/YYYY");
//     const isBetween = nextInspection.isBetween(inspectionYearStart, inspectionPeriodEnd, undefined, '[]');
//     currentDateIsBetween = currentDateIsBetween.isBetween(inspectionYearStart, inspectionPeriodEnd, undefined, '[]');

//     if (isBetween) {
//         if (currentDate < moment(nextInspDate).format('MM/DD/YYYY') && currentDateIsBetween) {
//             status = "Upcoming";
//         }
//         else if (currentDate >= moment(nextInspDate).format('MM/DD/YYYY') && currentDateIsBetween) {
//             status = "Overdue";
//         }
//     }
//     return status;
// }