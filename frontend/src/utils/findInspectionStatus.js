import moment from "moment";
import { DATE_FORMAT } from './constants';
export const findAssetStatus = (inspectionCheckboxes, inspectionDates, inspectionTypes) => {
    let inspectionsStatus = {};
    if (inspectionDates && inspectionTypes) {
        inspectionTypes.forEach((type) => {
            let lastInspectionDate = inspectionDates[type.opt1.lastInspFieldName];
            let nextInspectionDate = inspectionDates[type.opt1.binding.nextInspFieldName];
            let inspectionFreq = type.opt1.frequency;
            if (inspectionCheckboxes[type.opt1.checkBoxName] == true) {
                let status = getInspectionStatus(lastInspectionDate, nextInspectionDate, inspectionFreq);
                inspectionsStatus[type.opt1.binding.nextInspFieldName + "_status"] = status;
            }
            else {
                inspectionsStatus[type.opt1.binding.nextInspFieldName + "_status"] = '';
            }
        })
    }

    return inspectionsStatus;
}

export const getInspectionStatus = (lastInspDate, nextInspDate, freq) => {
    let status = 'Finished';
    //check if inspection is due in that year
    var currentDate = moment();
    let inspectionYearStart = moment(nextInspDate).startOf('year').format(DATE_FORMAT);
    let inspectionYearEnd = moment(lastInspDate).add(freq, 'year').endOf('year').format(DATE_FORMAT);
    const nextInspection = moment(nextInspDate);
    let currentDateIsBetween = moment(currentDate, DATE_FORMAT);
    const isBetween = nextInspection.isBetween(inspectionYearStart, inspectionYearEnd, undefined, []);
    currentDateIsBetween = currentDateIsBetween.isBetween(inspectionYearStart, inspectionYearEnd, undefined, []);
    if (isBetween) {
        if (currentDate.isBefore(nextInspDate) && currentDateIsBetween) {
            status = "Upcoming";
        }
        else if (currentDate.isSameOrAfter(nextInspDate) && currentDateIsBetween) {
            status = "Overdue";
        }
    }
    return status;
}

export const findLocationTypeStatusColor = (locationType, inspectionsStatus) => {
    let statusFlag = {};
    let statusColor = '';
    if (locationType && inspectionsStatus) {
        if (locationType == "Located") {
            let value = '';
            Object.keys(inspectionsStatus).forEach((inspections) => {
                value = inspectionsStatus[inspections];
                if (value && value.length > 0) {
                    if (value == "Finished") {
                        statusFlag[inspections] = true;
                    }
                    else {
                        statusFlag[inspections] = false;
                    }
                }
            })
            const areTrue = Object.values(statusFlag).every(value => value === true);
            statusColor = areTrue ? 'green' : 'red';
        } else {
            statusColor = "#FFFF00";
        }
    }
    return statusColor;
}


